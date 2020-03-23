import time

import socketio

from ConfigDatabaseMessage import ConfigDatabaseMessage
from StartSecondOrderScanMessage import StartSecondOrderScanMessage
from CredentialsObject import CredentialsEntity
from GetResultsRequestBoundary import GetResultsRequestBoundary
from PageBoundary import ScanBoundary
from ConfigScanBoundary import ConfigScanBoundary
from ProducerConsumerQueue import ProducerConsumerQueue

from flask import Flask, jsonify, request
import threading
import json

from SecondOrderCompletedMessage import SecondOrderCompletedMessage
from NextPageMessage import NextPageMessage
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
    def results_api():
        #serializedGetResultBoundary):
        # TODO add threading support by create a new Message to return to the client, and wait for the message by while over the queue
        vulnBoundaryList = []
        vulnerabilityEntities, rxssDescriptorEntity, sqliErroBasedDescriporEntity, \
        sqliTimeBasedDescriptorEntity, sqliSecondOrderDescriptor = clientLogicService.retriveScanResults(
            GetResultsRequestBoundary.deserialize(request.get_json()).getResultsEntity())
        for vuln in vulnerabilityEntities:
            if vuln.getName() == rxssDescriptorEntity.getName():
                vulnBoundary = VulnerabilityBoundary(vulnEntity=vuln, vulnDescriptionEntity=rxssDescriptorEntity)
            elif vuln.getName() == sqliErroBasedDescriporEntity.getName():
                vulnBoundary = VulnerabilityBoundary(vulnEntity=vuln,
                                                     vulnDescriptionEntity=sqliErroBasedDescriporEntity)
            elif vuln.getName() == sqliTimeBasedDescriptorEntity.getName():
                vulnBoundary = VulnerabilityBoundary(vulnEntity=vuln, vulnDescriptionEntity=sqliTimeBasedDescriptorEntity)
            elif vuln.getName() == sqliSecondOrderDescriptor.getName():
                vulnBoundary = VulnerabilityBoundary(vulnEntity=vuln, vulnDescriptionEntity=sqliSecondOrderDescriptor)
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
        msg = ScanPageMessage(pageEntity=configScanBoundary.getPageEntity())
        # clientLogicService.startScan(pageEntity=configScanBoundary.getPageEntity(),
        #                              sessionEntity=configScanBoundary.getSessionEntity())
        print("Inserting ScanPageMessage to queue")
        ProducerConsumerQueue.getInstance().getIncomeQueue().put(msg)

    @sio.on('start_second_order_scan')
    def startSecondOrderScan():
        print("Inserting CrawlerCompletedMessage to queue")
        msg = StartSecondOrderScanMessage()
        ProducerConsumerQueue.getInstance().getIncomeQueue().put(msg)

    def run(self):
        while True:
            if not ProducerConsumerQueue.getInstance().getOutQueue().empty():
                item = ProducerConsumerQueue.getInstance().getOutQueue().get()
                if isinstance(item, NextPageMessage):
                    print("Done Scanning Current Page, Get Next Page")
                    sio.emit('next_page')
                if isinstance(item, SecondOrderCompletedMessage):
                    print("Done Scanning SQLI - Second Order")
                    sio.emit('second_order_completed')
