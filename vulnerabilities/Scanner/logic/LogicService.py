from RXSSAlgorithm import MainWindow


class LogicService():
    def __init__(self):
        return

    def configNewScan(scanInfo):  # Config new db u
        return

    def startScan(pageEntities=None, sessionEntity=None):  # start scan by using the client info data
        rxssalgo = MainWindow(pageEntities=pageEntities, sessionEntity=sessionEntity)
        rxssalgo.StartScan()
        # TODO How guy start his algorithm?
        return

    def retriveScanResults(self, clientInfo):  # retrive scan results given client Info
        return

    def updatePayloads(self, payloadObject):
        return

    def __scanForRXSS(self):
        return

    def __scanForSqlInjection(self):
        return
