from RXSSAlgorithm import MainWindow


class LogicService():
    def __init__(self):
        return

    def configNewScan(self, dbName):  # Config new db u
        return

    def startScan(self, pageEntities=None, sessionEntity=None,
                  algoType=None):  # start scan by using the client info data
        if algoType == "ALL":
            self.__scanForRXSS(pageEntities=pageEntities, sessionEntity=sessionEntity)
            self.__scanForSqlInjection(pageEntities=pageEntities, sessionEntity=sessionEntity)
        elif algoType == "SQLI":
            self.__scanForSqlInjection()
        elif algoType == "RXSS":
            self.__scanForRXSS()

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
