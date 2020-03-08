class CredentialsEntity:
    def __init__(self, loginInfo):
        #self.__loginUrl = loginUrl
        self.__loginInfo = loginInfo

    # def getLoginURL(self):
    #     return self.__loginUrl
    #
    # def setLoginURL(self, url):
    #     self.__loginUrl = url

    def getLoginInfo(self):
        return self.__loginInfo

    def setLoginInfo(self, loginInfo):
        self.__loginInfo = loginInfo
