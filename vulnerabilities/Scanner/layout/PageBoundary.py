from PageObject import PageEntity
import json

from SessionObject import SessionEntity


class ScanBoundary:

    def __init__(self, pageEntity=None, sessionEntity=None):
        self.__pageEntity = pageEntity
        self.__sessionEntity = sessionEntity

    def getSessionEntity(self):
        return self.__sessionEntity

    def setSessionEntity(self, sessionEntity=None):
        self.__sessionEntity = sessionEntity

    def getPageEntity(self):
        return self.__pageEntity

    def setPageEntity(self, pageEntity=None):
        self.__pageEntity = pageEntity

    def serialize(self):
        return None

    @staticmethod
    def deserialize(serializedConfigScan):
        deserialized = json.loads(serializedConfigScan)
        sessionEntity = SessionEntity(deserialized["type"], str(deserialized["value"]))
        newPageEntity = PageEntity(deserialized["url"], deserialized["pageHash"])
        return ScanBoundary(newPageEntity, sessionEntity)
