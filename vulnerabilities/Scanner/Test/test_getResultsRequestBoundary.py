from unittest import TestCase, TestSuite, TestLoader, TextTestRunner

from GetResultsObject import GetResultsEntity
from GetResultsRequestBoundary import GetResultsRequestBoundary


class TestGetResultsConfigBoundary(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scanName = "scan"
        cls.ResultEntity = GetResultsEntity(scanName = cls.scanName)
        cls.serializedScanConfig = '{"scanName":"scan"} '
        cls.pageBoudanry = GetResultsRequestBoundary(cls.ResultEntity)

    @classmethod
    def tearDownClass(cls):
        super(TestGetResultsConfigBoundary, cls).tearDownClass()

    def test_deserialize(self):
        serializedConfigDatabaseBoundary = GetResultsRequestBoundary.deserialize(self.serializedScanConfig)
        self.assertEqual(self.scanName, serializedConfigDatabaseBoundary.getResultsEntity().getScanName(),
                         "Failed Deserialize scan name")


if __name__ == '__main__':
    suite = TestSuite()
    suite.addTest(TestLoader().loadTestsFromTestCase(TestGetResultsConfigBoundary))
    TextTestRunner.run(suite)
