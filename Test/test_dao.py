import unittest, os
from SQLICrud import SQLICrud
from RXSSCrud import RXSSCrud
from VulnerabilityDescriptionObject import VulnerabilityDescriptionObject
from VulnerabilityDescriptionCRUD import VulnerabilityDescriptionCRUD
from PayloadObjects import SQLIPayloadEntity, RXSSPayloadEntity

class TestSQLICRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__SQLICRUD = SQLICrud.getInstance('D:\DB\TestsqliPayloads.db')
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('D:\DB\TestVulnsDescription.db')

    @classmethod
    def tearDownClass(cls):
        cls.__SQLICRUD.closeConnection()
        cls.__SQLICRUD = None
        cls.__vulnDescriptor = None #vulnDescriptor will only be closed by the last class using it to avoid programming error

    def setUp(self):
        vuln1 = VulnerabilityDescriptionObject(name='Testname1', severity=1, description='abc', recommendations='aaa')
        vuln2 = VulnerabilityDescriptionObject(name='Testname2', severity=2, description='def', recommendations='bbb')
        self.__vulnDescriptor.createVulnerabilityDescription(vuln1)
        self.__vulnDescriptor.createVulnerabilityDescription(vuln2)
        sqli1 = SQLIPayloadEntity(payload='abcTest', type='type1', vuln_descriptor=1)
        sqli2 = SQLIPayloadEntity(payload='defTest', type='type2', vuln_descriptor=2)
        self.__SQLICRUD.createPayload(sqli1)
        self.__SQLICRUD.createPayload(sqli2)

    def tearDown(self):
        self.__SQLICRUD.deleteAllDataFromTable()
        self.__vulnDescriptor.deleteAllDataFromTable()

    def test_create_payload(self):
        self.assertEqual('abcTest', self.__SQLICRUD.getSQLIPayloads(1,0)[0].getPayload())
        self.assertEqual('defTest', self.__SQLICRUD.getSQLIPayloads(1,1)[0].getPayload())

    def test_wrong_create_payload(self):
        self.assertNotEqual('abdTest', self.__SQLICRUD.getSQLIPayloads(1,0)[0].getPayload())

    def test_get_payloads_pagination(self):
        self.assertEqual(len(self.__SQLICRUD.getSQLIPayloads()), 2)

    def test_read_by_id(self):
        self.assertEqual('abcTest', self.__SQLICRUD.getPayloadByID(1).getPayload())
        self.assertEqual('defTest', self.__SQLICRUD.getPayloadByID(2).getPayload())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__SQLICRUD.getPayloadByID(3)

    def test_create_correct_number_of_payloads(self):
        self.assertEqual(2, len(self.__SQLICRUD.getSQLIPayloads()))

    def test_update(self):
        self.__SQLICRUD.updatePayload(SQLIPayloadEntity(2,'testUpdate','aa',2))
        self.assertEqual('testUpdate', self.__SQLICRUD.getPayloadByID(2).getPayload())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__SQLICRUD.updatePayload(SQLIPayloadEntity(3,'a','b',2))
        self.assertEqual(str(cm.exception), 'No such payload with id 3')

    def test_delete_by_id(self):
        self.__SQLICRUD.deletePayloadByID(1)
        self.assertEqual(1, len(self.__SQLICRUD.getSQLIPayloads()))

    def test_delete_all_data_from_table(self):
        self.__SQLICRUD.deleteAllDataFromTable()
        self.assertEqual(0, len(self.__SQLICRUD.getSQLIPayloads()))

    def doCleanups(self):
        pass

    def suite(self):
        pass

class TestRXSSCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__RXSSCRUD = RXSSCrud.getInstance('D:\DB\TestRXSSPayloads.db')
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('D:\DB\TestVulnsDescription.db')

    @classmethod
    def tearDownClass(cls):
        cls.__RXSSCRUD.closeConnection()
        cls.__RXSSCRUD = None
        cls.__vulnDescriptor.closeConnection()
        cls.__vulnDescriptor = None

    def setUp(self):
        vuln1 = VulnerabilityDescriptionObject(name='Testname1', severity=1, description='abc', recommendations='aaa')
        vuln2 = VulnerabilityDescriptionObject(name='Testname2', severity=2, description='def', recommendations='bbb')
        self.__vulnDescriptor.createVulnerabilityDescription(vuln1)
        self.__vulnDescriptor.createVulnerabilityDescription(vuln2)
        rxss1 = RXSSPayloadEntity(payload='abcTest', vuln_descriptor=1)
        rxss2 = RXSSPayloadEntity(payload='defTest', vuln_descriptor=2)
        self.__RXSSCRUD.createPayload(rxss1)
        self.__RXSSCRUD.createPayload(rxss2)

    def tearDown(self):
        self.__RXSSCRUD.deleteAllDataFromTable()
        self.__vulnDescriptor.deleteAllDataFromTable()

    def test_create_payload(self):
        self.assertEqual('abcTest', self.__RXSSCRUD.getRXSSPayloads(1,0)[0].getPayload())
        self.assertEqual('defTest', self.__RXSSCRUD.getRXSSPayloads(1,1)[0].getPayload())

    def test_wrong_create_payload(self):
        self.assertNotEqual('abdTest', self.__RXSSCRUD.getRXSSPayloads(1,0)[0].getPayload())

    def test_get_payloads_pagination(self):
        self.assertEqual(len(self.__RXSSCRUD.getRXSSPayloads()), 2)

    def test_read_by_id(self):
        self.assertEqual('abcTest', self.__RXSSCRUD.getPayloadByID(1).getPayload())
        self.assertEqual('defTest', self.__RXSSCRUD.getPayloadByID(2).getPayload())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__RXSSCRUD.getPayloadByID(3)

    def test_create_correct_number_of_payloads(self):
        self.assertEqual(2, len(self.__RXSSCRUD.getRXSSPayloads()))

    def test_update(self):
        self.__RXSSCRUD.updatePayload(RXSSPayloadEntity(2,'testUpdate',2))
        self.assertEqual('testUpdate', self.__RXSSCRUD.getPayloadByID(2).getPayload())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__RXSSCRUD.updatePayload(RXSSPayloadEntity(3,'a',2))
        self.assertEqual(str(cm.exception), 'No such payload with id 3')

    def test_delete_by_id(self):
        self.__RXSSCRUD.deletePayloadByID(1)
        self.assertEqual(1, len(self.__RXSSCRUD.getRXSSPayloads()))

    def test_delete_all_data_from_table(self):
        self.__RXSSCRUD.deleteAllDataFromTable()
        self.assertEqual(0, len(self.__RXSSCRUD.getRXSSPayloads()))

    def doCleanups(self):
        pass

    def suite(self):
        pass


if __name__ == '__main__':
    #unittest.main()
    suite = unittest.TestSuite()
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestSQLICRUD))
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestRXSSCRUD))
    unittest.TextTestRunner.run(suite)
    """suite = unittest.TestSuite()
    suite.addTest(unittest.TestLoader().loadTestsFromTestCase(TestDao))
    unittest.TextTestRunner.run(suite)
    
    
    suite1 = module1.TheTestSuite() (each one implements suite())
    suite2 = module2.TheTestSuite()
    alltests = unittest.TestSuite([suite1, suite2])"""