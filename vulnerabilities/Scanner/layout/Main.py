from ClientController import SocketIOClient, RestServer

from LogicService import LogicService
import ConfigParser

if __name__ == '__main__':
    config = ConfigParser.RawConfigParser()
    config.read('..\common\config.properties')

    URL = config.get('SocketIOServerInfo', 'hostname')
    logicService = LogicService(db_type="test")
    socketIOClient = SocketIOClient(logicService)
    socketIOClient.connectToServer(URL)
    restServer = RestServer(logicService)
    # sio.emit('scan results', {'data': 'results'})
