import sqlite3
from PayloadObjects import SQLIPayloadEntity
from datetime import  datetime
from ResponseObject import ResponseEntity
import ConfigParser

config = ConfigParser.RawConfigParser()
config.read('..\\common\\config.properties')
# config.read(
#     'C:\\Users\\Guy Shakked\\PycharmProjects\\Seccurate\\vulnerabilities\\Scanner\\common\\config.properties')

def createSQLITable():
    """Creates the SQLI_Payloads table if it doesn't exist"""
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute('CREATE TABLE IF NOT EXISTS SQLI_Payloads(id TEXT PRIMARY KEY, payload TEXT unique not null,\
                               type TEXT REFERENCES Vulnerability_Types(name) ON DELETE CASCADE)')
        cursor.execute('CREATE TABLE IF NOT EXISTS Error_Responses(response TEXT PRIMARY KEY)')
        db.commit()

def createPayload(payload):
    """
    :param payload: payload without id to be inserted to DB
    :return: payload with id after being inserted to DB
    """
    id = str(datetime.now()).replace('-', '').replace(' ', '').replace(':', '').replace('.', '')
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""insert into SQLI_Payloads values(?,?,?)""",
                              (id, payload.getPayload(), payload.getType()))
        db.commit()
    payload.setID(id)
    return payload

def createResponse(response):
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""insert into Error_Responses values(?)""", (response.getResponse(),))
        db.commit()
    return response

def getSQLIPayloads(size=10, page=0):
    """
    :param size: page size, default 10
    :param page: page number, default 0
    :return:  a list of SQLIPayloadEntities items from SQLI_Payloads DB from page #page of size size
    """
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""SELECT * from SQLI_Payloads ORDER BY id ASC LIMIT %d OFFSET %d""" % (size, page*size))
        payload_list = []
        for payload in cursor.fetchall():
            sqli_payload = SQLIPayloadEntity(payload[0], payload[1], payload[2])
            payload_list.append(sqli_payload)
    return payload_list

def getPayloadsByType(type, size=10, page=0):
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""SELECT * from SQLI_Payloads where type='%s' ORDER BY id ASC LIMIT %d OFFSET %d""" % (type,size,page*size))
        payload_list = []
        for payload in cursor.fetchall():
            sqli_payload = SQLIPayloadEntity(payload[0], payload[1], payload[2])
            payload_list.append(sqli_payload)
    return payload_list

def getPayloadTypes():
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("SELECT DISTINCT type from SQLI_Payloads")
        types_list = []
        for type in cursor.fetchall():
            types_list.append(type[0])
    return types_list

def getResponses(size=10, page=0):
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""SELECT * from Error_Responses ORDER BY response ASC LIMIT %d OFFSET %d""" % (size, page*size))
        response_list = []
        for response in cursor.fetchall():
            response_list.append(ResponseEntity(response[0]))
    return response_list

def getPayloadByID(id):
    """
    :param id: payload id
    :return: if id exists - returns SQLIPayloadEntity that is described by that id in the DB
    """
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""SELECT * from SQLI_Payloads where id = '%s'""" % id)
        item =cursor.fetchone()
        if (item is None):
            raise Exception("No such payload with id %s" % id)
    return SQLIPayloadEntity(item[0],item[1],item[2])

def updatePayload(payload):
    """
    :param payload: new payload with existing id
    :return: the new payload successfully updated in SQLIPayloadEntity format
    """
    if (getPayloadByID(payload.getID()) is None):
        raise Exception("no such payload")
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""update SQLI_Payloads set payload='%s', type='%s' where id='%s'""" \
                              % (payload.getPayload(), payload.getType(), payload.getID()))
        db.commit()
    return payload

def updateResponse(old_response, new_response):
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""update Error_Responses SET response='%s' where response='%s'""" \
                              % (new_response.getResponse(),old_response.getResponse()))
        db.commit()
    return new_response

def deletePayloadByID(id):
    if getPayloadByID(id) is None:
        raise Exception("no such vulnerability")
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""delete from SQLI_Payloads where id='%s'""" % id)
        db.commit()

def deleteResponse(response):
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""delete from Error_Responses where response='%s'""" % response.getResponse())
        db.commit()

def deletePayloads():
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""delete from SQLI_Payloads""")
        db.commit()

def deleteResponses():
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""delete from Error_Responses""")
        db.commit()

def dropPayloadsTable():
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""DROP TABLE SQLI_Payloads""")
        db.commit()

def dropResponsesTable():
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""DROP TABLE Error_Responses""")
        db.commit()

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