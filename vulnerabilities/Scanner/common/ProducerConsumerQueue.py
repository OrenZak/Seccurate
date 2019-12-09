import Queue

BUF_SIZE = 1000


class ProducerConsumerQueue:
    __instance = None

    @staticmethod
    def getInstance():
        """ Static access method. """
        if ProducerConsumerQueue.__instance == None:
            ProducerConsumerQueue()
        return ProducerConsumerQueue.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if ProducerConsumerQueue.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            ProducerConsumerQueue.__instance = self
            self._queue = Queue.Queue(BUF_SIZE)

    def getQueue(self):
        return self._queue
