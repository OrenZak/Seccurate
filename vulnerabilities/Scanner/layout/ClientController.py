import time

import socketio

from ConfigDatabaseMessage import ConfigDatabaseMessage
from CredentialsObject import CredentialsEntity
from GetResultsRequestBoundary import GetResultsRequestBoundary
from PageBoundary import ScanBoundary
from ConfigScanBoundary import ConfigScanBoundary
from ProducerConsumerQueue import ProducerConsumerQueue

from flask import Flask, jsonify, request
import threading
import json

from ScanCompleteMessage import ScanCompleteMessage
from ScanPageMessage import ScanPageMessage
from VulnerabilityBoundary import VulnerabilityBoundary

app = Flask(__name__)


class RestServer():
    global clientLogicService

    def __init__(self, logicService):
        global clientLogicService
        clientLogicService = logicService
        app.run(host='0.0.0.0')

    @app.route('/get_results', methods=['POST'])
    def hello():
        #serializedGetResultBoundary):
        # TODO add threading support by create a new Message to return to the client, and wait for the message by while over the queue
        vulnBoundaryList = []
        vulnerabilityEntities, rxssDescriptorEntity, sqliErroBasedDescriporEntity = clientLogicService.retriveScanResults(
            GetResultsRequestBoundary.deserialize(request.get_json()).getResultsEntity())
        for vuln in vulnerabilityEntities:
            if vuln.getName() == rxssDescriptorEntity.getName():
                vulnBoundary = VulnerabilityBoundary(vulnEntity=vuln, vulnDescriptionEntity=rxssDescriptorEntity)
            elif vuln.getName() == sqliErroBasedDescriporEntity.getName():
                vulnBoundary = VulnerabilityBoundary(vulnEntity=vuln,
                                                     vulnDescriptionEntity=sqliErroBasedDescriporEntity)
            else:
                continue
            vulnBoundaryList.append(vulnBoundary.serialize())
        #return json.dumps(vulnBoundaryList)
        return jsonify(vulnBoundaryList)


class SocketIOClient(threading.Thread):
    global sio
    # global clientLogicService
    global dbBoundary
    sio = socketio.Client()

    def __init__(self):
        super(SocketIOClient, self).__init__()
        global clientLogicService
        # clientLogicService = logicService

    def connectToServer(self, serverURL):
        # global clientLogicService
        self.severURL = serverURL
        sio.connect(serverURL)

    def disconnectFromServer(self):
        sio.disconnect()

    @sio.on('config_database')
    def configNewScan(dbNameBoundary):  # set up a scan, needs to create a new db in the logic service
        print("config database")
        # global clientLogicService
        dbBoundary = ConfigScanBoundary.deserialize(dbNameBoundary)
        credentialsEntity = CredentialsEntity(dbBoundary.getLoginInfo())
        msg = ConfigDatabaseMessage(dbName=dbBoundary.getDbName(), scanType=dbBoundary.getScanType(),
                                    credentialsEntity=credentialsEntity)
        print("Inserting ConfigDatabaseMessage to queue")
        ProducerConsumerQueue.getInstance().getIncomeQueue().put(msg)
        # clientLogicService.configNewScan(tableName=dbBoundary.getDbName(), scanType=dbBoundary.getScanType(),
        #                                  credentialsEntity=credentialsEntity)
        return

    @sio.on('scan_page')
    def startScan(scanParams):  # start scan method, the server needs to provide urls to scan
        configScanBoundary = ScanBoundary.deserialize(scanParams)
        msg = ScanPageMessage(pageEntity=configScanBoundary.getPageEntity(),
                              sessionEntity=configScanBoundary.getSessionEntity())
        # clientLogicService.startScan(pageEntity=configScanBoundary.getPageEntity(),
        #                              sessionEntity=configScanBoundary.getSessionEntity())
        print("Inserting ScanPageMessage to queue")
        ProducerConsumerQueue.getInstance().getIncomeQueue().put(msg)

    def run(self):
        while True:
            if not ProducerConsumerQueue.getInstance().getOutQueue().empty():
                item = ProducerConsumerQueue.getInstance().getOutQueue().get()
                if isinstance(item, ScanCompleteMessage):
                    print("Done Scanning Current Page")
                    sio.emit('scan_page_done')
