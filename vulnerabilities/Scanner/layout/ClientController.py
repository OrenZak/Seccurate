import socketio
import json

from ScanBoundary import ScanBoundary
from VulnerabilityBoundary import VulnerabilityBoundary


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

    @sio.on('config new scan')
    def configNewScan(scanInfo):  # set up a scan, needs to create a new db in the logic service
        print('Set up a scan')
        print(scanInfo)
        return

    @sio.on('start scan')
    def startScan(scanParams):  # start scan method, the server needs to provide urls to scan
        configScanBoundry = ScanBoundary.deserialize(scanParams)
        clientLogicService.startScan(pageEntities=configScanBoundry.getPageEntityies(),
                                     sessionEntity=configScanBoundry.getSessionEntity())

        return

    @sio.on('get results')
    def sendScanResults(clientInfo):  # we need to get DB name ( which is scan name)
        vulnerabilityEntities = clientLogicService.retriveScanResults(clientInfo=clientInfo)
        scanResultBoundary = []
        for vulnEntity in vulnerabilityEntities:
            vulnBoundary = VulnerabilityBoundary(vulnEntity=vulnEntity, vulnDescriptionEntity="TODO get here something")
            scanResultBoundary.append(vulnBoundary.serialize())
        sio.emit('scan results', {scanResultBoundary})
        return

    @sio.on('update payloads')
    def updatePayloads(payloadObject):  # should be payload type and payload data
        # TODO create payloadBoundary if needed
        clientLogicService.updatePayloads(payloadObject=payloadObject)
        return
