class CredentialsEntity:
    def __init__(self, loginInfo):
        self.__loginInfo = loginInfo

    def getLoginInfo(self):
        return self.__loginInfo

    def setLoginInfo(self, loginInfo):
        self.__loginInfo = loginInfo
