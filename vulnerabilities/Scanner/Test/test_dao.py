import unittest
from SQLICrud import SQLICrud
from RXSSCrud import RXSSCrud
from VulnerabilitiesCRUD import VulnerabilitiesCRUD
from VulnerabilityDescriptionObject import VulnerabilityDescriptionEntity
from VulnerabilityDescriptionCRUD import VulnerabilityDescriptionCRUD
from PayloadObjects import SQLIPayloadEntity, RXSSPayloadEntity
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
from datetime import datetime
from ResponseObject import ResponseEntity


class TestSQLICRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__SQLICRUD = SQLICrud.getInstance('C:\DB\TestVulnServiceDB.db')
        cls.__SQLICRUD.dropPayloadsTable()
        cls.__SQLICRUD.dropResponsesTable()
        cls.__SQLICRUD.createSQLITable()
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('C:\DB\TestVulnServiceDB.db')
        cls.__vulnDescriptor.dropTable()
        cls.__vulnDescriptor.createTable()

    @classmethod
    def tearDownClass(cls):
        cls.__SQLICRUD.closeConnection()
        cls.__SQLICRUD = None
        cls.__vulnDescriptor = None  # vulnDescriptor will only be closed by the last class using it to avoid programming error

    def setUp(self):
        vuln1 = VulnerabilityDescriptionEntity(name='Testname1', severity=1, description='abc', recommendations='aaa')
        vuln2 = VulnerabilityDescriptionEntity(name='Testname2', severity=2, description='def', recommendations='bbb')
        self.vuln1ID = self.__vulnDescriptor.createVulnerabilityDescription(vuln1).getVulnID()
        self.vuln2ID = self.__vulnDescriptor.createVulnerabilityDescription(vuln2).getVulnID()
        self.sqli1 = SQLIPayloadEntity(payload="'; WAITFOR DELAY '00:00:05.000'", type='error-based',
                                       vuln_descriptor=self.vuln1ID)
        self.sqli2 = SQLIPayloadEntity(payload='defTest', type='type2', vuln_descriptor=self.vuln2ID)
        self.sqli1ID = self.__SQLICRUD.createPayload(self.sqli1).getID()
        self.sqli2ID = self.__SQLICRUD.createPayload(self.sqli2).getID()
        self.response1 = self.__SQLICRUD.createResponse(ResponseEntity("SQL"))
        self.response2 = self.__SQLICRUD.createResponse(ResponseEntity("error"))

    def tearDown(self):
        self.__SQLICRUD.deletePayloads()
        self.__SQLICRUD.deleteResponses()
        self.__vulnDescriptor.deleteAllDataFromTable()

    def test_create_payload(self):
        self.assertEqual(self.sqli1.getPayload(), self.__SQLICRUD.getSQLIPayloads(1, 0)[0].getPayload())
        self.assertEqual(self.sqli2.getPayload(), self.__SQLICRUD.getSQLIPayloads(1, 1)[0].getPayload())

    def test_create_response(self):
        self.assertEqual(self.response1.getResponse(), self.__SQLICRUD.getResponses(1, 0)[0].getResponse())
        self.assertEqual(self.response2.getResponse(), self.__SQLICRUD.getResponses(1, 1)[0].getResponse())

    def test_wrong_create_payload(self):
        self.assertNotEqual('abdTest', self.__SQLICRUD.getSQLIPayloads(1, 0)[0].getPayload())
        with self.assertRaises(Exception):
            self.__SQLICRUD.createPayload(SQLIPayloadEntity(payload='a', type='b', vuln_descriptor='a'))

    def test_get_payloads_pagination(self):
        self.assertEqual(len(self.__SQLICRUD.getSQLIPayloads(2, 0)), 2)

    def test_get_by_id(self):
        self.assertEqual(self.sqli1.getPayload(), self.__SQLICRUD.getPayloadByID(self.sqli1ID).getPayload())
        self.assertEqual(self.sqli2.getPayload(), self.__SQLICRUD.getPayloadByID(self.sqli2ID).getPayload())

    def test_wrong_get_by_id(self):
        with self.assertRaises(Exception):
            self.__SQLICRUD.getPayloadByID(self.sqli2ID + self.sqli1ID)

    def test_get_payloads_by_type(self):
        self.assertEqual(1, len(self.__SQLICRUD.getPayloadsByType(type=self.sqli1.getType())))

    def test_get_payloads_types(self):
        for type in self.__SQLICRUD.getPayloadTypes():
            self.assertIn(type, [self.sqli1.getType(), self.sqli2.getType()])

    def test_get_responses(self):
        self.assertEqual(2, len(self.__SQLICRUD.getResponses()))

    def test_create_correct_number_of_payloads(self):
        self.assertEqual(2, len(self.__SQLICRUD.getSQLIPayloads()))

    def test_update_payload(self):
        self.__SQLICRUD.updatePayload(SQLIPayloadEntity(self.sqli2ID, 'testUpdate', 'aa', self.vuln2ID))
        self.assertEqual('testUpdate', self.__SQLICRUD.getPayloadByID(self.sqli2ID).getPayload())

    def test_update_payload_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__SQLICRUD.updatePayload(SQLIPayloadEntity(self.sqli2ID + self.sqli1ID, 'a', 'b', self.vuln2ID))

    def test_update_response(self):
        response3 = ResponseEntity("error3")
        self.__SQLICRUD.updateResponse(self.response1, response3)
        self.assertNotIn(self.response1, self.__SQLICRUD.getResponses())

    def test_delete_by_id(self):
        self.__SQLICRUD.deletePayloadByID(self.sqli1ID)
        self.assertEqual(1, len(self.__SQLICRUD.getSQLIPayloads()))

    def test_delete_response(self):
        self.__SQLICRUD.deleteResponse(self.response1)
        self.assertNotIn(self.response1, self.__SQLICRUD.getResponses())

    def test_delete_payloads(self):
        self.__SQLICRUD.deletePayloads()
        self.assertEqual(0, len(self.__SQLICRUD.getSQLIPayloads()))

    def test_delete_responses(self):
        self.__SQLICRUD.deleteResponses()
        self.assertEqual(0, len(self.__SQLICRUD.getResponses()))

    def test_foreign_key_deletion(self):
        self.__vulnDescriptor.deleteVulnByID(self.vuln1ID)
        with self.assertRaises(Exception):
            self.__SQLICRUD.getPayloadByID(self.sqli1ID)

    def doCleanups(self):
        pass

    def suite(self):
        pass


class TestRXSSCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__RXSSCRUD = RXSSCrud.getInstance('C:\DB\TestVulnServiceDB.db')
        cls.__RXSSCRUD.dropTable()
        cls.__RXSSCRUD.createTable()
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('C:\DB\TestVulnServiceDB.db')

    @classmethod
    def tearDownClass(cls):
        cls.__RXSSCRUD.closeConnection()
        cls.__RXSSCRUD = None
        cls.__vulnDescriptor = None  # vulnDescriptor will only be closed by the last class using it to avoid programming error

    def setUp(self):
        vuln1 = VulnerabilityDescriptionEntity(name='Testname1', severity=1, description='abc', recommendations='aaa')
        vuln2 = VulnerabilityDescriptionEntity(name='Testname2', severity=2, description='def', recommendations='bbb')
        self.vuln1ID = self.__vulnDescriptor.createVulnerabilityDescription(vuln1).getVulnID()
        self.vuln2ID = self.__vulnDescriptor.createVulnerabilityDescription(vuln2).getVulnID()
        self.rxss1 = RXSSPayloadEntity(payload='abcTest', vuln_descriptor=self.vuln1ID)
        self.rxss2 = RXSSPayloadEntity(payload='defTest', vuln_descriptor=self.vuln2ID)
        self.rxss1ID = self.__RXSSCRUD.createPayload(self.rxss1).getID()
        self.rxss2ID = self.__RXSSCRUD.createPayload(self.rxss2).getID()

    def tearDown(self):
        self.__RXSSCRUD.deleteAllDataFromTable()
        self.__vulnDescriptor.deleteAllDataFromTable()

    def test_create_payload(self):
        self.assertEqual('abcTest', self.__RXSSCRUD.getRXSSPayloads(1, 0)[0].getPayload())
        self.assertEqual('defTest', self.__RXSSCRUD.getRXSSPayloads(1, 1)[0].getPayload())

    def test_wrong_create_payload(self):
        self.assertNotEqual('abdTest', self.__RXSSCRUD.getRXSSPayloads(1, 0)[0].getPayload())
        with self.assertRaises(Exception):
            self.__RXSSCRUD.createPayload(RXSSPayloadEntity(payload='a', vuln_descriptor='a'))

    def test_get_payloads_pagination(self):
        self.assertEqual(len(self.__RXSSCRUD.getRXSSPayloads(2, 0)), 2)

    def test_read_by_id(self):
        self.assertEqual('abcTest', self.__RXSSCRUD.getPayloadByID(self.rxss1ID).getPayload())
        self.assertEqual('defTest', self.__RXSSCRUD.getPayloadByID(self.rxss2ID).getPayload())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__RXSSCRUD.getPayloadByID(self.rxss2ID + self.rxss1ID)

    def test_create_correct_number_of_payloads(self):
        self.assertEqual(2, len(self.__RXSSCRUD.getRXSSPayloads()))

    def test_update(self):
        self.__RXSSCRUD.updatePayload(RXSSPayloadEntity(self.rxss2ID, 'testUpdate', self.vuln2ID))
        self.assertEqual('testUpdate', self.__RXSSCRUD.getPayloadByID(self.rxss2ID).getPayload())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__RXSSCRUD.updatePayload(RXSSPayloadEntity(self.rxss2ID + self.rxss1ID, 'a', self.vuln2ID))

    def test_delete_by_id(self):
        self.__RXSSCRUD.deletePayloadByID(self.rxss1ID)
        self.assertEqual(1, len(self.__RXSSCRUD.getRXSSPayloads()))

    def test_delete_all_data_from_table(self):
        self.__RXSSCRUD.deleteAllDataFromTable()
        self.assertEqual(0, len(self.__RXSSCRUD.getRXSSPayloads()))

    def doCleanups(self):
        pass

    def suite(self):
        pass


class TestVulnerabilitiesCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__VulnCrud = VulnerabilitiesCRUD.getInstance('C:\DB\TestVulnServiceDB.db')
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('C:\DB\TestVulnServiceDB.db')
        cls.timestamp = datetime.now()
        cls.__VulnCrud.createTable(cls.timestamp)

    @classmethod
    def tearDownClass(cls):
        cls.__VulnCrud.dropTable(cls.timestamp)
        cls.__VulnCrud.closeConnection()
        cls.__VulnCrud = None
        cls.__vulnDescriptor = None  # vulnDescriptor will only be closed by the last class using it to avoid programming error

    def setUp(self):
        vuln_description1 = VulnerabilityDescriptionEntity(name='Testname1', severity=1, description='abc',
                                                           recommendations='aaa')
        vuln_description2 = VulnerabilityDescriptionEntity(name='Testname2', severity=2, description='def',
                                                           recommendations='bbb')
        self.vuln1DescID = self.__vulnDescriptor.createVulnerabilityDescription(vuln_description1).getVulnID()
        self.vuln2DescID = self.__vulnDescriptor.createVulnerabilityDescription(vuln_description2).getVulnID()
        self.vuln1 = SimpleVulnerabilityEntity(vuln_descriptor=self.vuln1DescID, url='http://www.something.com',
                                               payload='abcTest',
                                               requestB64='aa+=')
        self.vuln2 = SimpleVulnerabilityEntity(vuln_descriptor=self.vuln2DescID, url='http://www.anothersomething.com',
                                               payload='defTest',
                                               requestB64='bb==')
        self.vuln1ID = self.__VulnCrud.createVulnerability(self.vuln1, self.timestamp).getID()
        self.vuln2ID = self.__VulnCrud.createVulnerability(self.vuln2, self.timestamp).getID()

    def tearDown(self):
        self.__VulnCrud.deleteAllDataFromTable(self.timestamp)
        self.__vulnDescriptor.deleteAllDataFromTable()

    def test_create_vulnerability(self):
        self.assertEqual('abcTest', self.__VulnCrud.getVulns(self.timestamp, 1, 0)[0].getPayload())
        self.assertEqual('defTest', self.__VulnCrud.getVulns(self.timestamp, 1, 1)[0].getPayload())

    def test_wrong_create_vulnerability(self):
        self.assertNotEqual('abdTest', self.__VulnCrud.getVulns(self.timestamp, 1, 0)[0].getPayload())
        with self.assertRaises(Exception):
            self.__VulnCrud.createVulnerability(
                SimpleVulnerabilityEntity(vuln_descriptor='a', url='http://www.something.com', payload='abcTest',
                                          requestB64='aa+='))

    def test_get_vulnerabilities_pagination(self):
        self.assertEqual(len(self.__VulnCrud.getVulns(self.timestamp, 2, 0)), 2)

    def test_read_by_id(self):
        self.assertEqual('abcTest', self.__VulnCrud.getVulnByID(self.vuln1ID, self.timestamp).getPayload())
        self.assertEqual('defTest', self.__VulnCrud.getVulnByID(self.vuln2ID, self.timestamp).getPayload())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__VulnCrud.getVulnByID(self.vuln2ID + self.vuln1ID, self.timestamp)

    def test_create_correct_number_of_vulnerabilities(self):
        self.assertEqual(2, len(self.__VulnCrud.getVulns(self.timestamp)))

    def test_update(self):
        self.__VulnCrud.updateVuln(SimpleVulnerabilityEntity(id=self.vuln2ID, vuln_descriptor=self.vuln2DescID, \
                                                             url='http://www.something.com', payload='testUpdate',
                                                             requestB64='aa+='), self.timestamp)
        self.assertEqual('testUpdate', self.__VulnCrud.getVulnByID(self.vuln2ID, self.timestamp).getPayload())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__VulnCrud.updateVuln(
                SimpleVulnerabilityEntity(id=self.vuln2ID + self.vuln1ID, vuln_descriptor=self.vuln2DescID, \
                                          url='http://www.something.com', payload='testUpdate', requestB64='aa+='),
                self.timestamp)

    def test_delete_by_id(self):
        self.__VulnCrud.deleteVulnByID(self.vuln1ID, self.timestamp)
        self.assertEqual(1, len(self.__VulnCrud.getVulns(self.timestamp)))

    def test_delete_all_data_from_table(self):
        self.__VulnCrud.deleteAllDataFromTable(self.timestamp)
        self.assertEqual(0, len(self.__VulnCrud.getVulns(self.timestamp)))

    def doCleanups(self):
        pass

    def suite(self):
        pass


class TestVulnerabilitiesDescriptionCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('D:\DB\TestVulnServiceDB.db')
        cls.__vulnDescriptor.dropTable()
        cls.__vulnDescriptor.createTable()

    @classmethod
    def tearDownClass(cls):
        cls.__vulnDescriptor.closeConnection()
        cls.__vulnDescriptor = None

    def setUp(self):
        vuln_description1 = VulnerabilityDescriptionEntity(name='Testname1', severity=1, description='abcTest',
                                                           recommendations='aaa')
        vuln_description2 = VulnerabilityDescriptionEntity(name='Testname2', severity=2, description='defTest',
                                                           recommendations='bbb')
        self.vuln1DescID = self.__vulnDescriptor.createVulnerabilityDescription(vuln_description1).getVulnID()
        self.vuln2DescID = self.__vulnDescriptor.createVulnerabilityDescription(vuln_description2).getVulnID()

    def tearDown(self):
        self.__vulnDescriptor.deleteAllDataFromTable()

    def test_create_vulnerability(self):
        self.assertEqual('abcTest', self.__vulnDescriptor.getVulns(1, 0)[0].getDescription())
        self.assertEqual('defTest', self.__vulnDescriptor.getVulns(1, 1)[0].getDescription())

    def test_wrong_create_vulnerability(self):
        self.assertNotEqual('abdTest', self.__vulnDescriptor.getVulns(1, 0)[0].getDescription())

    def test_get_vulnerabilities_pagination(self):
        self.assertEqual(len(self.__vulnDescriptor.getVulns(2, 0)), 2)

    def test_read_by_id(self):
        self.assertEqual('abcTest', self.__vulnDescriptor.getVulnByID(self.vuln1DescID).getDescription())
        self.assertEqual('defTest', self.__vulnDescriptor.getVulnByID(self.vuln2DescID).getDescription())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__vulnDescriptor.getVulnByID(self.vuln2DescID + self.vuln1DescID)

    def test_create_correct_number_of_vulnerabilities(self):
        self.assertEqual(2, len(self.__vulnDescriptor.getVulns()))

    def test_update(self):
        self.__vulnDescriptor.updateVuln(
            VulnerabilityDescriptionEntity(vuln_id=self.vuln2DescID, name='Testname2', severity=2,
                                           description='testUpdate',
                                           recommendations='bbb'))
        self.assertEqual('testUpdate', self.__vulnDescriptor.getVulnByID(self.vuln2DescID).getDescription())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__vulnDescriptor.updateVuln(
                VulnerabilityDescriptionEntity(vuln_id=self.vuln2DescID + self.vuln1DescID, name='Testname2', \
                                               severity=2, description='testUpdate', recommendations='bbb'))

    def test_delete_by_id(self):
        self.__vulnDescriptor.deleteVulnByID(self.vuln1DescID)
        self.assertEqual(1, len(self.__vulnDescriptor.getVulns()))

    def test_delete_all_data_from_table(self):
        self.__vulnDescriptor.deleteAllDataFromTable()
        self.assertEqual(0, len(self.__vulnDescriptor.getVulns()))

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
