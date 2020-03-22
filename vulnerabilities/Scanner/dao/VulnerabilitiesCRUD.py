import sqlite3
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
from datetime import datetime
import ConfigParser
import json


__tables = []
config = ConfigParser.RawConfigParser()
config.read('../common/config.properties')

def createTable(table_name, env):
    """Creates the Vulns_Objects table if it doesn't exist"""
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        print ("connected to DB")
        cursor = db.cursor()
        cursor.execute("PRAGMA foreign_keys=on")
        cursor.execute("CREATE TABLE IF NOT EXISTS " + table_name + "(id TEXT PRIMARY KEY, \
            name TEXT REFERENCES Vulnerability_Types(name) ON DELETE CASCADE,\
                    url TEXT not null, payload TEXT not null, requestB64 TEXT not null, affected_urls TEXT)")
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
        if vuln.getName() == config.get('SQLITypes', 'second_order'):
            cursor.execute("""insert into """ + table_name + """ values(?,?,?,?,?,?)""",
                           (id, vuln.getName(), vuln.getURL(), vuln.getPayload(),
                            vuln.getRequestB64(), json.dumps(vuln.getAffectedURLs())))
        else:
            cursor.execute("""insert into """ + table_name + """ values(?,?,?,?,?,NULL)""", \
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
            if vuln[1] == config.get('SQLITypes', 'second_order'):
                vulnEntity = SimpleVulnerabilityEntity(id=vuln[0], name=vuln[1], url=vuln[2], payload=vuln[3],
                                                       requestB64=vuln[4],affected_urls=json.loads(vuln[5]))
            else:
                vulnEntity = SimpleVulnerabilityEntity(id=vuln[0], name=vuln[1], url=vuln[2], payload=vuln[3],
                                                       requestB64=vuln[4])
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
    if item[1] == config.get('SQLITypes', 'second_order'):
        return SimpleVulnerabilityEntity(id=item[0], name=item[1], url=item[2], payload=item[3],
                                         requestB64=item[4], affected_urls=json.loads(item[5]))
    else:
        return SimpleVulnerabilityEntity(id=item[0], name=item[1], url=item[2], payload=item[3],
                                         requestB64=item[4])

def getNumberOfDetectedVulns(table_name, env):
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        cursor.execute("""SELECT COUNT(*) FROM %s""" % table_name)
    return cursor.fetchone()[0]

def updateVuln(vuln, table_name, env):
    """
    :param payload: new payload with existing id
    :return: the new vuln successfully updated in VulnerabilitiesObjects format
    """
    if getVulnByID(vuln.getID(), table_name, env) is None:
        raise Exception("no such vulnerability")
    with sqlite3.connect(config.get('VulnServiceDB', env)) as db:
        cursor = db.cursor()
        if vuln.getName() == config.get('SQLITypes', 'second_order'):
            cursor.execute("""update %s set name='%s', url='%s', payload='%s', requestB64='%s', affected_urls='%s' where id='%s'""" % (
                table_name, vuln.getName(), vuln.getURL(), vuln.getPayload(),
                vuln.getRequestB64(), json.dumps(vuln.getAffectedURLs()) ,vuln.getID()))
        else:
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

# if __name__ == "__main__":
#     table_name = 'abcdTest3'
#     vulnSecondOrder = SimpleVulnerabilityEntity(name='second-order', url='url', payload='payload',
#                                                 requestB64='b64', affected_urls=['url1', 'url2', 'url3'])
#     vulnRegular = SimpleVulnerabilityEntity(name='error-based', url='urlErrorBased', payload='ebpayload',
#                                             requestB64='b64eb')
#     createTable(table_name, 'test')
#     returnedSecondOrder = createVulnerability(vulnSecondOrder, table_name, 'test')
#     returnedRegular = createVulnerability(vulnRegular, table_name, 'test')
#     print('created vulns')
#     print('all vulns:')
#     urls = getVulns('test', table_name)[0].getAffectedURLs()
#     for x in urls:
#         print(x)
#     print("regular name - " + getVulns('test', table_name)[1].getName())
#     print("get specific vuln: ")
#     print("vuln second-order: " + getVulnByID(returnedSecondOrder.getID(), table_name, 'test').getName())
#     print("vuln regular: " + getVulnByID(returnedRegular.getID(), table_name, 'test').getName())
#     updatedSecondOrder = returnedSecondOrder
#     updatedSecondOrder.setPayload('changed Payload')
#     newUrls = updatedSecondOrder.getAffectedURLs()
#     newUrls[2] = 'newUrl'
#     updatedSecondOrder.setAffectedURLs(newUrls)
#     updateVuln(updatedSecondOrder, table_name, 'test')
#     returnedUpdatedSecondOrder = getVulnByID(updatedSecondOrder.getID(), table_name, 'test')
#     print('in update second order - urls are:')
#     updatedUrls = returnedUpdatedSecondOrder.getAffectedURLs()
#     for x in updatedUrls:
#         print (x)
#     newRegular = returnedRegular
#     newRegular.setPayload('new payload')
#     updateVuln(newRegular, table_name, 'test')
#     print('in update regular - payload is: ' + getVulnByID(newRegular.getID(), table_name, 'test').getPayload())
