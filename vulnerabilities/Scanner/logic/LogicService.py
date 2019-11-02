from RXSSAlgorithm import MainWindow
from SQLIAlgorithm import SQLIAlgorithm


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

    #TODO: zur I expect to get here the vulnerabilities table_name. is it the db_name that you get in configscan? and what about type of db - prod or test?
    def __scanForSqlInjection(self, pageEntities=None, sessionEntity=None):
        sqli_algo = SQLIAlgorithm(db_type='prod', vuln_table_name='toBeCompleterd', page_entities=pageEntities,
                                  session_entity=sessionEntity)
        sqli_algo.start_scan()
        return
