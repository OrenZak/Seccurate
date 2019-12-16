import unittest
import RXSSCrud
import VulnerabilitiesCRUD
from VulnerabilityDescriptionObject import VulnerabilityDescriptionEntity
import VulnerabilityDescriptionCRUD
from PayloadObjects import RXSSPayloadEntity
from RXSSAlgorithm import MainWindow
from ResponseObject import ResponseEntity
import mechanize
from SessionObject import SessionEntity
from PageObject import PageEntity
from datetime import datetime
from BaseVulnerabilityClass import VulnerabilityUtils


class TestRXSSAlgorithm(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__vulnsCRUD = VulnerabilitiesCRUD
        cls.__table_name = "test_vulns" + str(datetime.now()).replace('-', '').replace(' ', '').replace(':',
                                                                                                        '').replace('.',
                                                                                                                    '')
        cls.test = "test"
        cls.__vulnsCRUD.createTable(cls.__table_name, cls.test)
        cls.RXSSCrud = RXSSCrud
        cls.RXSSCrud.dropTable(cls.test)
        cls.RXSSCrud.createTable(cls.test)
        cls.vulnDescriptor = VulnerabilityDescriptionCRUD
        cls.vulnDescriptor.dropTable(cls.test)
        cls.vulnDescriptor.createTable(cls.test)
        cls.br = mechanize.Browser()
        cls.br.addheaders = [('User-agent',
                              'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
        cls.cj = mechanize.CookieJar()
        cls.br.set_cookiejar(cls.cj)
        cls.br.open("http://localhost/bwapp/login.php")
        cls.br.select_form(nr=0)
        cls.br.form['login'] = 'bee'
        cls.br.form['password'] = 'bug'
        cls.br.submit()
        cls.scanType = 'RXSS'
        cookie_value_string = []
        for cookie in cls.cj:
            cookie_dict = {"name": cookie.name, "value": cookie.value, "domain": cookie.domain, "path": cookie.path}
            cookie_value_string.append(cookie_dict)
        cls.session_entity = SessionEntity('Cookie', cookie_value_string)
        cls.rxss1 = RXSSPayloadEntity(payload="<script>console.log(123)</script>",
                                      expectedResult="<script>console.log(123)</script>")
        cls.rxss1ID = cls.RXSSCrud.createPayload(cls.rxss1, cls.test).getID()
        cls.vulnUtils = VulnerabilityUtils(cls.__table_name, cls.scanType)
        cls.rxssAlgorithm = MainWindow(db_type='test', table_name=cls.__table_name)

    @classmethod
    def tearDownClass(cls):
        cls.RXSSCrud.deleteAllDataFromTable(cls.test)
        cls.vulnDescriptor.deleteAllDataFromTable(cls.test)
        cls.__vulnsCRUD.dropTable(cls.__table_name, cls.test)
        cls.__vulnsCRUD = None
        cls.RXSSCrud = None
        cls.vulnDescriptor = None
        cls.vulnUtils = None

    def setUp(self):
        None

    def tearDown(self):
        None

    def test_scan_rxss(self):
        url = "http://localhost/bwapp/htmli_post.php"
        hash = '160145d0db671bffecb5cada4fa4a2f9'
        forms, links = self.vulnUtils.get_injection_points(PageEntity(url=url, pageHash=hash), self.session_entity)
        self.rxssAlgorithm.ScanPage(PageEntity(url=url, pageHash=hash), forms=forms, links=links,
                                    vulnUtils=self.vulnUtils)
        self.rxssAlgorithm.ScanPage(PageEntity(url=url, pageHash=hash), forms=forms, links=links,
                                    vulnUtils=self.vulnUtils)
        self.assertEqual(len(VulnerabilitiesCRUD.getVulns(self.test, self.__table_name)), 4)

    def doCleanups(self):
        pass

    def suite(self):
        pass


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestRXSSAlgorithm))
    unittest.TextTestRunner.run(suite)
