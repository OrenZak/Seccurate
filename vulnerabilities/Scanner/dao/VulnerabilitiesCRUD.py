import sqlite3
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
from dateutil.parser import parse
from datetime import datetime
import ConfigParser


class VulnerabilitiesCRUD():  # this class job is to CRUD vulnerbilities objects from/to the db
    __instance = None
    # TODO: Not sure if __instance should be a dice with db_types as keys and tables lists as values??
    __tables = []

    def __init__(self, db_type):
        """private constructor that will only be called if DB has nor been created yet"""
        if VulnerabilitiesCRUD.__instance != None:
            raise Exception("Unable to create new instance of a singleton class")
        else:
            VulnerabilitiesCRUD.__instance = self
        self.config = ConfigParser.RawConfigParser()
        #self.config.read('..\\common\\config.properties')
        self.config.read(
            'C:\\Users\\Guy Shakked\\PycharmProjects\\Seccurate\\vulnerabilities\\Scanner\\common\\config.properties')
        self.__db = sqlite3.connect(self.config.get('VulnServiceDB', db_type))
        #self.__db = sqlite3.connect(db)
        print ("connected to DB")
        self.__cursor = self.__db.cursor()

    def createTable(self, table_name):
        """Creates the Vulns_Objects table if it doesn't exist"""
        # TODO: check if every DB interaction should be sorrounded with try and rollback in case of failure
        if table_name in VulnerabilitiesCRUD.__tables:
            raise Exception("Table %s already exists, cannot create new table with same name" % table_name)
        self.__cursor.execute("PRAGMA foreign_keys=on")
        self.__cursor.execute("CREATE TABLE IF NOT EXISTS " + table_name + "(id TEXT PRIMARY KEY, \
        name TEXT REFERENCES Vulnerability_Types(name) ON DELETE CASCADE,\
                        url TEXT not null, payload TEXT not null, requestB64 TEXT not null)")
        self.__db.commit()
        self.__tables.append(table_name)

    def createVulnerability(self, vuln, table_name):
        """
        :param payload: payload without id to be inserted to DB
        :return: payload with id after being inserted to DB
        """
        id = str(datetime.now()).replace('-', '').replace(' ', '').replace(':', '').replace('.', '')
        self.__cursor.execute("""insert into """ + table_name + """ values(?,?,?,?,?)""", \
                              (id, vuln.getName(), vuln.getURL(), vuln.getPayload(), vuln.getRequestB64()))
        self.__db.commit()
        vuln.setID(id)
        return vuln

    def getVulns(self, table_name, size=10, page=0):
        """
        :param size: page size, default 10
        :param page: page number, default 0
        :return:  a list of VulnerabilitiesObjects items from Vulns_Objects DB from page #page of size size
        """
        self.__cursor.execute(
            """SELECT * from %s ORDER BY id ASC LIMIT %d OFFSET %d""" % (table_name, size, page * size))
        vulns_list = []
        for vuln in self.__cursor.fetchall():
            vulnEntity = SimpleVulnerabilityEntity(vuln[0], vuln[1], vuln[2], vuln[3], vuln[4])
            vulns_list.append(vulnEntity)
        return vulns_list

    def getVulnByID(self, id, table_name):
        """
        :param id: VulnerabilitiesObject id
        :return: if id exists - returns VulnerabilitiesObject that is described by that id in the DB
        """
        self.__cursor.execute("""SELECT * from %s where id = '%s'""" % (table_name, id))
        item = self.__cursor.fetchone()
        if (item is None):
            raise Exception("No such vulnerability with id %s" % id)
        return SimpleVulnerabilityEntity(item[0], item[1], item[2], item[3], item[4])

    def updateVuln(self, vuln, table_name):
        """
        :param payload: new payload with existing id
        :return: the new vuln successfully updated in VulnerabilitiesObjects format
        """
        if self.getVulnByID(vuln.getID(), table_name) is None:
            raise Exception("no such vulnerability")
        self.__cursor.execute(
            """update %s set name='%s', url='%s', payload='%s', requestB64='%s' where id='%s'""" % \
            (
            table_name, vuln.getName(), vuln.getURL(), vuln.getPayload(), vuln.getRequestB64(), vuln.getID()))
        self.__db.commit()
        return vuln

    def deleteVulnByID(self, id, table_name):
        if self.getVulnByID(id, table_name) is None:
            raise Exception("no such vulnerability")
        self.__cursor.execute("""delete from %s where id='%s'""" % (table_name, id))
        self.__db.commit()

    def deleteAllDataFromTable(self, table_name):
        self.__cursor.execute("""delete from %s""" % table_name)
        self.__db.commit()

    def dropTable(self, table_name):
        self.__cursor.execute("""DROP TABLE %s""" % table_name)
        self.__db.commit()

    def closeConnection(self):
        self.__db.close()
        print("disconnected from db")

    """def validateTimestamp(self, timestamp):
        try:
            parse(str(timestamp))
        except:
            raise Exception("Incorrect timestamp supplied")

    def getTableName(self, timestamp):
        table_name = "Vulns_Objects_" + self.getNormalizedTimestamp(timestamp)
        if table_name not in VulnerabilitiesCRUD.__tables:
            raise Exception("No such table with timestamp " + str(timestamp))
        return table_name

    def getNormalizedTimestamp(self, timestamp):
        return str(timestamp).replace(' ', '').replace('-', '').replace(':', '').replace('.', '')"""

    @staticmethod
    def getInstance(db_type):
        if (VulnerabilitiesCRUD.__instance == None):
            VulnerabilitiesCRUD(db_type)
        return VulnerabilitiesCRUD.__instance


"""s = VulnerabilitiesCRUD.getInstance()
ent1 = SimpleVulnerabilityEntity(url='basicUrl', payload='aa', requestB64='abcdef==')

ent2 = SimpleVulnerabilityEntity(url='basicUrl2', payload='bb', requestB64='ghijkl==')

s.createVulnerability(ent1)
s.createVulnerability(ent2)

l= s.getVulns(1,1)
if (l != []):
    print(l[0].getRequestB64())
s.deleteAllDataFromTable()
l= s.getVulns(1,0)
if (l != []):
    print(l[0].getRequestB64())
print(s.getVulnByID(2).getRequestB64())
s.closeConnection()"""
