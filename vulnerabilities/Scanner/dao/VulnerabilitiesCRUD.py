import sqlite3
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
from dateutil.parser import parse
from datetime import datetime
import ConfigParser


__tables = []
config = ConfigParser.RawConfigParser()
config.read('..\\common\\config.properties')

def createTable(table_name, env):
    """Creates the Vulns_Objects table if it doesn't exist"""
    # TODO: check if every DB interaction should be sorrounded with try and rollback in case of failure
    if table_name in __tables:  # VulnerabilitiesCRUD.__tables:
        raise Exception("Table %s already exists, cannot create new table with same name" % table_name)
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        print ("connected to DB")
        cursor = db.cursor()
        cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute("CREATE TABLE IF NOT EXISTS " + table_name + "(id TEXT PRIMARY KEY, \
            name TEXT REFERENCES Vulnerability_Types(name) ON DELETE CASCADE,\
                            url TEXT not null, payload TEXT not null, requestB64 TEXT not null)")
        db.commit()
        __tables.append(table_name)

def createVulnerability(vuln, table_name, env):
    """
    :param payload: payload without id to be inserted to DB
    :return: payload with id after being inserted to DB
    """
    id = str(datetime.now()).replace('-', '').replace(' ', '').replace(':', '').replace('.', '')
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""insert into """ + table_name + """ values(?,?,?,?,?)""", \
                          (id, vuln.getName(), vuln.getURL(), vuln.getPayload(), vuln.getRequestB64()))
        db.commit()
    vuln.setID(id)
    return vuln

def getVulns(env, table_name, size=10, page=0):
    """
    :param size: page size, default 10
    :param page: page number, default 0
    :return:  a list of VulnerabilitiesObjects items from Vulns_Objects DB from page #page of size size
    """

    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute(
            """SELECT * from %s ORDER BY id ASC LIMIT %d OFFSET %d""" % (table_name, size, page * size))
        vulns_list = []
        for vuln in cursor.fetchall():
            vulnEntity = SimpleVulnerabilityEntity(vuln[0], vuln[1], vuln[2], vuln[3], vuln[4])
            vulns_list.append(vulnEntity)
    return vulns_list

def getVulnByID(id, table_name, env):
    """
    :param id: VulnerabilitiesObject id
    :return: if id exists - returns VulnerabilitiesObject that is described by that id in the DB
    """
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""SELECT * from %s where id = '%s'""" % (table_name, id))
        item = cursor.fetchone()
        if (item is None):
            raise Exception("No such vulnerability with id %s" % id)
    return SimpleVulnerabilityEntity(item[0], item[1], item[2], item[3], item[4])

def updateVuln(vuln, table_name, env):
    """
    :param payload: new payload with existing id
    :return: the new vuln successfully updated in VulnerabilitiesObjects format
    """
    if getVulnByID(vuln.getID(), table_name, env) is None:
        raise Exception("no such vulnerability")
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute(
            """update %s set name='%s', url='%s', payload='%s', requestB64='%s' where id='%s'""" % \
            (
            table_name, vuln.getName(), vuln.getURL(), vuln.getPayload(), vuln.getRequestB64(), vuln.getID()))
        db.commit()
    return vuln

def deleteVulnByID(id, table_name, env):
    if getVulnByID(id, table_name, env) is None:
        raise Exception("no such vulnerability")
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""delete from %s where id='%s'""" % (table_name, id))
        db.commit()

def deleteAllDataFromTable(table_name, env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""delete from %s""" % table_name)
        db.commit()

def dropTable(table_name, env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""DROP TABLE %s""" % table_name)
        db.commit()