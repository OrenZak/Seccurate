import json


class ConfigScanBoundary:

    def __init__(self, dbName=None, scanType=None, loginInfo=None):
        self.__dbName = dbName
        self.__scanType = scanType
        self.__loginInfo = loginInfo

    def getDbName(self):
        return self.__dbName

    def setDbName(self, dbName=None):
        self.__dbName = dbName

    def getScanType(self):
        return self.__scanType

    def setScanType(self, scanType):
        self.__scanType = scanType

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
        deserializedLoginInfo = serializedConfigScan["loginInfo"]
        return ConfigScanBoundary(dbName=deserializedDbName, scanType=deserializedScanType,
                                  loginInfo=deserializedLoginInfo)
