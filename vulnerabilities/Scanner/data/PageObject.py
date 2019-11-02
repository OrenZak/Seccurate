class PageEntity():
    def __init__(self, url=None, pageHash=None):
        self.__url = url
        self.__pageHash = pageHash
        return

    def getURL(self):
        return self.__url

    def setURL(self, url):
        self.__url = url

    def getPageHash(self):
        return self.__pageHash

    def setPageHash(self, hash):
        self.__pageHash = hash
