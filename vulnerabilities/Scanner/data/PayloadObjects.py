class SimplePayloadEntity():
    def __init__(self, id=None, payload=None, vuln_descriptor=None):
        self.__id = id
        self.__vuln_descriptor = vuln_descriptor
        self.__payload = payload
        return

    def getID(self):
        return self.__id

    def setID(self, id):
        self.__id = id

    def getVulnDescriptor(self):
        return self.__vuln_descriptor

    def setVulnDescriptor(self, vuln_descriptor):
        self.__vuln_descriptor = vuln_descriptor

    def getPayload(self):
        return self.__payload

    def setPayload(self, payload):
        self.__payload = payload


class RXSSPayloadEntity(SimplePayloadEntity):
    def __init__(self, id = None, payload = None, vuln_descriptor=None):
        SimplePayloadEntity.__init__(self, id, payload, vuln_descriptor)


class SQLIPayloadEntity(SimplePayloadEntity):
    def __init__(self, id=None, payload=None, type=None, vuln_descriptor=None):
        SimplePayloadEntity.__init__(self, id, payload, vuln_descriptor)
        self.__type = type

    def getType(self):
        return self.__type

    def setType(self, type):
        self.__type = type
