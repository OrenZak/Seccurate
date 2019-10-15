import sqlite3
from VulnerabilitiesObjects import SimpleVulnerabilityEntity

"""
For configuration file:
    1. SQLDB = Vulns_Objects
    2. Path to prod DB - C:\DB\VulnsObjects.db
"""
class VulnerabilitiesCRUD(): # this class job is to CRUD vulnerbilities objects from/to the db
    __instance = None

    def __init__(self, db):
        """private constructor"""
        if VulnerabilitiesCRUD.__instance != None:
            raise Exception("Unable to create new instance of a singleton class")
        else:
            VulnerabilitiesCRUD.__instance = self
        self.__db = sqlite3.connect(db)
        print ("connected to DB")
        self.__cursor = self.__db.cursor()
        self.createTable()

    def createTable(self):
        """Creates the Vulns_Objects table if it doesn't exist"""

        self.__cursor.execute('CREATE TABLE IF NOT EXISTS Vulns_Objects(id INTEGER PRIMARY KEY AUTOINCREMENT, vuln_descriptor INTEGER REFERENCES Vulnerability_Types(vuln_ID) ON UPDATE CASCADE,\
                        url TEXT not null, payload TEXT not null, requestB64 TEXT not null)')
        self.__db.commit()

    def createVulnerability(self, vuln):
        """
        :param payload: payload without id to be inserted to DB
        :return: payload with id after being inserted to DB
        """

        self.__cursor.execute("""insert into Vulns_Objects(vuln_descriptor,url,payload,requestB64) values(?,?,?,?)""", (vuln.getVulnDescriptor(), vuln.getURL(), vuln.getPayload(), vuln.getRequestB64()))
        self.__db.commit()
        self.__cursor.execute("""select id from Vulns_Objects order by id desc limit 1""")
        id = self.__cursor.fetchone()[0]
        vuln.setID(id)
        self.__db.commit()
        return vuln


    def getVulns(self, size=10, page=0):
        """
        :param size: page size, default 10
        :param page: page number, default 0
        :return:  a list of VulnerabilitiesObjects items from Vulns_Objects DB from page #page of size size
        """
        self.__cursor.execute("""SELECT * from Vulns_Objects ORDER BY id ASC LIMIT %d OFFSET %d""" % (size, page*size))
        vulns_list = []
        for vuln in self.__cursor.fetchall():
            vulnEntity = SimpleVulnerabilityEntity(vuln[0], vuln[1], vuln[2], vuln[3], vuln[4])
            vulns_list.append(vulnEntity)
        return vulns_list

    def getVulnByID(self, id):
        """
        :param id: VulnerabilitiesObject id
        :return: if id exists - returns VulnerabilitiesObject that is described by that id in the DB
        """
        self.__cursor.execute("""SELECT * from Vulns_Objects where id = %d""" % id)
        item =self.__cursor.fetchone()
        if (item is None):
            raise Exception("No such vulnerability with id %d" % id)
        return SimpleVulnerabilityEntity(item[0],item[1],item[2], item[3], item[4])

    def updateVuln(self,vuln):
        """
        :param payload: new payload with existing id
        :return: the new vuln successfully updated in VulnerabilitiesObjects format
        """

        if self.getVulnByID(vuln.getID()) is None:
            raise Exception("no such vulnerability")
        self.__cursor.execute("""update Vulns_Objects set vuln_descriptor=%d, url='%s', payload='%s', requestB64='%s' where id=%d""" % (vuln.getVulnDescriptor(), vuln.getURL(), vuln.getPayload(), vuln.getRequestB64(), vuln.getID()))
        self.__db.commit()
        return vuln

    def deleteVulnByID(self, id):
        if self.getVulnByID(id) is None:
            raise Exception("no such vulnerability")
        self.__cursor.execute("""delete from Vulns_Objects where id=%d""" % id)
        self.__db.commit()

    def deleteAllDataFromTable(self):
        self.__cursor.execute("""delete from Vulns_Objects""")
        self.__cursor.execute("""delete from sqlite_sequence""")
        self.__db.commit()

    def dropTable(self):
        self.__cursor.execute("""DROP TABLE Vulns_Objects""")
        self.__db.commit()

    def closeConnection(self):
        self.__db.close()
        print("disconnected from db")

    @staticmethod
    def getInstance(db):
        if (VulnerabilitiesCRUD.__instance == None):
            VulnerabilitiesCRUD(db)
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