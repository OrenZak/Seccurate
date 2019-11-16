from RXSSAlgorithm import MainWindow
from SQLIAlgorithm import SQLIAlgorithm
import VulnerabilitiesCRUD


class LogicService():
    def __init__(self, db_type):
        self.__VulnCrud = VulnerabilitiesCRUD
        return

    def configNewScan(self, dbName, scanType):  # Config new db u
        self.__VulnCrud.createTable(dbName)
        self.__dbName = dbName
        self.__scanType = scanType
        return

    def startScan(self, pageEntity=None, sessionEntity=None):#, db_type=None, vuln_table_name=None):  # start scan by using the client info data
        if self.__scanType == "ALL":
            self.__scanForRXSS(pageEntity=pageEntity, sessionEntity=sessionEntity)
            self.__scanForSqlInjection(pageEntity=pageEntity, sessionEntity=sessionEntity)
        elif self.__scanType == "SQLI":
            self.__scanForSqlInjection()
        elif self.__scanType == "RXSS":
            self.__scanForRXSS()
        return

    def retriveScanResults(self, clientInfo):  # retrive scan results given client Info
        return

    def updatePayloads(self, payloadObject):
        return

    def __scanForRXSS(self, pageEntity=None, sessionEntity=None):
        rxssalgo = MainWindow(db_type='test', vuln_table_name=self.__dbName)
        rxssalgo.ScanPage(pageEntity=pageEntity,
                          sessionEntity=sessionEntity)
        return

    # TODO: zur I expect to get here the vulnerabilities table_name. is it the db_name that you get in configscan? and what about type of db - prod or test?
    # TODO : i ut it here for you, pls check, you also need to change the algoritm to get page and session per page
    def __scanForSqlInjection(self, pageEntity=None, sessionEntity=None):
        sqli_algo = SQLIAlgorithm(db_type='test', vuln_table_name=self.__dbName)
        sqli_algo.start_scan(pageEntity=pageEntity, sessionEntity=sessionEntity)
        return
