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

    # def getValuesList(self):
    #     values = []
    #     for value in self.__value.split(';'):
    #         values.append(value)
    #     return values

    def __eq__(self, other):
        if isinstance(other, SessionEntity):
            if (self.__type == other.getType()):
                myValues = self.getValuesList()
                otherValues = other.getValuesList()
                return all(value in otherValues for value in myValues)
        return False

    def __ne__(self, other):
        return not self.__eq__(other)
