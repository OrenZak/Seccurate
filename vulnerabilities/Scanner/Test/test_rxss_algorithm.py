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
        cls.__vulnsCRUD.createTable(cls.__table_name)
        cls.RXSSCrud = RXSSCrud
        cls.RXSSCrud.dropTable()
        cls.RXSSCrud.createTable()
        cls.vulnDescriptor = VulnerabilityDescriptionCRUD
        cls.vulnDescriptor.dropTable()
        cls.vulnDescriptor.createTable()
        cls.br = mechanize.Browser()
        cls.br.addheaders = [('User-agent',
                              'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
        cls.cj = mechanize.CookieJar()
        cls.br.set_cookiejar(cls.cj)
        cls.br.open("http://localhost/bwapp/index.php")
        cls.br.select_form(nr=0)
        cls.br.form['login'] = 'bee'
        cls.br.form['password'] = 'bug'
        cls.br.submit()
        cookie_value_string = ""
        for cookie in cls.cj:
            cookie_value_string += cookie.name + "=" + cookie.value + "=" + cookie.domain + "=" + cookie.path + ";"
        cls.session_entity = SessionEntity('Cookie', cookie_value_string[:-1])
        cls.vulnUtils = VulnerabilityUtils(cls.__table_name)
        cls.rxssAlgorithm = MainWindow(db_type='test', table_name=cls.__table_name)

    @classmethod
    def tearDownClass(cls):
        cls.__vulnsCRUD.dropTable(cls.__table_name)
        cls.__vulnsCRUD = None
        cls.RXSSCrud = None
        cls.vulnDescriptor = None
        cls.vulnUtils = None

    def setUp(self):
        self.vuln1 = VulnerabilityDescriptionEntity(name="rxss", severity=2, description='defTest',
                                                    recommendations='bbb')
        self.vulnDescriptor.createVulnerabilityDescription(self.vuln1)
        self.rxss1 = RXSSPayloadEntity(payload="<script>console.log(123)</script>",
                                       expectedResult="<script>console.log(123)</script>")
        self.rxss1ID = self.RXSSCrud.createPayload(self.rxss1).getID()

    def tearDown(self):
        self.RXSSCrud.deleteAllDataFromTable
        self.vulnDescriptor.deleteAllDataFromTable()

    def test_scan_rxss(self):
        url = "http://localhost/bwapp/htmli_post.php"
        hash = "aaa"  # TODO: change after oren implements hash
        forms, links = self.vulnUtils.get_injection_points(PageEntity(url=url, pageHash=hash), self.session_entity)
        self.rxssAlgorithm.ScanPage(PageEntity(url=url, pageHash=hash), forms=forms, links=links,
                                    vulnUtils=self.vulnUtils)
        # (PageEntity(url=url, pageHash=hash), self.__session_entity)
        self.assertEqual(len(VulnerabilitiesCRUD.getVulns(self.__table_name)), 2)

    def doCleanups(self):
        pass

    def suite(self):
        pass


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestRXSSAlgorithm))
    unittest.TextTestRunner.run(suite)
