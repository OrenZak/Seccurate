import json


class ConfigDatabaseBoundary:

    def __init__(self, dbName=None):
        self.__dbName = dbName

    def getDbName(self):
        return self.__dbName

    def setDbName(self, dbName=None):
        self.__dbName = dbName

    def serialize(self):
        return None

    @staticmethod
    def deserialize(serializedConfigScan):
        deserialized = json.loads(serializedConfigScan)
        deserializedDbName = deserialized["name"]
        return ConfigDatabaseBoundary(dbName=deserializedDbName)
