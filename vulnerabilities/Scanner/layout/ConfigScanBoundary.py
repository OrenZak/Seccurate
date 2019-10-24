from PageObject import PageEntity
import json

from SessionObject import SessionEntity


class ConfigScanBoundary:

    def __init__(self, pageEntityies=None, sessionEntity=None):
        self.__pageEntityies = pageEntityies
        self.__sessionEntity = sessionEntity

    def getSessionEntity(self):
        return self.__sessionEntity

    def setSessionEntity(self, sessionEntity=None):
        self.__sessionEntity = sessionEntity

    def getPageEntityies(self):
        return self.__pageEntityies

    def setPageEntityies(self, pageEntityies=None):
        self.__pageEntityies = pageEntityies

    def serialize(self):
        return None

    @staticmethod
    def deserialize(serializedConfigScan):
        deserialized = json.loads(serializedConfigScan)
        deserializedPageEntityies = deserialized["pages"]
        deserializedSessionEntity = deserialized["sessionData"]
        sessionEntity = SessionEntity(deserializedSessionEntity["type"], str(deserializedSessionEntity["value"]))
        pageEntities = []
        for page in deserializedPageEntityies:
            newPage = PageEntity(page["url"], page["pageHash"])
            pageEntities.append(newPage)
        return ConfigScanBoundary(pageEntities, sessionEntity)
