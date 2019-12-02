import sys
import optparse

from LogicService import LogicService
from RXSSAlgorithm import *
from PageObject import PageEntity
from SessionObject import SessionEntity
from VulnerabilityDescriptionCRUD import VulnerabilityDescriptionCRUD
from VulnerabilityDescriptionObject import VulnerabilityDescriptionEntity

reload(sys)
sys.setdefaultencoding('utf8')

f = open("Results.html", "w")
f.write("")
f.close()
br = mechanize.Browser()
br.addheaders = [('User-agent',
                        'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
cj = mechanize.CookieJar()
br.set_cookiejar(cj)
br.open("http://localhost/bwapp/index.php")
br.select_form(nr=0)
br.form['login'] = 'bee'
br.form['password'] = 'bug'
br.submit()
cookie_value_string = ""
for cookie in cj:
    cookie_value_string += cookie.name + "=" + cookie.value + "=" + cookie.domain + "=" + cookie.path + ";"
session_entity = SessionEntity('Cookie', cookie_value_string[:-1])
pageEntity1 = PageEntity(url="http://localhost/bwapp/htmli_post.php", pageHash=123)
sessionEntity = SessionEntity(type="cookie", value="sessionID=blablalba")

# vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('test')
# vulnDescriptor.dropTable()
# vulnDescriptor.createTable()

# vulnDescriptor = VulnerabilityDescriptionCRUD.getInstance('test')
# rxssDescription = VulnerabilityDescriptionEntity(name="rxss", severity=2, description='defTest', recommendations='bbb')
# vulnDescriptor.createVulnerabilityDescription(rxssDescription)

logicService = LogicService(db_type="test")
logicService.configNewScan("test")
rxssalgo = MainWindow(db_type="test", dbName="test")
rxssalgo.ScanPage(pageEntity=pageEntity1,
                  sessionEntity=sessionEntity)

# app.exec_()
