from AbstractMessage import AbstractMessage


class ConfigDatabaseMessage(AbstractMessage):
    def __init__(self, dbName=None, scanType=None, credentialsEntity=None):
        self.__dbName = dbName
        self.__scanType = scanType
        self.__credentialsEntity = credentialsEntity

    def getDbName(self):
        return self.__dbName

    def setDbName(self, dbName=None):
        self.__dbName = dbName

    def getScanType(self):
        return self.__scanType

    def setScanType(self, scanType=None):
        self.__scanType = scanType

    def getCredentialsEntity(self):
        return self.__credentialsEntity

    def setCredentialsEntity(self, credentialsEntity=None):
        self.__credentialsEntity = credentialsEntity
