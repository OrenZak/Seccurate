from PageObject import PageEntity
import json


class PageBoundry:

    def __init__(self, pageEntity):
        self.__url = pageEntity.getURL()

    def getURL(self):
        return self.__url

    def setURL(self, url):
        self.__url = url

    def convertToPageEntity(self):
        return PageEntity(self.__url)

    @staticmethod
    def deserialize(serializedObject):
        deserialized = json.loads(serializedObject)
        pageEntity = PageEntity(deserialized["URL"])
        return PageBoundry(pageEntity)
