import unittest
import SQLICrud
import VulnerabilitiesCRUD
from VulnerabilityDescriptionObject import VulnerabilityDescriptionEntity
import VulnerabilityDescriptionCRUD
from PayloadObjects import SQLIPayloadEntity
from SQLIAlgorithm import SQLIAlgorithm
from ResponseObject import ResponseEntity
import mechanize
from SessionObject import SessionEntity
from PageObject import PageEntity
from datetime import datetime
from BaseVulnerabilityClass import VulnerabilityUtils


class TestSQLIAlgorithm(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__vulnsCRUD = VulnerabilitiesCRUD
        cls.__table_name = "test_vulns" + str(datetime.now()).replace('-', '').replace(' ', '').replace(':', '').replace('.', '')
        cls.__vulnsCRUD.createTable(cls.__table_name)
        cls.__SQLICRUD = SQLICrud
        cls.__SQLICRUD.dropPayloadsTable()
        cls.__SQLICRUD.dropResponsesTable()
        cls.__SQLICRUD.createSQLITable()
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD
        cls.__vulnDescriptor.dropTable()
        cls.__vulnDescriptor.createTable()
        cls.__br = mechanize.Browser()
        cls.__br.addheaders = [('User-agent',
                                'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
        cls.cj = mechanize.CookieJar()
        cls.__br.set_cookiejar(cls.cj)
        cls.__br.open("http://localhost/bwapp/index.php")
        cls.__br.select_form(nr=0)
        cls.__br.form['login'] = 'bee'
        cls.__br.form['password'] = 'bug'
        cls.__br.submit()
        cookie_value_string = ""
        for cookie in cls.cj:
            cookie_value_string += cookie.name + "=" + cookie.value + "=" + cookie.domain + "=" + cookie.path + ";"
        cls.__session_entity = SessionEntity('Cookie', cookie_value_string[:-1])
        cls.vulnUtils = VulnerabilityUtils(cls.__table_name)
        cls.__sqlAlgorithm = SQLIAlgorithm(db_type='test')#, vuln_table_name=cls.__table_name)

    @classmethod
    def tearDownClass(cls):
        cls.__vulnsCRUD.dropTable(cls.__table_name)
        cls.__vulnsCRUD = None
        cls.__SQLICRUD = None
        cls.__vulnDescriptor = None
        cls.vulnUtils = None

    def setUp(self):
        self.vuln1 = VulnerabilityDescriptionEntity(name='error_based', severity=1, description='abc', recommendations='aaa')
        self.__vulnDescriptor.createVulnerabilityDescription(self.vuln1)
        self.sqli1 = SQLIPayloadEntity(payload="5;;5';;5''", type='error_based')
        self.sqli1ID = self.__SQLICRUD.createPayload(self.sqli1).getID()
        self.response1 = self.__SQLICRUD.createResponse(ResponseEntity("error"))

    def tearDown(self):
        self.__SQLICRUD.deletePayloads()
        self.__SQLICRUD.deleteResponses()
        self.__vulnDescriptor.deleteAllDataFromTable()

    def test_different_hash_detection(self):
        regular_response = unicode(self.__br.open("https://www.ynet.co.il").read(), 'utf-8')
        error_response = unicode(self.__br.open("https://www.haaretz.co.il").read(), 'utf-8')
        regular_result = (regular_response, self.vulnUtils.hash_page(regular_response), 2)
        error_result = (error_response, self.vulnUtils.hash_page(error_response), 2)
        regular_imitating_result = (regular_response, self.vulnUtils.hash_page(regular_response), 2)
        self.assertTrue(
            self.__sqlAlgorithm.validate_error_based(regular_result, error_result, regular_imitating_result))

    def test_get_error_based_responses(self):
        responses = [response.getResponse() for response in self.__sqlAlgorithm.get_error_based_responses()]
        self.assertIn(self.response1.getResponse(), responses)

    def test_scan_sqli(self):
        url = "http://localhost/bwapp/sqli_3.php"
        hash = "aaa"#TODO: change after oren implements hash
        forms, links = self.vulnUtils.get_injection_points(PageEntity(url=url, pageHash=hash), self.__session_entity)
        self.__sqlAlgorithm.start_scan(PageEntity(url=url, pageHash=hash), forms=forms, links=links, vulnUtils=self.vulnUtils)
            #(PageEntity(url=url, pageHash=hash), self.__session_entity)
        self.assertEqual(len(VulnerabilitiesCRUD.getVulns(self.__table_name)), 2)

    def doCleanups(self):
        pass

    def suite(self):
        pass


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestSQLIAlgorithm))
    unittest.TextTestRunner.run(suite)
    """suite = unittest.TestSuite()
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestDao))
    unittest.TextTestRunner.run(suite)


    suite1 = module1.TheTestSuite() (each one implements suite())
    suite2 = module2.TheTestSuite()
    alltests = unittest.TestSuite([suite1, suite2])"""
