class ResponseEntity():
    def __init__(self, response):
        self.__response = response

    def getResponse(self):
        return self.__response

    def setResponse(self, response):
        self.__response = response