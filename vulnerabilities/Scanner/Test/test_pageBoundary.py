from unittest import TestCase, TestSuite, TestLoader, TextTestRunner

from PageBoundary import ScanBoundary
from PageObject import PageEntity
from SessionObject import SessionEntity


class TestPageBoundry(TestCase):

    @classmethod
    def setUpClass(cls):
        URL1 = "http://testURL.com"
        URL2 = "http://testURL2.com"
        cls.pageEntity1 = PageEntity(URL1, 1111)
        cls.sessionEntity = SessionEntity(type="cookie", value="sessionid=1234")
        cls.algoType = "ALL"
        cls.dbName = "db1"
        cls.serializedScanConfig = '{"page":{"url":"http://testURL.com","pageHash":1111},"sessionData":{' \
                                   '"type":"cookie","value":"sessionid=1234"},"algoType":"ALL","dbName":"db1"} '
        cls.pageBoudnry = ScanBoundary(cls.pageEntity1, cls.sessionEntity, cls.algoType, cls.dbName)

    @classmethod
    def tearDownClass(cls):
        super(TestPageBoundry, cls).tearDownClass()

    def test_deserialize(self):
        serializedScanConfigBoundary = ScanBoundary.deserialize(self.serializedScanConfig)
        self.assertEqual(self.pageEntity1.getURL(), serializedScanConfigBoundary.getPageEntity().getURL(),
                         "Missing Entity 1 in pages list")
        self.assertEqual(self.sessionEntity.getType(), serializedScanConfigBoundary.getSessionEntity().getType(),
                         "Failed Deserialize session Entity type")
        self.assertEqual(self.sessionEntity.getValue(), serializedScanConfigBoundary.getSessionEntity().getValue(),
                         "Failed Deserialize session Entity value")
        self.assertEqual(self.algoType, serializedScanConfigBoundary.getAlgorithmType(),
                         "Failed Deserialize algorithm type value")
        self.assertEqual(self.dbName, serializedScanConfigBoundary.getDbName(),
                         "Failed Deserialize database Name value")


if __name__ == '__main__':
    suite = TestSuite()
    suite.addTest(TestLoader().loadTestsFromTestCase(TestPageBoundry))
    TextTestRunner.run(suite)
