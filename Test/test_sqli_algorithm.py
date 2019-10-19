import unittest
from SQLICrud import SQLICrud
from VulnerabilitiesCRUD import VulnerabilitiesCRUD
from VulnerabilityDescriptionObject import VulnerabilityDescriptionObject
from VulnerabilityDescriptionCRUD import VulnerabilityDescriptionCRUD
from PayloadObjects import SQLIPayloadEntity
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
from SQLIAlgorithm import SQLIAlgorithm
from ResponseObject import ResponseEntity
import mechanize


class TestSQLIAlgorithm(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__SQLICRUD = SQLICrud.getInstance('D:\DB\TestVulnServiceDB.db')
        cls.__SQLICRUD.dropPayloadsTable()
        cls.__SQLICRUD.dropResponsesTable()
        cls.__SQLICRUD.createSQLITable()
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('D:\DB\TestVulnServiceDB.db')
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
        cls.__sqlAlgorithm = SQLIAlgorithm(db='D:\DB\TestVulnServiceDB.db', cookie_jar=cls.__br.cookiejar)

    @classmethod
    def tearDownClass(cls):
        cls.__SQLICRUD.closeConnection()
        cls.__SQLICRUD = None
        cls.__vulnDescriptor.closeConnection()
        cls.__vulnDescriptor = None

    def setUp(self):
        vuln1 = VulnerabilityDescriptionObject(name='Testname1', severity=1, description='abc', recommendations='aaa')
        vuln2 = VulnerabilityDescriptionObject(name='Testname2', severity=2, description='def', recommendations='bbb')
        self.vuln1ID = self.__vulnDescriptor.createVulnerabilityDescription(vuln1).getVulnID()
        self.vuln2ID = self.__vulnDescriptor.createVulnerabilityDescription(vuln2).getVulnID()
        self.sqli1 = SQLIPayloadEntity(payload="5;;5';;5''", type='error-based',
                                       vuln_descriptor=self.vuln1ID)
        self.sqli2 = SQLIPayloadEntity(payload='defTest', type='type2', vuln_descriptor=self.vuln2ID)
        self.sqli1ID = self.__SQLICRUD.createPayload(self.sqli1).getID()
        self.sqli2ID = self.__SQLICRUD.createPayload(self.sqli2).getID()
        self.response1 = self.__SQLICRUD.createResponse(ResponseEntity("error"))
        self.response2 = self.__SQLICRUD.createResponse(ResponseEntity("SQL"))

    def tearDown(self):
        self.__SQLICRUD.deletePayloads()
        self.__SQLICRUD.deleteResponses()
        self.__vulnDescriptor.deleteAllDataFromTable()

    def test_validate_error_based(self):
        regular_response = unicode(self.__br.open("https://www.ynet.co.il").read(), 'utf-8')
        error_response = unicode(self.__br.open("https://www.haaretz.co.il").read(), 'utf-8')
        regular_result = (regular_response, self.__sqlAlgorithm.hash_page(regular_response) , 2)
        error_result = (error_response, self.__sqlAlgorithm.hash_page(error_response), 2)
        regular_imitating_result = (regular_response, self.__sqlAlgorithm.hash_page(regular_response), 2)
        self.assertTrue(self.__sqlAlgorithm.validate_error_based(regular_result, error_result, regular_imitating_result))

    def test_get_error_based_responses(self):
        responses = [response.getResponse() for response in self.__sqlAlgorithm.get_error_based_responses()]
        self.assertIn(self.response1.getResponse(), responses)
        self.assertIn(self.response2.getResponse(), responses)

    """def test_get_injection_points(self):
        self.__sqlAlgorithm.update_links(["https://www.haaretz.co.il"])
        forms, links = self.__sqlAlgorithm.get_injection_points()
        print(forms)
        print (links)"""

    def test_scan_sqli(self):
        self.__sqlAlgorithm.update_links(["http://localhost/bwapp/sqli_3.php"])
        self.__sqlAlgorithm.scan_sqli()


    def test_get_cookies_from_jar(self):
        a = [(cookie.name,cookie.value) for cookie in self.cj]
        b = [(cookie.name, cookie.value) for cookie in self.__sqlAlgorithm.get_cookiejar()]
        self.assertEqual(a, b)

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
