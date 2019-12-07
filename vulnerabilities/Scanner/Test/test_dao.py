import unittest
import SQLICrud
import RXSSCrud
import VulnerabilitiesCRUD
from VulnerabilityDescriptionObject import VulnerabilityDescriptionEntity
import VulnerabilityDescriptionCRUD
from PayloadObjects import SQLIPayloadEntity, RXSSPayloadEntity
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
from datetime import datetime
from ResponseObject import ResponseEntity


class TestSQLICRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.env = "prod"
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD
        try:
            cls.__vulnDescriptor.dropTable(cls.env)
        except:
            pass
        cls.__vulnDescriptor.createTable(cls.env)
        cls.__SQLICRUD = SQLICrud
        try:
            cls.__SQLICRUD.dropPayloadsTable(cls.env)
        except:
            pass
        try:
            cls.__SQLICRUD.dropResponsesTable(cls.env)
        except:
            pass
        cls.__SQLICRUD.createSQLITable(cls.env)

    @classmethod
    def tearDownClass(cls):
        cls.__SQLICRUD = None
        cls.__vulnDescriptor = None

    def setUp(self):
        vuln1 = VulnerabilityDescriptionEntity(name='error-based', severity=1, description='abc', recommendations='aaa')
        vuln2 = VulnerabilityDescriptionEntity(name='time-based', severity=2, description='def', recommendations='bbb')
        self.__vulnDescriptor.createVulnerabilityDescription(vuln1, self.env)
        self.__vulnDescriptor.createVulnerabilityDescription(vuln2, self.env)
        self.sqli1 = SQLIPayloadEntity(payload="'; WAITFOR DELAY '00:00:05.000'", type='error-based')
        self.sqli2 = SQLIPayloadEntity(payload='defTest', type='time-based')
        self.sqli1ID = self.__SQLICRUD.createPayload(self.sqli1, self.env).getID()
        self.sqli2ID = self.__SQLICRUD.createPayload(self.sqli2, self.env).getID()
        self.response1 = self.__SQLICRUD.createResponse(ResponseEntity("SQL"), self.env)
        self.response2 = self.__SQLICRUD.createResponse(ResponseEntity("error"), self.env)

    def tearDown(self):
        self.__SQLICRUD.deletePayloads(self.env)
        self.__SQLICRUD.deleteResponses(self.env)
        self.__vulnDescriptor.deleteAllDataFromTable(self.env)

    def test_create_payload(self):
        self.assertEqual(self.sqli1.getPayload(), self.__SQLICRUD.getSQLIPayloads(self.env, 1, 0)[0].getPayload())
        self.assertEqual(self.sqli2.getPayload(), self.__SQLICRUD.getSQLIPayloads(self.env, 1, 1)[0].getPayload())

    def test_create_response(self):
        self.assertEqual(self.response1.getResponse(), self.__SQLICRUD.getResponses(self.env, 1, 0)[0].getResponse())
        self.assertEqual(self.response2.getResponse(), self.__SQLICRUD.getResponses(self.env, 1, 1)[0].getResponse())

    def test_wrong_create_payload(self):
        self.assertNotEqual('abdTest', self.__SQLICRUD.getSQLIPayloads(self.env, 1, 0)[0].getPayload())
        with self.assertRaises(Exception):
            self.__SQLICRUD.createPayload(SQLIPayloadEntity(payload='a', type='b'), self.env)

    def test_get_payloads_pagination(self):
        self.assertEqual(len(self.__SQLICRUD.getSQLIPayloads(self.env, 2, 0)), 2)

    def test_get_by_id(self):
        self.assertEqual(self.sqli1.getPayload(), self.__SQLICRUD.getPayloadByID(self.sqli1ID, self.env).getPayload())
        self.assertEqual(self.sqli2.getPayload(), self.__SQLICRUD.getPayloadByID(self.sqli2ID, self.env).getPayload())

    def test_wrong_get_by_id(self):
        with self.assertRaises(Exception):
            self.__SQLICRUD.getPayloadByID(self.sqli2ID + self.sqli1ID, self.env)

    def test_get_payloads_by_type(self):
        self.assertEqual(1, len(self.__SQLICRUD.getPayloadsByType(env= self.env, type=self.sqli1.getType())))

    def test_get_payloads_types(self):
        for type in self.__SQLICRUD.getPayloadTypes(self.env):
            self.assertIn(type, [self.sqli1.getType(), self.sqli2.getType()])

    def test_get_responses(self):
        self.assertEqual(2, len(self.__SQLICRUD.getResponses(self.env)))

    def test_create_correct_number_of_payloads(self):
        self.assertEqual(2, len(self.__SQLICRUD.getSQLIPayloads(self.env)))

    def test_update_payload(self):
        self.__SQLICRUD.updatePayload(SQLIPayloadEntity(id=self.sqli2ID, payload='testUpdate', type=self.sqli2.getType()), self.env)
        self.assertEqual('testUpdate', self.__SQLICRUD.getPayloadByID(self.sqli2ID, self.env).getPayload())

    def test_update_payload_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__SQLICRUD.updatePayload(SQLIPayloadEntity(self.sqli2ID + self.sqli1ID, 'a', self.sqli2.getType()), self.env)

    def test_update_response(self):
        response3 = ResponseEntity("error3")
        self.__SQLICRUD.updateResponse(self.response1, response3, self.env)
        self.assertNotIn(self.response1, self.__SQLICRUD.getResponses(self.env))

    def test_delete_by_id(self):
        self.__SQLICRUD.deletePayloadByID(self.sqli1ID, self.env)
        self.assertEqual(1, len(self.__SQLICRUD.getSQLIPayloads(self.env)))

    def test_delete_response(self):
        self.__SQLICRUD.deleteResponse(self.response1, self.env)
        self.assertNotIn(self.response1, self.__SQLICRUD.getResponses(self.env))

    def test_delete_payloads(self):
        self.__SQLICRUD.deletePayloads(self.env)
        self.assertEqual(0, len(self.__SQLICRUD.getSQLIPayloads(self.env)))

    def test_delete_responses(self):
        self.__SQLICRUD.deleteResponses(self.env)
        self.assertEqual(0, len(self.__SQLICRUD.getResponses(self.env)))

    def test_foreign_key_deletion(self):
        self.__vulnDescriptor.deleteVulnByName(self.sqli1.getType(), self.env)
        #TODO: delete cascade won't work because you need a connection to sqlcrud table for it to enforce fk constraint...
        #print(self.__vulnDescriptor.getVulnByName(self.sqli1.getType()))
        with self.assertRaises(Exception):
             self.__SQLICRUD.getPayloadByID(self.sqli1ID, self.env)
        #print(self.__SQLICRUD.getPayloadByID(self.sqli1ID).getType())

    def doCleanups(self):
        pass

    def suite(self):
        pass


class TestRXSSCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.env = "prod"
        cls.__RXSSCRUD = RXSSCrud
        try:
            cls.__RXSSCRUD.dropTable(cls.env)
        except:
            pass
        cls.__RXSSCRUD.createTable(cls.env)
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD

    @classmethod
    def tearDownClass(cls):
        cls.__RXSSCRUD = None
        cls.__vulnDescriptor = None

    def setUp(self):
        self.rxss1 = RXSSPayloadEntity(payload='abcTest', expectedResult='a')
        self.rxss2 = RXSSPayloadEntity(payload='defTest', expectedResult='b')
        self.rxss1ID = self.__RXSSCRUD.createPayload(self.rxss1, self.env).getID()
        self.rxss2ID = self.__RXSSCRUD.createPayload(self.rxss2, self.env).getID()

    def tearDown(self):
        self.__RXSSCRUD.deleteAllDataFromTable(self.env)
        self.__vulnDescriptor.deleteAllDataFromTable(self.env)

    def test_create_payload(self):
        self.assertEqual(self.rxss1.getExpectedResult(), self.__RXSSCRUD.getRXSSPayloads(self.env, 1, 0)[0].getExpectedResult())
        self.assertEqual(self.rxss2.getExpectedResult(), self.__RXSSCRUD.getRXSSPayloads(self.env, 1, 1)[0].getExpectedResult())

    def test_wrong_create_payload(self):
        self.assertNotEqual('abdTest', self.__RXSSCRUD.getRXSSPayloads(self.env, 1, 0)[0].getPayload())


    def test_get_payloads_pagination(self):
        self.assertEqual(len(self.__RXSSCRUD.getRXSSPayloads(self.env, 2, 0)), 2)


    def test_read_by_id(self):
        self.assertEqual(self.rxss1.getPayload(), self.__RXSSCRUD.getPayloadByID(self.rxss1ID, self.env).getPayload())
        self.assertEqual(self.rxss2.getPayload(), self.__RXSSCRUD.getPayloadByID(self.rxss2ID, self.env).getPayload())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__RXSSCRUD.getPayloadByID(self.rxss2ID + self.rxss1ID, self.env)

    def test_create_correct_number_of_payloads(self):
        self.assertEqual(2, len(self.__RXSSCRUD.getRXSSPayloads(self.env)))

    def test_update(self):
        self.__RXSSCRUD.updatePayload(RXSSPayloadEntity(self.rxss2ID, 'testUpdate'), self.env)
        self.assertEqual('testUpdate', self.__RXSSCRUD.getPayloadByID(self.rxss2ID, self.env).getPayload())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__RXSSCRUD.updatePayload(RXSSPayloadEntity(self.rxss2ID + self.rxss1ID, 'a'), self.env)

    def test_delete_by_id(self):
        self.__RXSSCRUD.deletePayloadByID(self.rxss1ID, self.env)
        self.assertEqual(1, len(self.__RXSSCRUD.getRXSSPayloads(self.env)))

    def test_delete_all_data_from_table(self):
        self.__RXSSCRUD.deleteAllDataFromTable(self.env)
        self.assertEqual(0, len(self.__RXSSCRUD.getRXSSPayloads(self.env)))

    def doCleanups(self):
        pass

    def suite(self):
        pass


class TestVulnerabilitiesCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.env = "prod"
        cls.__VulnCrud = VulnerabilitiesCRUD
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD
        cls.table_name = 'vulns' + str(datetime.now()).replace('-', '').replace(' ', '').replace(':', '').replace('.', '')
        cls.__VulnCrud.createTable(cls.table_name, cls.env)
        VulnerabilityDescriptionCRUD.createTable(cls.env)

    @classmethod
    def tearDownClass(cls):
        cls.__VulnCrud.dropTable(cls.table_name, cls.env)
        cls.__VulnCrud = None
        cls.__vulnDescriptor = None

    def setUp(self):
        vuln_description1 = VulnerabilityDescriptionEntity(name='error-based', severity=1, description='abc',
                                                           recommendations='aaa')
        vuln_description2 = VulnerabilityDescriptionEntity(name='RXSS', severity=2, description='def',
                                                           recommendations='bbb')
        self.__vulnDescriptor.createVulnerabilityDescription(vuln_description1, self.env)
        self.__vulnDescriptor.createVulnerabilityDescription(vuln_description2, self.env)
        self.vuln1 = SimpleVulnerabilityEntity(name='error-based', url='http://www.something.com', payload='abcTest',
                                               requestB64='aa+=')
        self.vuln2 = SimpleVulnerabilityEntity(name='RXSS', url='http://www.anothersomething.com', payload='defTest',
                                               requestB64='bb==')
        self.vuln1ID = self.__VulnCrud.createVulnerability(self.vuln1, self.table_name, self.env).getID()
        self.vuln2ID = self.__VulnCrud.createVulnerability(self.vuln2, self.table_name, self.env).getID()

    def tearDown(self):
        self.__VulnCrud.deleteAllDataFromTable(self.table_name, self.env)
        self.__vulnDescriptor.deleteAllDataFromTable(self.env)

    def test_create_vulnerability(self):
        self.assertEqual(self.vuln1.getPayload(), self.__VulnCrud.getVulns(self.env, self.table_name, 1, 0)[0].getPayload())
        self.assertEqual(self.vuln2.getPayload(), self.__VulnCrud.getVulns(self.env, self.table_name, 1, 1)[0].getPayload())

    def test_wrong_create_vulnerability(self):
        self.assertNotEqual('abdTest', self.__VulnCrud.getVulns(self.env, self.table_name, 1, 0)[0].getPayload())
        with self.assertRaises(Exception):
            self.__VulnCrud.createVulnerability(
                SimpleVulnerabilityEntity(name='a', url='http://www.something.com', payload='abcTest',
                                          requestB64='aa+='), self.env)

    def test_get_vulnerabilities_pagination(self):
        self.assertEqual(len(self.__VulnCrud.getVulns(self.env, self.table_name, 2, 0)), 2)

    def test_read_by_id(self):
        self.assertEqual(self.vuln1.getPayload(), self.__VulnCrud.getVulnByID(self.vuln1ID, self.table_name, self.env).getPayload())
        self.assertEqual(self.vuln2.getPayload(), self.__VulnCrud.getVulnByID(self.vuln2ID, self.table_name, self.env).getPayload())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__VulnCrud.getVulnByID(self.vuln2ID + self.vuln1ID, self.table_name, self.env)

    def test_create_correct_number_of_vulnerabilities(self):
        self.assertEqual(2, len(self.__VulnCrud.getVulns(self.env, self.table_name)))

    def test_update(self):
        self.__VulnCrud.updateVuln(SimpleVulnerabilityEntity(id=self.vuln2ID, name=self.vuln2.getName(),
                                                             url='http://www.something.com', payload='testUpdate',
                                                             requestB64='aa+='), self.table_name, self.env)
        self.assertEqual('testUpdate', self.__VulnCrud.getVulnByID(self.vuln2ID, self.table_name, self.env).getPayload())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__VulnCrud.updateVuln(
                SimpleVulnerabilityEntity(id=self.vuln2ID + self.vuln1ID, name=self.vuln2.getName(),
                                          url='http://www.something.com', payload='testUpdate', requestB64='aa+='),
                self.table_name, self.env)

    def test_delete_by_id(self):
        self.__VulnCrud.deleteVulnByID(self.vuln1ID, self.table_name, self.env)
        self.assertEqual(1, len(self.__VulnCrud.getVulns(self.env, self.table_name)))

    def test_delete_all_data_from_table(self):
        self.__VulnCrud.deleteAllDataFromTable(self.table_name, self.env)
        self.assertEqual(0, len(self.__VulnCrud.getVulns(self.env, self.table_name)))

    def doCleanups(self):
        pass

    def suite(self):
        pass


class TestVulnerabilitiesDescriptionCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.env = "prod"
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD
        try:
            cls.__vulnDescriptor.dropTable(cls.env)
        except:
            pass
        cls.__vulnDescriptor.createTable(cls.env)

    @classmethod
    def tearDownClass(cls):
        cls.__vulnDescriptor = None

    def setUp(self):
        self.vuln_description1 = VulnerabilityDescriptionEntity(name='error-based', severity=1, description='abcTest',
                                                           recommendations='aaa')
        self.vuln_description2 = VulnerabilityDescriptionEntity(name='RXSS', severity=2, description='defTest',
                                                           recommendations='bbb')
        self.__vulnDescriptor.createVulnerabilityDescription(self.vuln_description1, self.env)
        self.__vulnDescriptor.createVulnerabilityDescription(self.vuln_description2, self.env)

    def tearDown(self):
        self.__vulnDescriptor.deleteAllDataFromTable(self.env)

    def test_create_vulnerability(self):
        self.assertEqual(self.vuln_description2.getDescription(), self.__vulnDescriptor.getVulns(self.env, 1, 0)[0].getDescription())
        self.assertEqual(self.vuln_description1.getDescription(), self.__vulnDescriptor.getVulns(self.env, 1, 1)[0].getDescription())

    def test_wrong_create_vulnerability(self):
        self.assertNotEqual('abdTest', self.__vulnDescriptor.getVulns(self.env, 1, 0)[0].getDescription())

    def test_get_vulnerabilities_pagination(self):
        self.assertEqual(len(self.__vulnDescriptor.getVulns(self.env, 2, 0)), 2)

    def test_read_by_id(self):
        self.assertEqual(self.vuln_description1.getDescription(),
                         self.__vulnDescriptor.getVulnByName(self.vuln_description1.getName(), self.env).getDescription())
        self.assertEqual(self.vuln_description2.getDescription(),
                         self.__vulnDescriptor.getVulnByName(self.vuln_description2.getName(), self.env).getDescription())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__vulnDescriptor.getVulnByName(self.vuln_description2.getName() + self.vuln_description1.getName(), self.env)

    def test_create_correct_number_of_vulnerabilities(self):
        self.assertEqual(2, len(self.__vulnDescriptor.getVulns(self.env)))

    def test_update(self):
        self.__vulnDescriptor.updateVuln(
            VulnerabilityDescriptionEntity(name=self.vuln_description2.getName(), severity=2,
                                           description='testUpdate', recommendations='bbb'), self.env)
        self.assertEqual('testUpdate',
                         self.__vulnDescriptor.getVulnByName(self.vuln_description2.getName(), self.env).getDescription())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__vulnDescriptor.updateVuln(
                VulnerabilityDescriptionEntity(name=self.vuln_description2.getName() + self.vuln_description1.getName(),
                                               severity=2, description='testUpdate', recommendations='bbb'), self.env)

    def test_delete_by_id(self):
        self.__vulnDescriptor.deleteVulnByName(self.vuln_description1.getName(), self.env)
        self.assertEqual(1, len(self.__vulnDescriptor.getVulns(self.env)))

    def test_delete_all_data_from_table(self):
        self.__vulnDescriptor.deleteAllDataFromTable(self.env)
        self.assertEqual(0, len(self.__vulnDescriptor.getVulns(self.env)))

    def doCleanups(self):
        pass

    def suite(self):
        pass


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestSQLICRUD))
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestRXSSCRUD))
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestVulnerabilitiesCRUD))
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestVulnerabilitiesDescriptionCRUD))
    unittest.TextTestRunner.run(suite)
    """suite = unittest.TestSuite()
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestDao))
    unittest.TextTestRunner.run(suite)
    
    
    suite1 = module1.TheTestSuite() (each one implements suite())
    suite2 = module2.TheTestSuite()
    alltests = unittest.TestSuite([suite1, suite2])"""
