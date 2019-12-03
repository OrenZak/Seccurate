import json

from GetResultsObject import GetResultsEntity


class GetResultsRequestBoundary:

    def __init__(self, getResultsEntity=None):
        self.__getResultsEntity = getResultsEntity

    def getResultsEntity(self):
        return self.__getResultsEntity

    def setResultsEntity(self, getResultsEntity=None):
        self.__getResultsEntity = getResultsEntity

    def serialize(self):
        return None

    @staticmethod
    def deserialize(serializedGetResult):
        deserialized = json.loads(serializedGetResult)
        deserializedScanName = deserialized["scanName"]
        return GetResultsRequestBoundary(GetResultsEntity(scanName=deserializedScanName))
