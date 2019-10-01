class SimplePayloadEntity():
    def __init__(self, id=None, payload=None):
        self.__id = id
        self.__payload = payload
        return

    def getID(self):
        return self.__id

    def getPayload(self):
        return self.__payload

    def setPayload(self, payload):
        self.__payload - payload


class RXSSPayloadEntity(SimplePayloadEntity):
    def __init__(self):
        return


class SQLIPayloadEntity(SimplePayloadEntity):
    def __init__(self, id=None, payload=None, type=None):
        SimplePayloadEntity.__init__(id, payload)
        self.__type = type
        return

    def getType(self):
        return self.__type

    def setType(self, type):
        self.__type = type
