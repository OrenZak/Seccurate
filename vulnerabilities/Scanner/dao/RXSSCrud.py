import sqlite3
from PayloadObjects import RXSSPayloadEntity
from datetime import datetime
import ConfigParser


class RXSSCrud(): # this class job is to CRUD RXSS payload objects from/to the db

    __instance = None

    def __init__(self, db_type):
        """private constructor"""
        if RXSSCrud.__instance != None:
            raise Exception("Unable to create new instance of a singleton class")
        else:
            RXSSCrud.__instance = self
        self.config = ConfigParser.RawConfigParser()
        #self.config.read('..\\common\\config.properties')
        self.config.read(
            'C:\\Users\\Guy Shakked\\PycharmProjects\\Seccurate\\vulnerabilities\\Scanner\\common\\config.properties')
        self.__db = sqlite3.connect(self.config.get('VulnServiceDB', db_type))
        #self.__db = sqlite3.connect(db)
        print ("connected to DB")
        self.__cursor = self.__db.cursor()
        self.createTable()

    def createTable(self):
        """Creates the RXSS_Payloads table if it doesn't exist"""
        #self.__cursor.execute("PRAGMA foreign_keys=on")
        self.__cursor.execute('CREATE TABLE IF NOT EXISTS RXSS_Payloads(id TEXT PRIMARY KEY,\
         payload TEXT unique not null)')
        self.__db.commit()

    def createPayload(self, payload):
        """
        :param payload: payload without id to be inserted to DB
        :return: payload with id after being inserted to DB
        """
        id = str(datetime.now()).replace('-', '').replace(' ', '').replace(':', '').replace('.', '')
        self.__cursor.execute("""insert into RXSS_Payloads values(?,?)""", (id, payload.getPayload()))
        self.__db.commit()
        payload.setID(id)
        return payload

    def getRXSSPayloads(self, size=10, page=0):
        """
        :param size: page size, default 10
        :param page: page number, default 0
        :return:  a list of RXSSPayloadEntities items from RXSS_Payloads DB from page #page of size size
        """
        self.__cursor.execute(
            """SELECT * from RXSS_Payloads ORDER BY id ASC LIMIT %d OFFSET %d""" % (size, page * size))
        payload_list = []
        for payload in self.__cursor.fetchall():
            rxss_payload = RXSSPayloadEntity(payload[0], payload[1])
            payload_list.append(rxss_payload)
        return payload_list

    def getPayloadByID(self, id):
        """
        :param id: payload id
        :return: if id exists - returns RXSSPayloadEntity that is described by that id in the DB
        """
        self.__cursor.execute("""SELECT * from RXSS_Payloads where id = '%s'""" % id)
        item = self.__cursor.fetchone()
        if (item is None):
            raise Exception("No such payload with id %s" % id)
        return RXSSPayloadEntity(item[0], item[1])

    def updatePayload(self, payload):
        """
        :param payload: new payload with existing id
        :return: the new payload successfully updated in RXSSPayloadEntity format
        """

        if (self.getPayloadByID(payload.getID()) is None):
            raise Exception("no such payload")
        self.__cursor.execute("""update RXSS_Payloads set payload='%s' where id='%s'""" % (
        payload.getPayload(), payload.getID()))
        self.__db.commit()
        return payload

    def deletePayloadByID(self, id):
        if self.getPayloadByID(id) is None:
            raise Exception("no such vulnerability")
        self.__cursor.execute("""delete from RXSS_Payloads where id='%s'""" % id)
        self.__db.commit()

    def deleteAllDataFromTable(self):
        self.__cursor.execute("""delete from RXSS_Payloads""")
        self.__db.commit()

    def dropTable(self):
        self.__cursor.execute("""DROP TABLE RXSS_Payloads""")
        self.__db.commit()

    def closeConnection(self):
        self.__db.close()
        print("disconnected from db")

    @staticmethod
    def getInstance(db_type):
        if (RXSSCrud.__instance == None):
            RXSSCrud(db_type)
        return RXSSCrud.__instance

"""s = RXSSCrud.getInstance()
ent1 = RXSSPayloadEntity(payload='abc', vuln_descriptor=1)
ent2 = RXSSPayloadEntity(payload='def', vuln_descriptor=2)
s.createPayload(ent1)
s.createPayload(ent2)
l= s.getRXSSPayloads(1,0)
if (l != []):
    print(l[0].getPayload())
l= s.getRXSSPayloads(1,1)
if (l != []):
    print(l[0].getPayload())
s.updatePayload(RXSSPayloadEntity(2,'ghi',2))
l= s.getRXSSPayloads(1,1)
if (l != []):
    print(l[0].getPayload())
l = s.getRXSSPayloads(1, 2)
if (l != []):
    print(l[0].getPayload())
else:
    print("empty")
print(s.getPayloadByID(2).getPayload())
s.deleteAllDataFromTable()
l= s.getRXSSPayloads(1,0)
if (l != []):
    print(l[0].getPayload())
else:
    print ("empty")
s.closeConnection()"""