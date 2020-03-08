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
import hashlib
from CredentialsObject import CredentialsEntity


class TestSQLIAlgorithm(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__vulnsCRUD = VulnerabilitiesCRUD
        cls.__table_name = "test_vulns" + str(datetime.now()).replace('-', '').replace(' ', '').replace(':',
                                                                                                        '').replace('.',
                                                                                                                    '')
        # cls.__vulnsCRUD.createTable(cls.__table_name, "test")
        cls.__SQLICRUD = SQLICrud
        cls.__SQLICRUD.dropPayloadsTable("test2")
        cls.__SQLICRUD.dropResponsesTable("test2")
        cls.__SQLICRUD.createSQLITable("test2")
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD
        cls.__vulnDescriptor.dropTable("test2")
        cls.__vulnDescriptor.createTable("test2")
        cls.__br = mechanize.Browser()
        cls.__br.addheaders = [('User-agent',
                                'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
        cls.cj = mechanize.CookieJar()
        cls.__br.set_cookiejar(cls.cj)
        cls.__br.open("http://localhost/bwapp/login.php")
        cls.__br.select_form(nr=0)
        cls.__br.form['login'] = 'bee'
        cls.__br.form['password'] = 'bug'
        cls.__br.submit()
        cookie_value_string = []
        for cookie in cls.cj:
            cookie_dict = {"name": cookie.name, "value": cookie.value, "domain": cookie.domain, "path": cookie.path}
            cookie_value_string.append(cookie_dict)
            # cookie_value_string += cookie.name + "=" + cookie.value + "=" + cookie.domain + "=" + cookie.path + ";"
        cls.__session_entity = SessionEntity('Cookie', cookie_value_string)
        # cls.vulnUtils = VulnerabilityUtils(cls.__table_name, 'SQLI')
        cls.__sqlAlgorithm = SQLIAlgorithm(db_type='test2')  # , vuln_table_name=cls.__table_name)

    @classmethod
    def tearDownClass(cls):
        # cls.__vulnsCRUD.dropTable(cls.__table_name, "test")
        cls.__vulnsCRUD = None
        cls.__SQLICRUD = None
        cls.__vulnDescriptor = None

    def setUp(self):
        self.__vulnsCRUD.createTable(self.__table_name, "test2")
        self.vuln1 = VulnerabilityDescriptionEntity(name='error-based', severity=1, description='abc',
                                                    recommendations='aaa')
        self.vuln2 = VulnerabilityDescriptionEntity(name='time-based', severity=1, description='abc',
                                                    recommendations='aaa')
        self.__vulnDescriptor.createVulnerabilityDescription(self.vuln1, "test2")
        self.__vulnDescriptor.createVulnerabilityDescription(self.vuln2, "test2")
        self.sqli1 = SQLIPayloadEntity(payload="5;;5';;5''", type='error-based')
        self.sqli2 = SQLIPayloadEntity(payload="2;;' or sleep(2) -- -", type='time-based')
        self.sqli1ID = self.__SQLICRUD.createPayload(self.sqli1, "test2").getID()
        self.sqli2ID = self.__SQLICRUD.createPayload(self.sqli2, "test2").getID()
        self.response1 = self.__SQLICRUD.createResponse(ResponseEntity("error"), "test2")
        self.vulnUtils = VulnerabilityUtils(self.__table_name, 'SQLI')

    def tearDown(self):
        self.__vulnsCRUD.dropTable(self.__table_name, "test2")
        self.__SQLICRUD.deletePayloads("test2")
        self.__SQLICRUD.deleteResponses("test2")
        self.__vulnDescriptor.deleteAllDataFromTable("test2")
        self.vulnUtils = None

    def test_different_hash_detection(self):
        regular_response = unicode(self.__br.open("https://www.ynet.co.il").read(), 'utf-8')
        error_response = unicode(self.__br.open("https://www.haaretz.co.il").read(), 'utf-8')
        regular_result = (regular_response, self.vulnUtils.hash_page(regular_response), 2)
        error_result = (error_response, self.vulnUtils.hash_page(error_response), 2)
        regular_imitating_result = (regular_response, self.vulnUtils.hash_page(regular_response), 2)
        self.assertTrue(
            self.__sqlAlgorithm.validate_error_based(regular_result, error_result, regular_imitating_result,
                                                     self.vulnUtils))

    def test_get_error_based_responses(self):
        responses = [response.getResponse() for response in self.vulnUtils.get_error_based_responses()]
        self.assertIn(self.response1.getResponse(), responses)

    def test_scan_sqli_error_based(self):
        url = "http://localhost/bwapp/sqli_3.php"
        br = mechanize.Browser()
        br.addheaders = [('User-agent',
                          'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
        cj = mechanize.CookieJar()
        br.set_cookiejar(cj)
        br.open("http://localhost/bwapp/login.php")
        br.select_form(nr=0)
        br.form['login'] = 'bee'
        br.form['password'] = 'bug'
        br.submit()
        r = br.open(url)
        hash = hashlib.md5(url + str(len(str(r.read())))).digest().encode("hex")
        forms, links = self.vulnUtils.get_injection_points(PageEntity(url=url, pageHash=hash), self.__session_entity)
        self.__sqlAlgorithm.start_scan(PageEntity(url=url, pageHash=hash), forms=forms, links=links,
                                       vulnUtils=self.vulnUtils)
        self.assertEqual(len(VulnerabilitiesCRUD.getVulns("test2", self.__table_name)), 2)

    # def test_scan_sqli_time_based(self):
    #     url = "http://localhost/bwapp/sqli_15.php"
    #     br = mechanize.Browser()
    #     br.addheaders = [('User-agent',
    #                       'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
    #     cj = mechanize.CookieJar()
    #     br.set_cookiejar(cj)
    #     br.open("http://localhost/bwapp/login.php")
    #     br.select_form(nr=0)
    #     br.form['login'] = 'bee'
    #     br.form['password'] = 'bug'
    #     br.submit()
    #     r = br.open(url)
    #     hash = hashlib.md5(url + str(len(str(r.read())))).digest().encode("hex")
    #     forms, links = self.vulnUtils.get_injection_points(PageEntity(url=url, pageHash=hash), self.__session_entity)
    #     self.__sqlAlgorithm.start_scan(PageEntity(url=url, pageHash=hash), forms=forms, links=links,
    #                                    vulnUtils=self.vulnUtils)
    #     a = VulnerabilitiesCRUD.getVulns("test2", self.__table_name)
    #     self.assertEqual(len(VulnerabilitiesCRUD.getVulns("test2", self.__table_name)), 1)

    # def test_generate_new_cookie(self):
    #     url = "http://localhost/bwapp/sqli_3.php"
    #     creds = CredentialsEntity({"formAction": "http://localhost//bWAPP/login.php", "form": {
    #         "login": "bee",
    #         "password": "bug",
    #         "security": 0,
    #         "form": "submit"
    #     }})
    #     self.__vulnsCRUD.deleteAllDataFromTable(self.__table_name, "test2")
    #     vulnUtils = VulnerabilityUtils(self.__table_name, "SQLI", creds)
    #     #vulnUtils.generateNewCookie(creds)
    #     br = mechanize.Browser()
    #     br.addheaders = [('User-agent',
    #                       'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
    #     cj = mechanize.CookieJar()
    #     br.set_cookiejar(cj)
    #     br.open("http://localhost/bwapp/login.php")
    #     br.select_form(nr=0)
    #     br.form['login'] = 'bee'
    #     br.form['password'] = 'bug'
    #     br.submit()
    #     r = br.open(url)
    #     hash = hashlib.md5(url + str(len(str(r.read())))).digest().encode("hex")
    #     forms, links = vulnUtils.get_injection_points(PageEntity(url=url, pageHash=hash), None)
    #     self.__sqlAlgorithm.start_scan(PageEntity(url=url, pageHash=hash), forms=forms, links=links,
    #                                    vulnUtils=vulnUtils)
    #     self.assertEqual(len(VulnerabilitiesCRUD.getVulns("test2", self.__table_name)), 2)

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
