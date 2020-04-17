from PageObject import PageEntity
import json

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
        newPageEntity = PageEntity(url=deserialized["url"])
        return ScanBoundary(newPageEntity)
