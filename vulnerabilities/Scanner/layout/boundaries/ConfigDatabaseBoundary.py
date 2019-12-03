import json


class ConfigDatabaseBoundary:

    def __init__(self, dbName=None, scanType=None):
        self.__dbName = dbName
        self.__scanType = scanType

    def getDbName(self):
        return self.__dbName

    def setDbName(self, dbName=None):
        self.__dbName = dbName

    def getScanType(self):
        return self.__scanType

    def setScanType(self, scanType):
        self.__scanType = scanType

    def serialize(self):
        return None

    @staticmethod
    def deserialize(serializedConfigScan):
        deserialized = json.loads(serializedConfigScan)
        deserializedDbName = deserialized["dbName"]
        deserializedScanType = deserialized["scanType"]
        return ConfigDatabaseBoundary(dbName=deserializedDbName, scanType=deserializedScanType)
