class SessionEntity:
    def __init__(self, type=None, value=None):
        self.__type = type
        self.__value = value
        return

    def getType(self):
        return self.__type

    def setType(self, type):
        self.__type = type

    def getValue(self):
        return self.__value

    def setValue(self, value):
        self.__value = value
