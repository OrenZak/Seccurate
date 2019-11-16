from ClientController import SocketIOClient
import socketio

from LogicService import LogicService
import ConfigParser

if __name__ == '__main__':
    config = ConfigParser.RawConfigParser()
    config.read('..\common\config.properties')

    URL = config.get('SocketIOServerInfo', 'hostname')
    logicService = LogicService(db_type="test")
    c = SocketIOClient(logicService)
    c.connectToServer(URL)
    # sio.emit('scan results', {'data': 'results'})
