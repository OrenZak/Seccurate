import sqlite3
from PayloadObjects import RXSSPayloadEntity
from datetime import datetime
import ConfigParser


config = ConfigParser.RawConfigParser()
config.read(
    '..\common\config.properties')

def createTable():
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute('CREATE TABLE IF NOT EXISTS RXSS_Payloads(id TEXT PRIMARY KEY,\
         payload TEXT unique not null)')
        db.commit()

def createPayload(payload):
    """
    :param payload: payload without id to be inserted to DB
    :return: payload with id after being inserted to DB
    """
    id = str(datetime.now()).replace('-', '').replace(' ', '').replace(':', '').replace('.', '')
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""insert into RXSS_Payloads values(?,?)""", (id, payload.getPayload()))
        db.commit()
    payload.setID(id)
    return payload

def getRXSSPayloads(size=10, page=0):
    """
    :param size: page size, default 10
    :param page: page number, default 0
    :return:  a list of RXSSPayloadEntities items from RXSS_Payloads DB from page #page of size size
    """
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute(
            """SELECT * from RXSS_Payloads ORDER BY id ASC LIMIT %d OFFSET %d""" % (size, page * size))
        payload_list = []
        for payload in cursor.fetchall():
            rxss_payload = RXSSPayloadEntity(payload[0], payload[1])
            payload_list.append(rxss_payload)
    return payload_list

def getPayloadByID(id):
    """
    :param id: payload id
    :return: if id exists - returns RXSSPayloadEntity that is described by that id in the DB
    """
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""SELECT * from RXSS_Payloads where id = '%s'""" % id)
        item = cursor.fetchone()
        if (item is None):
            raise Exception("No such payload with id %s" % id)
    return RXSSPayloadEntity(item[0], item[1])

def updatePayload(payload):
    """
    :param payload: new payload with existing id
    :return: the new payload successfully updated in RXSSPayloadEntity format
    """
    if (getPayloadByID(payload.getID()) is None):
        raise Exception("no such payload")
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""update RXSS_Payloads set payload='%s' where id='%s'""" % (
        payload.getPayload(), payload.getID()))
        db.commit()
    return payload

def deletePayloadByID(id):
    if getPayloadByID(id) is None:
        raise Exception("no such vulnerability")
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""delete from RXSS_Payloads where id='%s'""" % id)
        db.commit()

def deleteAllDataFromTable():
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""delete from RXSS_Payloads""")
        db.commit()

def dropTable():
    with sqlite3.connect(config.get('VulnServiceDB', "test")) as db:
        cursor = db.cursor()
        cursor.execute("""DROP TABLE RXSS_Payloads""")
        db.commit()

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