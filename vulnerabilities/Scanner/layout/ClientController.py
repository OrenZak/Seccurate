import socketio
import json

from PageBoundary import ScanBoundary
from VulnerabilityBoundary import VulnerabilityBoundary
from configDatabaseBoundary import ConfigDatabaseBoundary


class SocketIOClient():
    global sio
    global clientLogicService
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
        clientLogicService.startScan(pageEntity=configScanBoundary.getPageEntity(),
                                     sessionEntity=configScanBoundary.getSessionEntity())
        sio.emit('scan_page_done')

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
