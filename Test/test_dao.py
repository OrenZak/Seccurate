import unittest
from SQLICrud import SQLICrud
from RXSSCrud import RXSSCrud
from VulnerabilitiesCRUD import VulnerabilitiesCRUD
from VulnerabilityDescriptionObject import VulnerabilityDescriptionObject
from VulnerabilityDescriptionCRUD import VulnerabilityDescriptionCRUD
from PayloadObjects import SQLIPayloadEntity, RXSSPayloadEntity
from VulnerabilitiesObjects import SimpleVulnerabilityEntity


class TestSQLICRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__SQLICRUD = SQLICrud.getInstance('D:\DB\TestsqliPayloads.db')
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('D:\DB\TestVulnsDescription.db')

    @classmethod
    def tearDownClass(cls):
        cls.__SQLICRUD.closeConnection()
        cls.__SQLICRUD = None
        cls.__vulnDescriptor = None  # vulnDescriptor will only be closed by the last class using it to avoid programming error

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
        self.assertEqual('abcTest', self.__SQLICRUD.getSQLIPayloads(1, 0)[0].getPayload())
        self.assertEqual('defTest', self.__SQLICRUD.getSQLIPayloads(1, 1)[0].getPayload())

    def test_wrong_create_payload(self):
        self.assertNotEqual('abdTest', self.__SQLICRUD.getSQLIPayloads(1, 0)[0].getPayload())

    def test_get_payloads_pagination(self):
        self.assertEqual(len(self.__SQLICRUD.getSQLIPayloads(2, 0)), 2)

    def test_read_by_id(self):
        self.assertEqual('abcTest', self.__SQLICRUD.getPayloadByID(1).getPayload())
        self.assertEqual('defTest', self.__SQLICRUD.getPayloadByID(2).getPayload())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__SQLICRUD.getPayloadByID(3)

    def test_create_correct_number_of_payloads(self):
        self.assertEqual(2, len(self.__SQLICRUD.getSQLIPayloads()))

    def test_update(self):
        self.__SQLICRUD.updatePayload(SQLIPayloadEntity(2, 'testUpdate', 'aa', 2))
        self.assertEqual('testUpdate', self.__SQLICRUD.getPayloadByID(2).getPayload())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__SQLICRUD.updatePayload(SQLIPayloadEntity(3, 'a', 'b', 2))
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
        cls.__vulnDescriptor = None  # vulnDescriptor will only be closed by the last class using it to avoid programming error

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
        self.assertEqual('abcTest', self.__RXSSCRUD.getRXSSPayloads(1, 0)[0].getPayload())
        self.assertEqual('defTest', self.__RXSSCRUD.getRXSSPayloads(1, 1)[0].getPayload())

    def test_wrong_create_payload(self):
        self.assertNotEqual('abdTest', self.__RXSSCRUD.getRXSSPayloads(1, 0)[0].getPayload())

    def test_get_payloads_pagination(self):
        self.assertEqual(len(self.__RXSSCRUD.getRXSSPayloads(2, 0)), 2)

    def test_read_by_id(self):
        self.assertEqual('abcTest', self.__RXSSCRUD.getPayloadByID(1).getPayload())
        self.assertEqual('defTest', self.__RXSSCRUD.getPayloadByID(2).getPayload())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__RXSSCRUD.getPayloadByID(3)

    def test_create_correct_number_of_payloads(self):
        self.assertEqual(2, len(self.__RXSSCRUD.getRXSSPayloads()))

    def test_update(self):
        self.__RXSSCRUD.updatePayload(RXSSPayloadEntity(2, 'testUpdate', 2))
        self.assertEqual('testUpdate', self.__RXSSCRUD.getPayloadByID(2).getPayload())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__RXSSCRUD.updatePayload(RXSSPayloadEntity(3, 'a', 2))
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


class TestVulnerabilitiesCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__VulnCrud = VulnerabilitiesCRUD.getInstance('D:\DB\TestVulnsObjects.db')
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('D:\DB\TestVulnsDescription.db')

    @classmethod
    def tearDownClass(cls):
        cls.__VulnCrud.closeConnection()
        cls.__VulnCrud = None
        cls.__vulnDescriptor = None  # vulnDescriptor will only be closed by the last class using it to avoid programming error

    def setUp(self):
        vuln_description1 = VulnerabilityDescriptionObject(name='Testname1', severity=1, description='abc',
                                                           recommendations='aaa')
        vuln_description2 = VulnerabilityDescriptionObject(name='Testname2', severity=2, description='def',
                                                           recommendations='bbb')
        self.__vulnDescriptor.createVulnerabilityDescription(vuln_description1)
        self.__vulnDescriptor.createVulnerabilityDescription(vuln_description2)
        vuln1 = SimpleVulnerabilityEntity(vuln_descriptor=1, url='http://www.something.com', payload='abcTest',
                                          requestB64='aa+=')
        vuln2 = SimpleVulnerabilityEntity(vuln_descriptor=2, url='http://www.anothersomething.com', payload='defTest',
                                          requestB64='bb==')
        self.__VulnCrud.createVulnerability(vuln1)
        self.__VulnCrud.createVulnerability(vuln2)

    def tearDown(self):
        self.__VulnCrud.deleteAllDataFromTable()
        self.__vulnDescriptor.deleteAllDataFromTable()

    def test_create_vulnerability(self):
        self.assertEqual('abcTest', self.__VulnCrud.getVulns(1, 0)[0].getPayload())
        self.assertEqual('defTest', self.__VulnCrud.getVulns(1, 1)[0].getPayload())

    def test_wrong_create_vulnerability(self):
        self.assertNotEqual('abdTest', self.__VulnCrud.getVulns(1, 0)[0].getPayload())

    def test_get_vulnerabilities_pagination(self):
        self.assertEqual(len(self.__VulnCrud.getVulns(2, 0)), 2)

    def test_read_by_id(self):
        self.assertEqual('abcTest', self.__VulnCrud.getVulnByID(1).getPayload())
        self.assertEqual('defTest', self.__VulnCrud.getVulnByID(2).getPayload())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__VulnCrud.getVulnByID(3)

    def test_create_correct_number_of_vulnerabilities(self):
        self.assertEqual(2, len(self.__VulnCrud.getVulns()))

    def test_update(self):
        self.__VulnCrud.updateVuln(
            SimpleVulnerabilityEntity(id=2, vuln_descriptor=2, url='http://www.something.com', payload='testUpdate',
                                      requestB64='aa+='))
        self.assertEqual('testUpdate', self.__VulnCrud.getVulnByID(2).getPayload())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__VulnCrud.updateVuln(
                SimpleVulnerabilityEntity(id=3, vuln_descriptor=2, url='http://www.something.com', payload='testUpdate',
                                          requestB64='aa+='))
        self.assertEqual(str(cm.exception), 'No such vulnerability with id 3')

    def test_delete_by_id(self):
        self.__VulnCrud.deleteVulnByID(1)
        self.assertEqual(1, len(self.__VulnCrud.getVulns()))

    def test_delete_all_data_from_table(self):
        self.__VulnCrud.deleteAllDataFromTable()
        self.assertEqual(0, len(self.__VulnCrud.getVulns()))

    def doCleanups(self):
        pass

    def suite(self):
        pass


class TestVulnerabilitiesDescriptionCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.__vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('D:\DB\TestVulnsDescription.db')

    @classmethod
    def tearDownClass(cls):
        cls.__vulnDescriptor.closeConnection()
        cls.__vulnDescriptor = None

    def setUp(self):
        vuln_description1 = VulnerabilityDescriptionObject(name='Testname1', severity=1, description='abcTest',
                                                           recommendations='aaa')
        vuln_description2 = VulnerabilityDescriptionObject(name='Testname2', severity=2, description='defTest',
                                                           recommendations='bbb')
        self.__vulnDescriptor.createVulnerabilityDescription(vuln_description1)
        self.__vulnDescriptor.createVulnerabilityDescription(vuln_description2)

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
        self.assertEqual('abcTest', self.__vulnDescriptor.getVulnByID(1).getDescription())
        self.assertEqual('defTest', self.__vulnDescriptor.getVulnByID(2).getDescription())

    def test_wrong_read_by_id(self):
        with self.assertRaises(Exception):
            self.__vulnDescriptor.getVulnByID(3)

    def test_create_correct_number_of_vulnerabilities(self):
        self.assertEqual(2, len(self.__vulnDescriptor.getVulns()))

    def test_update(self):
        self.__vulnDescriptor.updateVuln(
            VulnerabilityDescriptionObject(vuln_id=2, name='Testname2', severity=2, description='testUpdate',
                                           recommendations='bbb'))
        self.assertEqual('testUpdate', self.__vulnDescriptor.getVulnByID(2).getDescription())

    def test_update_wrong_id(self):
        with self.assertRaises(Exception) as cm:
            self.__vulnDescriptor.updateVuln(
                VulnerabilityDescriptionObject(vuln_id=3, name='Testname2', severity=2, description='testUpdate',
                                               recommendations='bbb'))
        self.assertEqual(str(cm.exception), 'No such vulnerability with id 3')

    def test_delete_by_id(self):
        self.__vulnDescriptor.deleteVulnByID(1)
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
