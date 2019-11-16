from PageObject import PageEntity
import json

from SessionObject import SessionEntity


class ScanBoundary:

    def __init__(self, pageEntity=None, sessionEntity=None, algorithmType=None, dbName=None):
        self.__pageEntity = pageEntity
        self.__sessionEntity = sessionEntity
        self.__algoType = algorithmType
        self.__dbName = dbName

    def getSessionEntity(self):
        return self.__sessionEntity

    def setSessionEntity(self, sessionEntity=None):
        self.__sessionEntity = sessionEntity

    def getDbName(self):
        return self.__dbName

    def setDbName(self, dbName=None):
        self.__dbName = dbName

    def getAlgorithmType(self):
        return self.__algoType

    def setAlgorithmType(self, algoType=None):
        self.__algoType = algoType

    def getPageEntity(self):
        return self.__pageEntity

    def setPageEntity(self, pageEntity=None):
        self.__pageEntity = pageEntity

    def serialize(self):
        return None

    @staticmethod
    def deserialize(serializedConfigScan):
        deserialized = json.loads(serializedConfigScan)
        deserializedAlgoType = deserialized["algoType"]
        deserializedDbName = deserialized["tableName"]
        sessionEntity = SessionEntity(deserialized["type"], str(deserialized["value"]))
        newPageEntity = PageEntity(deserialized["url"], deserialized["pageHash"])
        return ScanBoundary(newPageEntity, sessionEntity, deserializedAlgoType, deserializedDbName)
