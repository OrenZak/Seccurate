class SimpleVulnerabilityEntity():
    def __init__(self, id=None, name=None, url=None, payload=None, requestB64=None, affected_urls=None):
        self.__id = id
        self.__name = name
        self.__url = url
        self.__payload = payload
        self.__requestB64 = requestB64
        self.__affected_urls = affected_urls
        return

    def getID(self):
        return self.__id

    def setID(self, id):
        self.__id = id

    def getName(self):
        return self.__name

    def setName(self, name):
        self.__name = name

    def getURL(self):
        return self.__url

    def setURL(self, url):
        self.__url = url

    def getPayload(self):
        return self.__payload

    def setPayload(self, payload):
        self.__payload = payload

    def getRequestB64(self):
        return self.__requestB64

    def setRequestB64(self, requestB64):
        self.__requestB64 = requestB64

    def getAffectedURLs(self):
        return self.__affected_urls

    def setAffectedURLs(self, affected_urls):
        self.__affected_urls = affected_urls


class RXSSVulnerabilityEntity(SimpleVulnerabilityEntity):  # RXSS vulenrability entity
    def __init__(self, id=None, name=None, url=None, payload=None, requestB64=None):
        SimpleVulnerabilityEntity.__init__(self, id, name, url, payload, requestB64)


class SQLIVulnerabilityEntity(SimpleVulnerabilityEntity):  # SQLIVulnerabilityEntity
    def __init__(self, id=None, name=None, url=None, payload=None, requestB64=None):
        SimpleVulnerabilityEntity.__init__(self, id, name, url, payload, requestB64)
