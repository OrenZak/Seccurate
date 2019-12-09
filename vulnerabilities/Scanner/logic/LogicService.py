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
####################################################
from VulnerabilityDescriptionObject import VulnerabilityDescriptionEntity
import RXSSCrud
import SQLICrud
from PayloadObjects import *


class LogicService(threading.Thread):
    def __init__(self, db_type):
        super(LogicService, self).__init__()
        config = ConfigParser.RawConfigParser()
        config.read('..\common\config.properties')
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
        ################################################
        # TODO: Zur I think the way we read configurations is not good. I t doesn't seem right
        self.sqliErroBasedDescripor = self.__vulnDescriptor.getVulnByName(config.get('SQLITypes', 'error_based'),
                                                                          self.env_type)
        self.rxssDescriptor = self.__vulnDescriptor.getVulnByName(config.get('RXSS', 'rxss'), self.env_type)

    def configNewScan(self, tableName=None, scanType=None, credentialsEntity=None):  # Config new db u
        self.__vulnCrud.createTable(tableName, self.env_type)
        self.__tableName = tableName
        self.__scanType = scanType
        self.vulnUtils = VulnerabilityUtils(tableName, scanType)
        print("vulnutils object : " + str(self.vulnUtils))
        self.credentialsEntity = credentialsEntity
        return

    def startScan(self, pageEntity=None,
                  sessionEntity=None):
        forms, links = self.vulnUtils.get_injection_points(pageEntity=pageEntity, sessionEntity=sessionEntity)
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
        vulnerabilityEntities = self.__vulnCrud.getVulns(getResultEntity.getScanName(), 1000, 0)
        return vulnerabilityEntities, self.rxssDescriptor, self.sqliErroBasedDescripor

    def updatePayloads(self, payloadObject):
        return

    def __scanForRXSS(self, pageEntity=None, forms=None, links=None):  # sessionEntity=None):
        flag = False
        if self.rxssalgo == None:
            print("init MainWindows")
            self.rxssalgo = MainWindow(db_type='test', table_name=self.__tableName)
        while not flag:
            try:
                self.rxssalgo.ScanPage(pageEntity=pageEntity, forms=forms, links=links, vulnUtils=self.vulnUtils)
                flag = True
            except CookieException:
                self.vulnUtils.generateNewCookie(self.credentialsEntity)
        return

    # TODO: what about type of db - prod or test? how do we get this value and pass it?
    def __scanForSqlInjection(self, pageEntity=None, forms=None, links=None):
        sqli_algo = SQLIAlgorithm(db_type='test')
        flag = False
        while not flag:
            try:
                sqli_algo.start_scan(pageEntity=pageEntity, forms=forms, links=links, vulnUtils=self.vulnUtils)
                flag = True
            except CookieException:
                self.vulnUtils.generateNewCookie(self.credentialsEntity)
        return

    def run(self):
        while True:
            if not ProducerConsumerQueue.getInstance().getIncomeQueue().empty():
                item = ProducerConsumerQueue.getInstance().getIncomeQueue().get()
                if isinstance(item, ConfigDatabaseMessage):
                    self.configNewScan(tableName=item.getDbName(), scanType=item.getScanType(),
                                       credentialsEntity=item)
                elif isinstance(item, ScanPageMessage):
                    self.startScan(pageEntity=item.getPageEntity(),
                                   sessionEntity=item.getSessionEntity())
