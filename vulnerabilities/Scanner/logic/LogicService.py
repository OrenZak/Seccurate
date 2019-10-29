from RXSSAlgorithm import MainWindow


class LogicService():
    def __init__(self):
        return

    def configNewScan(self, scanInfo):  # Config new db u
        return

    def startScan(self, pageEntities=None, sessionEntity=None):  # start scan by using the client info data
        self.__scanForRXSS(pageEntities=pageEntities, sessionEntity=sessionEntity)
        self.__scanForSqlInjection(pageEntities=pageEntities, sessionEntity=sessionEntity)

        return

    def retriveScanResults(self, clientInfo):  # retrive scan results given client Info
        return

    def updatePayloads(self, payloadObject):
        return

    def __scanForRXSS(self, pageEntities=None, sessionEntity=None):
        rxssalgo = MainWindow(pageEntities=pageEntities, sessionEntity=sessionEntity)
        rxssalgo.StartScan()
        return

    def __scanForSqlInjection(self, pageEntities=None, sessionEntity=None):
        # TODO How guy start his algorithm?
        return
