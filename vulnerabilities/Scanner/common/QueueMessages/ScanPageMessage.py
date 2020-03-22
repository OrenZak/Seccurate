from AbstractMessage import AbstractMessage


class ScanPageMessage(AbstractMessage):
    def __init__(self, pageEntity=None):#, sessionEntity=None):
        self.__pageEntity = pageEntity
        #self.__sessionEntity = sessionEntity

    def getPageEntity(self):
        return self.__pageEntity

    def setPageEntity(self, pageEntity=None):
        self.__pageEntity = pageEntity

    # def getSessionEntity(self):
    #     return self.__sessionEntity
    #
    # def setSessionEntity(self, sessionEntity=None):
    #     self.__sessionEntity = sessionEntity
