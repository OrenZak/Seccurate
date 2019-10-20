class SimpleVulnerabilityEntity():
    def __init__(self, id=None, vuln_descriptor=None, url=None, payload=None, requestB64=None):
        self.__id = id
        self.__vuln_descriptor = vuln_descriptor
        self.__url = url
        self.__payload = payload
        self.__requestB64 = requestB64
        return

    def getID(self):
        return self.__id

    def setID(self, id):
        self.__id = id

    def getVulnDescriptor(self):
        return self.__vuln_descriptor

    def setVulnDescriptor(self, vuln_descriptor):
        self.__vuln_descriptor = vuln_descriptor

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


class RXSSVulnerabilityEntity(SimpleVulnerabilityEntity):  # RXSS vulenrability entity
    def __init__(self, id=None, vuln_descriptor=None, url=None, payload=None, requestB64=None):
        SimpleVulnerabilityEntity.__init__(self, id, vuln_descriptor, url, payload, requestB64)


class SQLIVulnerabilityEntity(SimpleVulnerabilityEntity):  # SQLIVulnerabilityEntity
    def __init__(self, id=None, vuln_descriptor=None, url=None, payload=None, requestB64=None):
        SimpleVulnerabilityEntity.__init__(self, id, vuln_descriptor, url, payload, requestB64)
