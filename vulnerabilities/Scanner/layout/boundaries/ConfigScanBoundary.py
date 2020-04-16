import json


class ConfigScanBoundary:

    def __init__(self, tableName=None, scanType=None, loginInfo=None):
        self.__tableName = tableName
        self.__scanType = scanType
        self.__loginInfo = loginInfo

    def getTableName(self):
        return self.__tableName

    def setTableName(self, tableName=None):
        self.__tableName = tableName

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
        deserializedTableName = serializedConfigScan["dbName"]
        deserializedScanType = serializedConfigScan["scanType"]
        deserializedLoginInfo = serializedConfigScan["loginInfo"]
        return ConfigScanBoundary(tableName=deserializedTableName, scanType=deserializedScanType,
                                  loginInfo=deserializedLoginInfo)
