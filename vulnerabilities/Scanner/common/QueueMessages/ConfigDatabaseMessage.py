from AbstractMessage import AbstractMessage


class ConfigDatabaseMessage(AbstractMessage):
    def __init__(self, tableName=None, scanType=None, credentialsEntity=None):
        self.__tableName = tableName
        self.__scanType = scanType
        self.__credentialsEntity = credentialsEntity

    def getTableName(self):
        return self.__tableName

    def setTableName(self, tableName=None):
        self.__tableName = tableName

    def getScanType(self):
        return self.__scanType

    def setScanType(self, scanType=None):
        self.__scanType = scanType

    def getCredentialsEntity(self):
        return self.__credentialsEntity

    def setCredentialsEntity(self, credentialsEntity=None):
        self.__credentialsEntity = credentialsEntity
