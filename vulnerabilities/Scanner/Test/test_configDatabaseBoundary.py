from unittest import TestCase, TestSuite, TestLoader, TextTestRunner

from ConfigDatabaseBoundary import ConfigDatabaseBoundary


class TestConfigDatabaseBoundary(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dbName = "db1"
        cls.scanType = "ALL"
        cls.serializedScanConfig = '{"dbName":"db1", "scanType":"ALL"} '
        cls.pageBoudanry = ConfigDatabaseBoundary(cls.dbName)

    @classmethod
    def tearDownClass(cls):
        super(TestConfigDatabaseBoundary, cls).tearDownClass()

    def test_deserialize(self):
        serializedConfigDatabaseBoundary = ConfigDatabaseBoundary.deserialize(self.serializedScanConfig)
        self.assertEqual(self.dbName, serializedConfigDatabaseBoundary.getDbName(),
                         "Failed Deserialize database name")
        self.assertEqual(self.scanType, serializedConfigDatabaseBoundary.getScanType(), "Failed Deserialize scan Type")


if __name__ == '__main__':
    suite = TestSuite()
    suite.addTest(TestLoader().loadTestsFromTestCase(TestConfigDatabaseBoundary))
    TextTestRunner.run(suite)
