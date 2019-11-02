from ClientController import SocketIOClient
import socketio

from LogicService import LogicService
import ConfigParser

# sio = socketio.Client()
#
#
# def connectToServer(serverURL):
#     # self.severURL = serverURL
#     sio.connect(serverURL)
#
#
# def disconnectFromServer():
#     sio.disconnect()
#
#
# @sio.event
# def connect():  # auto event - invoked when the connection is completed
#     print("I'm connected!")
#     print('my sid is', sio.sid)
#     return
#
#
# @sio.event
# def disconnect():  # auto event - invoked when the client disconnected from the server
#     print("I'm disconnected!")
#     return
#
#
# @sio.on('find vulnerabilities')
# def startScan(url_list):  # start scan method, the server needs to provide urls to scan
#     print('I need to start scan')
#     print(url_list)
#     return
#
#
# @sio.on('send vulnerabilities')
# def sendScan(db_name):  # we need to get DB name ( which is scan name)
#     print('I need to send results')
#     print(db_name)
#     sio.emit('scan results', {'data': 'results'})
#     return
#
#
# @sio.on('update payloads')
# def updatePayloads(payloadObject):  # should be payload type and payload data
#     print('I need to update vulneabilities payloads')
#     print(payloadObject)
#     return

if __name__ == '__main__':
    config = ConfigParser.RawConfigParser()
    config.read('..\common\config.properties')

    URL = config.get('SocketIOServerInfo', 'hostname')
    logicService = LogicService(db_type="test")
    c = SocketIOClient(logicService)
    c.connectToServer(URL)
    # sio.emit('scan results', {'data': 'results'})
