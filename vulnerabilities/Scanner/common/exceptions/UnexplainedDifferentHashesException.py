class UnexplainedDifferentHashesException(Exception):
    def __init__(self, message=None):
        super(UnexplainedDifferentHashesException, self).__init__(message)