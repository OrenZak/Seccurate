class DifferentHashesException(Exception):
    def __init__(self, url):
        super(DifferentHashesException, self).__init__("Encountered different hash in url: " + url)