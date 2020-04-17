from AbstractMessage import AbstractMessage


class ScanPageMessage(AbstractMessage):
    def __init__(self, pageEntity=None):
        self.__pageEntity = pageEntity

    def getPageEntity(self):
        return self.__pageEntity

    def setPageEntity(self, pageEntity=None):
        self.__pageEntity = pageEntity
