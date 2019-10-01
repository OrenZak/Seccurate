import socketio


class SocketIOClient():
    global sio
    sio = socketio.Client()

    def __init__(self, logicService):
        self.logicService = logicService

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
        print('I need to start scan')
        print(scanParams)
        return

    @sio.on('get results')
    def sendScanResults(db_name):  # we need to get DB name ( which is scan name)
        print('I need to send results')
        print(db_name)
        sio.emit('scan results', {'data': 'results'})
        return

    @sio.on('update payloads')
    def updatePayloads(payloadObject):  # should be payload type and payload data
        print('I need to update vulneabilities payloads')
        print(payloadObject)
        return
