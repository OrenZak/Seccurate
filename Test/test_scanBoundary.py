from unittest import TestCase, TestSuite, TestLoader, TextTestRunner

from ScanBoundary import ScanBoundary
from PageObject import PageEntity
from SessionObject import SessionEntity


class TestPageBoundry(TestCase):

    @classmethod
    def setUpClass(cls):
        URL1 = "http://testURL.com"
        URL2 = "http://testURL2.com"
        cls.pageEntity1 = PageEntity(URL1, 1111)
        cls.pageEntity2 = PageEntity(URL2, 2222)
        cls.pageEntities = [cls.pageEntity1, cls.pageEntity2]
        cls.sessionEntity = SessionEntity(type="cookie", value="sessionid=1234")
        cls.algoType = "ALL"
        cls.serializedScanConfig = '{"pages":[{"url":"http://testURL.com","pageHash":1111},{"url":"http://testURL2.com","pageHash":2222}],"sessionData":{' \
                                   '"type":"cookie","value":"sessionid=1234"},"algoType":"ALL"} '
        cls.pageBoudnry = ScanBoundary(cls.pageEntities, cls.sessionEntity, cls.algoType)

    @classmethod
    def tearDownClass(cls):
        super(TestPageBoundry, cls).tearDownClass()

    def test_deserialize(self):
        serializedScanConfigBoundary = ScanBoundary.deserialize(self.serializedScanConfig)
        self.assertEqual(len(serializedScanConfigBoundary.getPageEntityies()), len(self.pageEntities),
                         "Failed Deserialized Serealized pages")
        self.assertEqual(self.pageEntity1.getURL(), serializedScanConfigBoundary.getPageEntityies()[0].getURL(),
                         "Missing Entity 1 in pages list")
        self.assertEqual(self.pageEntity2.getURL(), serializedScanConfigBoundary.getPageEntityies()[1].getURL(),
                         "Missing Entity 2 in pages list")
        self.assertEqual(self.sessionEntity.getType(), serializedScanConfigBoundary.getSessionEntity().getType(),
                         "Failed Deserialize session Entity type")
        self.assertEqual(self.sessionEntity.getValue(), serializedScanConfigBoundary.getSessionEntity().getValue(),
                         "Failed Deserialize session Entity value")
        self.assertEqual(self.algoType, serializedScanConfigBoundary.getAlgorithmType(),
                         "Failed Deserialize algorithm type value")


if __name__ == '__main__':
    suite = TestSuite()
    suite.addTest(TestLoader().loadTestsFromTestCase(TestPageBoundry))
    TextTestRunner.run(suite)
