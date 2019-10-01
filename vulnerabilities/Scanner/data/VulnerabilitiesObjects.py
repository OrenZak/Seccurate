class SimpleVulnerabilityEntity():
    def __init__(self, type=None, name=None, url=None, payload=None, reuestB64=None):
        self.__type = type
        self.__name = name
        self.__url = url
        self.__payload = payload
        self.__requestB64 = reuestB64
        return

    def getType(self):
        return self.__type

    def setType(self, type):
        self.__type = type

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
        return self.__requestb64

    def setRequestB64(self, requestB64):
        self.__requestB64 = requestB64


class RXSSVulnerabilityEntity(SimpleVulnerabilityEntity):  # RXSS vulenrability entity
    def __init__(self):
        return


class SQLIVulnerabilityEntity(SimpleVulnerabilityEntity):  # SQLIVulnerabilityEntity
    def __init__(self):
        return
