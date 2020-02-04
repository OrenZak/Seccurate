import sqlite3
from PayloadObjects import RXSSPayloadEntity
from datetime import datetime
import ConfigParser


config = ConfigParser.RawConfigParser()
config.read('../common/config.properties')

def createTable(env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute('CREATE TABLE IF NOT EXISTS RXSS_Payloads(id TEXT PRIMARY KEY,\
         payload TEXT unique not null, expected_result TEXT not null)')
        db.commit()

def createPayload(payload, env):
    """
    :param payload: payload without id to be inserted to DB
    :return: payload with id after being inserted to DB
    """
    id = str(datetime.now()).replace('-', '').replace(' ', '').replace(':', '').replace('.', '')
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""insert into RXSS_Payloads values(?,?,?)""", (id, payload.getPayload(),
                                                                       payload.getExpectedResult()))
        db.commit()
    payload.setID(id)
    return payload

def getRXSSPayloads(env, size=10, page=0):
    """
    :param size: page size, default 10
    :param page: page number, default 0
    :return:  a list of RXSSPayloadEntities items from RXSS_Payloads DB from page #page of size size
    """
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute(
            """SELECT * from RXSS_Payloads ORDER BY id ASC LIMIT %d OFFSET %d""" % (size, page * size))
        payload_list = []
        for payload in cursor.fetchall():
            rxss_payload = RXSSPayloadEntity(payload[0], payload[1], payload[2])
            payload_list.append(rxss_payload)
    return payload_list

def getPayloadByID(id, env):
    """
    :param id: payload id
    :return: if id exists - returns RXSSPayloadEntity that is described by that id in the DB
    """
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""SELECT * from RXSS_Payloads where id = '%s'""" % id)
        item = cursor.fetchone()
        if (item is None):
            raise Exception("No such payload with id %s" % id)
    return RXSSPayloadEntity(item[0], item[1], item[2])

def updatePayload(payload, env):
    """
    :param payload: new payload with existing id
    :return: the new payload successfully updated in RXSSPayloadEntity format
    """
    if (getPayloadByID(payload.getID(), env) is None):
        raise Exception("no such payload")
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""update RXSS_Payloads set payload='%s', expected_result='%s' where id='%s'""" % (
        payload.getPayload(), payload.getExpectedResult(), payload.getID()))
        db.commit()
    return payload

def deletePayloadByID(id, env):
    if getPayloadByID(id, env) is None:
        raise Exception("no such vulnerability")
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""delete from RXSS_Payloads where id='%s'""" % id)
        db.commit()

def deleteAllDataFromTable(env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""delete from RXSS_Payloads""")
        db.commit()

def dropTable(env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""DROP TABLE RXSS_Payloads""")
        db.commit()