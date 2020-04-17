import time
from ClientController import SocketIOClient, RestServer
from LogicService import LogicService
import ConfigParser

if __name__ == '__main__':
    config = ConfigParser.RawConfigParser()
    config.read('../common/config.properties')
    URL = config.get('SocketIOServerInfo', 'hostname')
    logicService = LogicService()
    socketIOClient = SocketIOClient()
    socketIOClient.connectToServer(URL)
    logicService.start()
    time.sleep(2)
    socketIOClient.start()
    restServer = RestServer(logicService)