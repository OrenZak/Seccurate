import ConfigParser
import threading
import time

from ConfigDatabaseMessage import ConfigDatabaseMessage
from ProducerConsumerQueue import ProducerConsumerQueue
import VulnerabilityDescriptionCRUD
from RXSSAlgorithm import MainWindow
from SQLIAlgorithm import SQLIAlgorithm
import VulnerabilitiesCRUD
from BaseVulnerabilityClass import VulnerabilityUtils
from ScanCompleteMessage import ScanCompleteMessage
from ScanPageMessage import ScanPageMessage
from cookieExpiration import CookieException
from UnexplainedDifferentHashesException import UnexplainedDifferentHashesException
from DifferentHashesException import DifferentHashesException
####################################################
from VulnerabilityDescriptionObject import VulnerabilityDescriptionEntity
import RXSSCrud
import SQLICrud
from PayloadObjects import *
from ResponseObject import ResponseEntity


class LogicService(threading.Thread):
    def __init__(self, db_type):
        super(LogicService, self).__init__()
        config = ConfigParser.RawConfigParser()
        config.read('../common/config.properties')
        self.env_type = config.get('CurrentEnvironment', 'type')
        self.__vulnCrud = VulnerabilitiesCRUD
        self.__vulnDescriptor = VulnerabilityDescriptionCRUD
        self.rxssalgo = None
        ################################################
        # VulnerabilityDescriptionCRUD.createTable(self.env_type)
        # VulnerabilityDescriptionCRUD.createVulnerabilityDescription(VulnerabilityDescriptionEntity(name='error-based', severity=1, description='abcTest',
        #                                                    recommendations='aaa'), self.env_type)
        # VulnerabilityDescriptionCRUD.createVulnerabilityDescription(VulnerabilityDescriptionEntity(name='rxss', severity=2, description='defTest',
        #                                                         recommendations='bbb'), self.env_type)
        # rxss1 = RXSSPayloadEntity(payload="<script>console.log(123)</script>",
        #                               expectedResult="<script>console.log(123)</script>")
        # RXSSCrud.createTable(self.env_type)
        # RXSSCrud.createPayload(rxss1, self.env_type)
        # self.sqli1 = SQLIPayloadEntity(payload="5;;5';;5''", type='error-based')
        # SQLICrud.createSQLITable(self.env_type)
        # SQLICrud.createPayload(self.sqli1, self.env_type)
        # self.response1 = SQLICrud.createResponse(ResponseEntity("error"), "test")
        ################################################
        # TODO: Zur I think the way we read configurations is not good. I t doesn't seem right
        self.sqliErrorBasedDescriptor = self.__vulnDescriptor.getVulnByName(config.get('SQLITypes', 'error_based'),
                                                                          self.env_type)
        self.sqliTimeBasedDescriptor = self.__vulnDescriptor.getVulnByName(config.get('SQLITypes', 'time_based'),
                                                                          self.env_type)
        self.rxssDescriptor = self.__vulnDescriptor.getVulnByName(config.get('RXSS', 'rxss'), self.env_type)

    def configNewScan(self, tableName=None, scanType=None, credentialsEntity=None):  # Config new db u
        self.__vulnCrud.createTable(tableName, self.env_type)
        self.__tableName = tableName
        self.__scanType = scanType
        self.credentialsEntity = credentialsEntity
        self.vulnUtils = VulnerabilityUtils(tableName, scanType, credentialsEntity)
        print("vulnutils object : " + str(self.vulnUtils))
        return

    def startScan(self, pageEntity=None):#, sessionEntity=None):
        flag = False
        while not flag:
            try:
                forms, links = self.vulnUtils.get_injection_points(pageEntity=pageEntity)
                pageEntity.setPageHash(self.vulnUtils.getPageHash(pageEntity.getURL()))
                flag = True
            except DifferentHashesException as e:
                print("in startScan->getInjectionPoints\n" + e.message)
                self.vulnUtils.updateAuthenticationMethod()
            except UnexplainedDifferentHashesException:
                raise UnexplainedDifferentHashesException("No login required yet different hash detected in url: " + pageEntity.getURL())
        print("url is being scanned : " + pageEntity.getURL())
        if self.__scanType == "ALL":
            self.__scanForRXSS(pageEntity=pageEntity, forms=forms, links=links)
            self.__scanForSqlInjection(pageEntity=pageEntity, forms=forms, links=links)
        elif self.__scanType == "SQLI":
            self.__scanForSqlInjection(pageEntity=pageEntity, forms=forms, links=links)
        elif self.__scanType == "RXSS":
            self.__scanForRXSS(pageEntity=pageEntity, forms=forms, links=links)
        scanCompleteMsg = ScanCompleteMessage()
        print("Insert Scan complete message to queue")
        ProducerConsumerQueue.getInstance().getOutQueue().put(scanCompleteMsg)
        return

    def retriveScanResults(self, getResultEntity):
        vulnerabilityEntities = self.__vulnCrud.getVulns(self.env_type, getResultEntity.getScanName(), 1000, 0)
        return vulnerabilityEntities, self.rxssDescriptor, self.sqliErrorBasedDescriptor, self.sqliTimeBasedDescriptor

    def updatePayloads(self, payloadObject):
        return

    def __scanForRXSS(self, pageEntity=None, forms=None, links=None):
        flag = False
        if self.rxssalgo == None:
            print("init MainWindows")
            self.rxssalgo = MainWindow(db_type='test', table_name=self.__tableName)
        while not flag:
            try:
                self.rxssalgo.ScanPage(pageEntity=pageEntity, forms=forms, links=links, vulnUtils=self.vulnUtils)
                flag = True
            except DifferentHashesException as e:
                print("in scan for rxss\n" + e.message)
                self.vulnUtils.updateAuthenticationMethod()
        return

    # TODO: what about type of db - prod or test? how do we get this value and pass it?
    def __scanForSqlInjection(self, pageEntity=None, forms=None, links=None):
        sqli_algo = SQLIAlgorithm(db_type='test')
        flag = False
        while not flag:
            try:
                sqli_algo.start_scan(pageEntity=pageEntity, forms=forms, links=links, vulnUtils=self.vulnUtils)
                flag = True
            except DifferentHashesException as e:
                print("in scan for sqli\n" + e.message)
                self.vulnUtils.updateAuthenticationMethod()
        return

    def run(self):
        while True:
            if not ProducerConsumerQueue.getInstance().getIncomeQueue().empty():
                item = ProducerConsumerQueue.getInstance().getIncomeQueue().get()
                if isinstance(item, ConfigDatabaseMessage):
                    self.configNewScan(tableName=item.getDbName(), scanType=item.getScanType(),
                                       credentialsEntity=item.getCredentialsEntity())
                elif isinstance(item, ScanPageMessage):
                    self.startScan(pageEntity=item.getPageEntity())
