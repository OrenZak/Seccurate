import ConfigParser

import VulnerabilityDescriptionCRUD
from RXSSAlgorithm import MainWindow
from SQLIAlgorithm import SQLIAlgorithm
import VulnerabilitiesCRUD
from BaseVulnerabilityClass import VulnerabilityUtils


class LogicService():
    def __init__(self, db_type):
        config = ConfigParser.RawConfigParser()
        config.read('..\common\config.properties')
        self.__vulnCrud = VulnerabilitiesCRUD
        self.__vulnDescriptor = VulnerabilityDescriptionCRUD
        #TODO: Zur I think the way we read configurations is not good. I t doesn't seem right
        self.sqliErroBasedDescripor = self.__vulnDescriptor.getVulnByName(config.get('SQLITypes', 'error_based'))
        self.rxssDescriptor = self.__vulnDescriptor.getVulnByName(config.get('RXSS', 'rxss'))

    def configNewScan(self, tableName, scanType):  # Config new db u
        self.__vulnCrud.createTable(tableName)
        self.__tableName = tableName
        self.__scanType = scanType
        self.vulnUtils = VulnerabilityUtils(tableName, scanType)
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

    def retriveScanResults(self, getResultEntity):
        vulnerabilityEntities = self.__vulnCrud.getVulns(getResultEntity.getScanName(), 1000, 0)
        return vulnerabilityEntities, self.rxssDescriptor, self.sqliErroBasedDescripor

    def updatePayloads(self, payloadObject):
        return

    def __scanForRXSS(self, pageEntity=None, forms=None, links=None):  # sessionEntity=None):
        rxssalgo = MainWindow(db_type='test', table_name=self.__tableName)
        rxssalgo.ScanPage(pageEntity=pageEntity, forms=forms, links=links, vulnUtils=self.vulnUtils)
        return

    # TODO: what about type of db - prod or test? how do we get this value and pass it?
    def __scanForSqlInjection(self, pageEntity=None, forms=None, links=None):
        sqli_algo = SQLIAlgorithm(db_type='test')
        sqli_algo.start_scan(pageEntity=pageEntity, forms=forms, links=links, vulnUtils=self.vulnUtils)
        return
