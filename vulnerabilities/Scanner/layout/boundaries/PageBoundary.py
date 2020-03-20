from PageObject import PageEntity
import json

from SessionObject import SessionEntity


class ScanBoundary:

    def __init__(self, pageEntity=None):
        self.__pageEntity = pageEntity

    def getPageEntity(self):
        return self.__pageEntity

    def setPageEntity(self, pageEntity=None):
        self.__pageEntity = pageEntity

    def serialize(self):
        return None

    @staticmethod
    def deserialize(serializedConfigScan):
        deserialized = json.loads(serializedConfigScan)
        newPageEntity = PageEntity(url=deserialized["url"])#, deserialized["pageHash"])
        return ScanBoundary(newPageEntity)
