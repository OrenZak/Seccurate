class SimplePayloadEntity():
    def __init__(self, id=None, payload=None):
        self.__id = id
        self.__payload = payload
        return

    def getID(self):
        return self.__id

    def setID(self, id):
        self.__id = id

    def getPayload(self):
        return self.__payload

    def setPayload(self, payload):
        self.__payload = payload


class RXSSPayloadEntity(SimplePayloadEntity):
    def __init__(self, id = None, payload = None, expectedResult=None):
        SimplePayloadEntity.__init__(self, id, payload)
        self.__expectedResult = expectedResult

    def getExpectedResult(self):
        return self.__expectedResult

    def setExpectedResult(self, expectedResult):
        self.__expectedResult = expectedResult


class SQLIPayloadEntity(SimplePayloadEntity):
    def __init__(self, id=None, payload=None, type=None): # type is foreign key which derives from name in Description
        SimplePayloadEntity.__init__(self, id, payload)
        self.__type = type

    def getType(self):
        return self.__type

    def setType(self, type):
        self.__type = type
