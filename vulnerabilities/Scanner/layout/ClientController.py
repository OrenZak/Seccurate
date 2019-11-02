import socketio
import json

from ScanBoundary import ScanBoundary
from VulnerabilityBoundary import VulnerabilityBoundary
from configDatabaseBoundary import ConfigDatabaseBoundary


class SocketIOClient():
    global sio
    global clientLogicService
    sio = socketio.Client()

    def __init__(self, logicService):
        clientLogicService = logicService

    def connectToServer(self, serverURL):
        self.severURL = serverURL
        sio.connect(serverURL)

    def disconnectFromServer(self):
        sio.disconnect()

    @sio.event
    def connect(aaa):  # auto event - invoked when the connection is completed
        print("I'm connected!")
        print('my sid is', sio.sid)
        return

    @sio.event
    def disconnect(self):  # auto event - invoked when the client disconnected from the server
        print("I'm disconnected!")
        return

    @sio.on('config_database')
    def configNewScan(dbNameBoundary):  # set up a scan, needs to create a new db in the logic service
        dbBoundary = ConfigDatabaseBoundary.deserialize(dbNameBoundary)
        clientLogicService.configNewScan(dbBoundary.getDbName())
        return

    @sio.on('start_scan')
    def startScan(scanParams):  # start scan method, the server needs to provide urls to scan
        configScanBoundary = ScanBoundary.deserialize(scanParams)
        clientLogicService.startScan(pageEntities=configScanBoundary.getPageEntityies(),
                                     sessionEntity=configScanBoundary.getSessionEntity())

        return

    @sio.on('get_results')
    def sendScanResults(clientInfo):  # we need to get DB name ( which is scan name)
        vulnerabilityEntities = clientLogicService.retriveScanResults(clientInfo=clientInfo)
        scanResultBoundary = []
        for vulnEntity in vulnerabilityEntities:
            vulnBoundary = VulnerabilityBoundary(vulnEntity=vulnEntity, vulnDescriptionEntity="TODO get here something")
            scanResultBoundary.append(vulnBoundary.serialize())
        sio.emit('scan_results', {scanResultBoundary})
        return

    @sio.on('update_payloads')
    def updatePayloads(payloadObject):  # should be payload type and payload data
        # TODO create payloadBoundary if needed
        # TODO decided( by zur) to not implement this feature at the moment
        clientLogicService.updatePayloads(payloadObject=payloadObject)
        return
