from RXSSAlgorithm import MainWindow
from SQLIAlgorithm import SQLIAlgorithm
from VulnerabilitiesCRUD import VulnerabilitiesCRUD


class LogicService():
    def __init__(self, db_type):
        self.__VulnCrud = VulnerabilitiesCRUD.getInstance(db_type)
        return

    def configNewScan(self, dbName):  # Config new db u
        self.__VulnCrud.createTable(dbName)
        self.__dbName = dbName
        return

    def startScan(self, pageEntity=None, sessionEntity=None,
                  algoType=None, db_type=None, vuln_table_name=None):  # start scan by using the client info data
        if algoType == "ALL":
            self.__scanForRXSS(pageEntity=pageEntity, sessionEntity=sessionEntity, db_type=db_type,
                               vuln_table_name=vuln_table_name)
            self.__scanForSqlInjection(pageEntities=pageEntity, sessionEntity=sessionEntity, db_type=db_type,
                                       vuln_table_name=vuln_table_name)
        elif algoType == "SQLI":
            self.__scanForSqlInjection()
        elif algoType == "RXSS":
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
        sqli_algo = SQLIAlgorithm(db_type='test', vuln_table_name=self.__dbName, page_entities=pageEntity,
                                  session_entity=sessionEntity)
        sqli_algo.start_scan()
        return
