import socketio

class SocketIOClient():
    sio = socketio.Client()
    def __init__(self):
        global sio
        print("Constructor")


    def connectToServer(self,serverURL):
        self.severURL = serverURL
        sio.connect(serverURL)

    def disconnectFromServer(self):
        sio.disconnect()

    @sio.event
    def connect(self): # auto event - invoked when the connection is completed
        print("I'm connected!")
        print('my sid is', sio.sid)

    @sio.event
    def disconnect(self): # auto event - invoked when the client disconnected from the server
        print("I'm disconnected!")

    @sio.on('find vulnerabilities')
    def startScan(url_list): # start scan method, the server needs to provide urls to scan
        print('I need to start scan')

    @sio.on('send vulnerabilities')
    def sendScan(db_name): # we need to get DB name ( which is scan name)
        print('I need to send results')
        #sio.emit('scan results', {'foo': 'bar'})

    @sio.on('update payloads')
    def updatePayloads(payloadObject):#should be payload type and payload data
        print('I need to update vulneabilities payloads')

