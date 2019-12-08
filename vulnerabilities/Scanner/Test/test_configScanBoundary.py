from unittest import TestCase, TestSuite, TestLoader, TextTestRunner
import json

from ConfigScanBoundary import ConfigScanBoundary


class TestConfigScanBoundary(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dbName = "db1"
        cls.scanType = "ALL"
        cls.loginUrl = "http://example/bWAPP/login.php"
        cls.serializedScanConfig = '{"dbName":"db1", "scanType":"ALL","loginUrl":"http://example/bWAPP/login.php","loginInfo":{"form": {"login": "bee", "password": "bug", "security": "0", "form": "submit"}, "formAction": "login.php"}} '
        cls.loginInfo = json.loads('{"form": {"login": "bee", "password": "bug", "security": "0", "form": "submit"}, "formAction": "login.php"}')

    @classmethod
    def tearDownClass(cls):
        super(TestConfigScanBoundary, cls).tearDownClass()

    def test_deserialize(self):
        serializedConfigConfigBoundary = ConfigScanBoundary.deserialize(self.serializedScanConfig)
        self.assertEqual(self.dbName, serializedConfigConfigBoundary.getDbName(),
                         "Failed Deserialize database name")
        self.assertEqual(self.scanType, serializedConfigConfigBoundary.getScanType(), "Failed Deserialize scan Type")
        self.assertEqual(self.loginUrl, serializedConfigConfigBoundary.getLoginUrl(), "Failed Deserialize login URL")
        self.assertEqual(self.loginInfo, serializedConfigConfigBoundary.getLoginInfo(),
                         "Failed Deserialize login info")


if __name__ == '__main__':
    suite = TestSuite()
    suite.addTest(TestLoader().loadTestsFromTestCase(TestConfigScanBoundary))
    TextTestRunner.run(suite)
