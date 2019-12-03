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
        cls.serializedScanConfig = '{"url":"http://testURL.com","pageHash":1111, "type":"cookie", "value":"sessionid=1234"}'
        cls.pageBoudnry = ScanBoundary(cls.pageEntity1, cls.sessionEntity)

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


if __name__ == '__main__':
    suite = TestSuite()
    suite.addTest(TestLoader().loadTestsFromTestCase(TestPageBoundry))
    TextTestRunner.run(suite)
