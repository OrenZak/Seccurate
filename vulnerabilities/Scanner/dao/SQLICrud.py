import sqlite3
from PayloadObjects import SQLIPayloadEntity

"""
For configuration file:
    1. SQLDB = SQLI_Payloads
    2. path to production DB - 'C:\DB\sqliPayloads.db'
"""
class SQLICrud(): # this class job is to CRUD SQLI payload objects from/to the db
    __instance = None

    def __init__(self, db):
        """private constructor"""
        if SQLICrud.__instance != None:
            raise Exception("Unable to create new instance of a singleton class")
        else:
            SQLICrud.__instance = self
        self.__db = sqlite3.connect(db)
        print ("connected to DB")
        self.__cursor = self.__db.cursor()
        self.createSQLITable()

    def createSQLITable(self):
        """Creates the SQLI_Payloads table if it doesn't exist"""

        self.__cursor.execute('CREATE TABLE IF NOT EXISTS SQLI_Payloads(id INTEGER PRIMARY KEY AUTOINCREMENT, payload TEXT unique not null,\
                       type TEXT not null, vuln_descriptor INTEGER REFERENCES Vulnerability_Types(vuln_ID) ON UPDATE CASCADE)')
        self.__db.commit()

    def createPayload(self, payload):
        """
        :param payload: payload without id to be inserted to DB
        :return: payload with id after being inserted to DB
        """

        self.__cursor.execute("""insert into SQLI_Payloads(payload,type,vuln_descriptor) values(?,?,?)""", (payload.getPayload(), payload.getType(), payload.getVulnDescriptor()))
        self.__db.commit()
        self.__cursor.execute("""select id from SQLI_Payloads order by id desc limit 1""")
        id = self.__cursor.fetchone()[0]
        payload.setID(id)
        self.__db.commit()
        return payload


    def getSQLIPayloads(self, size=10, page=0):
        """
        :param size: page size, default 10
        :param page: page number, default 0
        :return:  a list of SQLIPayloadEntities items from SQLI_Payloads DB from page #page of size size
        """
        self.__cursor.execute("""SELECT * from SQLI_Payloads ORDER BY id ASC LIMIT %d OFFSET %d""" % (size, page*size))
        payload_list = []
        for payload in self.__cursor.fetchall():
            sqli_payload = SQLIPayloadEntity(payload[0], payload[1], payload[2], payload[3])
            payload_list.append(sqli_payload)
        return payload_list

    def getPayloadByID(self, id):
        """
        :param id: payload id
        :return: if id exists - returns SQLIPayloadEntity that is described by that id in the DB
        """
        self.__cursor.execute("""SELECT * from SQLI_Payloads where id = %d""" % id)
        item =self.__cursor.fetchone()
        if (item is None):
            raise Exception("No such payload with id %d" % id)
        return SQLIPayloadEntity(item[0],item[1],item[2],item[3])

    def updatePayload(self,payload):
        """
        :param payload: new payload with existing id
        :return: the new payload successfully updated in SQLIPayloadEntity format
        """

        if (self.getPayloadByID(payload.getID()) is None):
            raise Exception("no such payload")
        self.__cursor.execute("""update SQLI_Payloads set payload='%s', type='%s', vuln_descriptor=%d where id=%d""" % (payload.getPayload(), payload.getType(), payload.getVulnDescriptor(), payload.getID()))
        self.__db.commit()
        return payload

    def deletePayloadByID(self, id):
        if self.getPayloadByID(id) is None:
            raise Exception("no such vulnerability")
        self.__cursor.execute("""delete from SQLI_Payloads where id=%d""" % id)
        self.__db.commit()

    def deleteAllDataFromTable(self):
        self.__cursor.execute("""delete from SQLI_Payloads""")
        self.__cursor.execute("""delete from sqlite_sequence""")
        self.__db.commit()

    def dropTable(self):
        self.__cursor.execute("""DROP TABLE SQLI_Payloads""")
        self.__db.commit()

    def closeConnection(self):
        self.__db.close()
        print("disconnected from db")

    @staticmethod
    def getInstance(db):
        if (SQLICrud.__instance == None):
            SQLICrud(db)
        return SQLICrud.__instance


"""s = SQLICrud.getInstance('C:\DB\sqliPayloads.db')
ent1 = SQLIPayloadEntity(payload='abc', type='type1', vuln_descriptor=1)

ent2 = SQLIPayloadEntity(payload='def', type='type2', vuln_descriptor=2)
#s.createPayload(ent1)
#s.createPayload(ent2)
l= s.getSQLIPayloads(10,0)
print (len(l))
if (l != []):
    print(l[0].getID())
s.deleteAllDataFromTable()
l= s.getSQLIPayloads(1,0)
if (l != []):
    print(l[0].getType())
print(s.getSQLIPayloads(1,0)[0].getType())
s.updatePayload(ent2)
print(s.getSQLIPayloads(1,0)[0].getType())
print(s.getPayloadByID(2).getPayload())
s.closeConnection()"""