import json


class ConfigScanBoundary:

    def __init__(self, dbName=None, scanType=None, loginUrl=None, loginInfo=None):
        self.__dbName = dbName
        self.__scanType = scanType
        self.__loginUrl = loginUrl
        self.__loginInfo = loginInfo

    def getDbName(self):
        return self.__dbName

    def setDbName(self, dbName=None):
        self.__dbName = dbName

    def getScanType(self):
        return self.__scanType

    def setScanType(self, scanType):
        self.__scanType = scanType

    def getLoginUrl(self):
        return self.__loginUrl

    def setLoginUrl(self, loginUrl=None):
        self.__loginUrl = loginUrl

    def getLoginInfo(self):
        return self.__loginInfo

    def setLoginInfo(self, loginInfo=None):
        self.__loginInfo = loginInfo

    def serialize(self):
        return None

    @staticmethod
    def deserialize(serializedConfigScan):
        deserializedDbName = serializedConfigScan["dbName"]
        deserializedScanType = serializedConfigScan["scanType"]
        deserializedLoginUrl = serializedConfigScan["loginUrl"]
        deserializedLoginInfo = serializedConfigScan["loginInfo"]
        return ConfigScanBoundary(dbName=deserializedDbName, scanType=deserializedScanType,
                                  loginUrl=deserializedLoginUrl, loginInfo=deserializedLoginInfo)
