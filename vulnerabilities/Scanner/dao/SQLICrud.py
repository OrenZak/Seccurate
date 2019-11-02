import sqlite3
from PayloadObjects import SQLIPayloadEntity
from datetime import  datetime
from ResponseObject import ResponseEntity
import ConfigParser


class SQLICrud(): # this class job is to CRUD SQLI payload objects from/to the db
    __instance = None

    def __init__(self, db_type):
        """private constructor"""
        if SQLICrud.__instance != None:
            raise Exception("Unable to create new instance of a singleton class")
        else:
            SQLICrud.__instance = self
        self.config = ConfigParser.RawConfigParser()
        #self.config.read("..\common\config.properties")
        self.config.read(
            'C:\\Users\\Guy Shakked\\PycharmProjects\\Seccurate\\vulnerabilities\\Scanner\\common\\config.properties')
        db = self.config.get('VulnServiceDB', db_type)
        print(db)
        self.__db = sqlite3.connect(db)
        #self.__db = sqlite3.connect(db)
        print ("connected to DB")
        self.__cursor = self.__db.cursor()
        self.createSQLITable()

    def createSQLITable(self):
        """Creates the SQLI_Payloads table if it doesn't exist"""

        self.__cursor.execute("PRAGMA foreign_keys=on")
        self.__cursor.execute('CREATE TABLE IF NOT EXISTS SQLI_Payloads(id TEXT PRIMARY KEY, payload TEXT unique not null,\
                               type TEXT REFERENCES Vulnerability_Types(name) ON DELETE CASCADE)')
        self.__cursor.execute('CREATE TABLE IF NOT EXISTS Error_Responses(response TEXT PRIMARY KEY)')
        self.__db.commit()

    def createPayload(self, payload):
        """
        :param payload: payload without id to be inserted to DB
        :return: payload with id after being inserted to DB
        """
        id = str(datetime.now()).replace('-','').replace(' ','').replace(':','').replace('.','')
        self.__cursor.execute("""insert into SQLI_Payloads values(?,?,?)""",
                              (id, payload.getPayload(), payload.getType()))
        self.__db.commit()
        payload.setID(id)
        return payload

    def createResponse(self, response):
        self.__cursor.execute("""insert into Error_Responses values(?)""", (response.getResponse(),))
        self.__db.commit()
        return response

    def getSQLIPayloads(self, size=10, page=0):
        """
        :param size: page size, default 10
        :param page: page number, default 0
        :return:  a list of SQLIPayloadEntities items from SQLI_Payloads DB from page #page of size size
        """
        self.__cursor.execute("""SELECT * from SQLI_Payloads ORDER BY id ASC LIMIT %d OFFSET %d""" % (size, page*size))
        payload_list = []
        for payload in self.__cursor.fetchall():
            sqli_payload = SQLIPayloadEntity(payload[0], payload[1], payload[2])
            payload_list.append(sqli_payload)
        return payload_list

    def getPayloadsByType(self, type, size=10, page=0):

        self.__cursor.execute("""SELECT * from SQLI_Payloads where type='%s' ORDER BY id ASC LIMIT %d OFFSET %d""" % (type,size,page*size))
        payload_list = []
        for payload in self.__cursor.fetchall():
            sqli_payload = SQLIPayloadEntity(payload[0], payload[1], payload[2])
            payload_list.append(sqli_payload)
        return payload_list

    def getPayloadTypes(self):
        self.__cursor.execute("SELECT DISTINCT type from SQLI_Payloads")
        types_list = []
        for type in self.__cursor.fetchall():
            types_list.append(type[0])
        return types_list

    def getResponses(self, size=10, page=0):
        self.__cursor.execute("""SELECT * from Error_Responses ORDER BY response ASC LIMIT %d OFFSET %d""" % (size, page*size))
        response_list = []
        for response in self.__cursor.fetchall():
            response_list.append(ResponseEntity(response[0]))
        return response_list

    def getPayloadByID(self, id):
        """
        :param id: payload id
        :return: if id exists - returns SQLIPayloadEntity that is described by that id in the DB
        """
        self.__cursor.execute("""SELECT * from SQLI_Payloads where id = '%s'""" % id)
        item =self.__cursor.fetchone()
        if (item is None):
            raise Exception("No such payload with id %s" % id)
        return SQLIPayloadEntity(item[0],item[1],item[2])

    def updatePayload(self,payload):
        """
        :param payload: new payload with existing id
        :return: the new payload successfully updated in SQLIPayloadEntity format
        """

        if (self.getPayloadByID(payload.getID()) is None):
            raise Exception("no such payload")
        self.__cursor.execute("""update SQLI_Payloads set payload='%s', type='%s' where id='%s'""" \
                              % (payload.getPayload(), payload.getType(), payload.getID()))
        self.__db.commit()
        return payload

    def updateResponse(self, old_response, new_response):
        self.__cursor.execute("""update Error_Responses SET response='%s' where response='%s'""" \
                              % (new_response.getResponse(),old_response.getResponse()))
        self.__db.commit()
        return new_response

    def deletePayloadByID(self, id):
        if self.getPayloadByID(id) is None:
            raise Exception("no such vulnerability")
        self.__cursor.execute("""delete from SQLI_Payloads where id='%s'""" % id)
        self.__db.commit()

    def deleteResponse(self, response):
        self.__cursor.execute("""delete from Error_Responses where response='%s'""" % response.getResponse())
        self.__db.commit()

    def deletePayloads(self):
        self.__cursor.execute("""delete from SQLI_Payloads""")
        self.__db.commit()

    def deleteResponses(self):
        self.__cursor.execute("""delete from Error_Responses""")
        self.__db.commit()

    def dropPayloadsTable(self):
        self.__cursor.execute("""DROP TABLE SQLI_Payloads""")
        self.__db.commit()

    def dropResponsesTable(self):
        self.__cursor.execute("""DROP TABLE Error_Responses""")
        self.__db.commit()

    def closeConnection(self):
        self.__db.close()
        print("disconnected from db")

    @staticmethod
    def getInstance(db_type):
        if (SQLICrud.__instance == None):
            SQLICrud(db_type)
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