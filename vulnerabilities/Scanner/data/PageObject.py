class PageEntity():
    def __init__(self, url=None):
        self.__url = url
        return

    def getURL(self):
        return self.__url

    def setURL(self,url):
        self.__url = url

