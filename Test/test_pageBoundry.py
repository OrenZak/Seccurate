from unittest import TestCase, TestSuite, TestLoader, TextTestRunner

from PageBoundry import PageBoundry
from PageObject import PageEntity


class TestPageBoundry(TestCase):

    @classmethod
    def setUpClass(cls):
        URL = "http://testURL.com"
        cls.pageEntity = PageEntity(URL)
        cls.serializedPageEntity = '{"URL":"http://testURL.com"}'
        cls.pageBoudnry = PageBoundry(cls.pageEntity)

    @classmethod
    def tearDownClass(cls):
        super(TestPageBoundry, cls).tearDownClass()

    def test_convertToPageEntity(self):
        pageEntity = self.pageBoudnry.convertToPageEntity()
        self.assertEqual(pageEntity.getURL(), self.pageEntity.getURL(),
                         "Failed Convert PageBoundry to PageEntity -> bad URL")

    def test_deserialize(self):
        pageBoundry = PageBoundry.deserialize(self.serializedPageEntity)
        self.assertEqual(pageBoundry.getURL(), self.pageBoudnry.getURL(), "Failed Deserialized Serealized page")

if __name__ == '__main__':
    suite = TestSuite()
    suite.addTest(TestLoader().loadTestsFromTestCase(TestPageBoundry))
    TextTestRunner.run(suite)
