class GetResultsEntity():
    def __init__(self, scanName=None):
        self.__scanName = scanName
        return

    def getScanName(self):
        return self.__scanName

    def setScanName(self, scanName):
        self.__scanName = scanName
