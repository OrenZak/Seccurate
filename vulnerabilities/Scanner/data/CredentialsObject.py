class CredentialsEntity:
    def __init__(self, url, form, formAction):
        self.__url = url
        self.__form = form
        self.__formAction = formAction

    def getURL(self):
        return self.__url

    def setURL(self, url):
        self.__url = url

    def getForm(self):
        return self.__form

    def setForm(self, form):
        self.__form = form

    def getFormAction(self):
        return self.__formAction

    def setFormAction(self, formAction):
        self.__formAction = formAction