from RXSSAlgorithm import MainWindow
from SQLIAlgorithm import SQLIAlgorithm
import VulnerabilitiesCRUD
from BaseVulnerabilityClass import VulnerabilityUtils


class LogicService():
    def __init__(self, db_type):
        self.__VulnCrud = VulnerabilitiesCRUD
        # self.vulnUtils = VulnerabilityUtils()
        return

    def configNewScan(self, tableName, scanType):  # Config new db u
        self.__VulnCrud.createTable(tableName)
        self.__tableName = tableName
        self.__scanType = scanType
        self.vulnUtils = VulnerabilityUtils(tableName)
        return

    def startScan(self, pageEntity=None,
                  sessionEntity=None):  # , db_type=None, vuln_table_name=None):  # start scan by using the client info data
        forms, links = self.vulnUtils.get_injection_points(pageEntity=pageEntity, sessionEntity=sessionEntity)
        if self.__scanType == "ALL":
            self.__scanForRXSS(pageEntity=pageEntity, forms=forms, links=links)
            self.__scanForSqlInjection(pageEntity=pageEntity, forms=forms, links=links)
        elif self.__scanType == "SQLI":
            self.__scanForSqlInjection(pageEntity=pageEntity, forms=forms, links=links)
        elif self.__scanType == "RXSS":
            self.__scanForRXSS(pageEntity=pageEntity, forms=forms, links=links)
        return

    def retriveScanResults(self, clientInfo):  # retrive scan results given client Info
        return

    def updatePayloads(self, payloadObject):
        return

    def __scanForRXSS(self, pageEntity=None, forms=None, links=None):  # sessionEntity=None):
        # rxssalgo = MainWindow(db_type='test', table_name=self.__tableName)
        # TODO: Zur complete according to changes to rxssalgorithm
        rxssalgo = MainWindow(db_type='test', table_name=self.__tableName)
        rxssalgo.ScanPage(pageEntity=pageEntity, forms=forms, links=links, vulnUtils=self.vulnUtils)
        return

    # TODO: what about type of db - prod or test? how do we get this value and pass it?
    def __scanForSqlInjection(self, pageEntity=None, forms=None, links=None):
        sqli_algo = SQLIAlgorithm(db_type='test')
        sqli_algo.start_scan(pageEntity=pageEntity, forms=forms, links=links, vulnUtils=self.vulnUtils)
        return
