import sqlite3
from PayloadObjects import SQLIPayloadEntity
from datetime import  datetime
from ResponseObject import ResponseEntity
import ConfigParser

config = ConfigParser.RawConfigParser()
config.read('../common/config.properties')

def createSQLITable(env):
    """Creates the SQLI_Payloads table if it doesn't exist"""
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        #cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute('CREATE TABLE IF NOT EXISTS SQLI_Payloads(id TEXT PRIMARY KEY, payload TEXT unique not null,\
                               type TEXT not null)')# REFERENCES Vulnerability_Types(name) ON DELETE CASCADE)')
        cursor.execute('CREATE TABLE IF NOT EXISTS Error_Responses(response TEXT PRIMARY KEY)')
        db.commit()

def createPayload(payload, env):
    """
    :param payload: payload without id to be inserted to DB
    :return: payload with id after being inserted to DB
    """
    id = str(datetime.now()).replace('-', '').replace(' ', '').replace(':', '').replace('.', '')
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        #cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute("""insert into SQLI_Payloads values(?,?,?)""",
                              (id, payload.getPayload(), payload.getType()))
        db.commit()
    payload.setID(id)
    return payload

def createResponse(response, env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""insert into Error_Responses values(?)""", (response.getResponse(),))
        db.commit()
    return response

def getSQLIPayloads(env, size=10, page=0):
    """
    :param size: page size, default 10
    :param page: page number, default 0
    :return:  a list of SQLIPayloadEntities items from SQLI_Payloads DB from page #page of size size
    """
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute("""SELECT * from SQLI_Payloads ORDER BY id ASC LIMIT %d OFFSET %d""" % (size, page*size))
        payload_list = []
        for payload in cursor.fetchall():
            sqli_payload = SQLIPayloadEntity(payload[0], payload[1], payload[2])
            payload_list.append(sqli_payload)
    return payload_list

def getPayloadsByType(env, type, size=10, page=0):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute("""SELECT * from SQLI_Payloads where type='%s' ORDER BY id ASC LIMIT %d OFFSET %d""" % (type,size,page*size))
        payload_list = []
        for payload in cursor.fetchall():
            sqli_payload = SQLIPayloadEntity(payload[0], payload[1], payload[2])
            payload_list.append(sqli_payload)
    return payload_list

def getPayloadTypes(env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute("SELECT DISTINCT type from SQLI_Payloads")
        types_list = []
        for type in cursor.fetchall():
            types_list.append(type[0])
    return types_list

def getResponses(env, size=10, page=0):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""SELECT * from Error_Responses ORDER BY response ASC LIMIT %d OFFSET %d""" % (size, page*size))
        response_list = []
        for response in cursor.fetchall():
            response_list.append(ResponseEntity(response[0]))
    return response_list

def getPayloadByID(id, env):
    """
    :param id: payload id
    :return: if id exists - returns SQLIPayloadEntity that is described by that id in the DB
    """
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute("""SELECT * from SQLI_Payloads where id = '%s'""" % id)
        item =cursor.fetchone()
        if (item is None):
            raise Exception("No such payload with id %s" % id)
    return SQLIPayloadEntity(item[0],item[1],item[2])

def updatePayload(payload, env):
    """
    :param payload: new payload with existing id
    :return: the new payload successfully updated in SQLIPayloadEntity format
    """
    if (getPayloadByID(payload.getID(), env) is None):
        raise Exception("no such payload")
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute("""update SQLI_Payloads set payload='%s', type='%s' where id='%s'""" \
                              % (payload.getPayload(), payload.getType(), payload.getID()))
        db.commit()
    return payload

def updateResponse(old_response, new_response, env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""update Error_Responses SET response='%s' where response='%s'""" \
                              % (new_response.getResponse(),old_response.getResponse()))
        db.commit()
    return new_response

def deletePayloadByID(id, env):
    if getPayloadByID(id, env) is None:
        raise Exception("no such vulnerability")
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute("""delete from SQLI_Payloads where id='%s'""" % id)
        db.commit()

def deleteResponse(response, env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""delete from Error_Responses where response='%s'""" % response.getResponse())
        db.commit()

def deletePayloads(env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""delete from SQLI_Payloads""")
        db.commit()

def deleteResponses(env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""delete from Error_Responses""")
        db.commit()

def dropPayloadsTable(env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""DROP TABLE SQLI_Payloads""")
        db.commit()

def dropResponsesTable(env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""DROP TABLE Error_Responses""")
        db.commit()