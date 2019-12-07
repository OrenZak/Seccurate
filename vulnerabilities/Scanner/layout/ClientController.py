import socketio

from GetResultsRequestBoundary import GetResultsRequestBoundary
from PageBoundary import ScanBoundary
from ConfigDatabaseBoundary import ConfigDatabaseBoundary

from flask import Flask, jsonify
import threading

from VulnerabilityBoundary import VulnerabilityBoundary

app = Flask(__name__)


class RestServer():
    global clientLogicService

    def __init__(self, logicService):
        global clientLogicService
        clientLogicService = logicService
        app.run()

    @app.route('/h1')
    def ttt():
        print("thread: " + str(threading._get_ident()))

    @app.route('/get_results', methods=['POST'])
    def hello(serializedGetResultBoundary):
        vulnBoundaryList = []
        vulnerabilityEntities, rxssDescriptorEntity, sqliErroBasedDescriporEntity = clientLogicService.retriveScanResults(GetResultsRequestBoundary.deserialize(serializedGetResultBoundary).getResultsEntity())
        for vuln in vulnerabilityEntities:
            if vuln.getName() == rxssDescriptorEntity.getName():
                vulnBoundary = VulnerabilityBoundary(vulnEntity=vuln,vulnDescriptionEntity=rxssDescriptorEntity)
            elif vuln.getName() == sqliErroBasedDescriporEntity.getName():
                vulnBoundary = VulnerabilityBoundary(vulnEntity=vuln,vulnDescriptionEntity=sqliErroBasedDescriporEntity)
            else:
                continue
            vulnBoundaryList.append(vulnBoundary.serialize())
        return jsonify(vulnBoundaryList)

class SocketIOClient():
    global sio
    global clientLogicService
    global dbBoundary
    sio = socketio.Client()

    def __init__(self, logicService):
        global clientLogicService
        clientLogicService = logicService

    def connectToServer(self, serverURL):
        global clientLogicService
        self.severURL = serverURL
        sio.connect(serverURL)

    def disconnectFromServer(self):
        sio.disconnect()

    @sio.on('config_database')
    def configNewScan(dbNameBoundary):  # set up a scan, needs to create a new db in the logic service
        global clientLogicService
        dbBoundary = ConfigDatabaseBoundary.deserialize(dbNameBoundary)
        clientLogicService.configNewScan(dbBoundary.getDbName(), dbBoundary.getScanType())
        return

    @sio.on('scan_page')
    def startScan(scanParams):  # start scan method, the server needs to provide urls to scan
        configScanBoundary = ScanBoundary.deserialize(scanParams)
        print("thread: "+str(threading._get_ident()))
        clientLogicService.startScan(pageEntity=configScanBoundary.getPageEntity(),
                                     sessionEntity=configScanBoundary.getSessionEntity())
        sio.emit('scan_page_done')
        return

    @sio.on('update_payloads')
    def updatePayloads(payloadObject):  # should be payload type and payload data
        # TODO create payloadBoundary if needed
        # TODO decided( by zur) to not implement this feature at the moment
        clientLogicService.updatePayloads(payloadObject=payloadObject)
        return
