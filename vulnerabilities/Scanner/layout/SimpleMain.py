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

pageEntity1 = PageEntity(url="http://alesev.co.il/xss.php", pageHash=123)
pageEntity2 = PageEntity(url="http://alesev.co.il/xss2.php", pageHash=123)
pageEntity3 = PageEntity(url="http://alesev.co.il/xss3.php", pageHash=123)
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
rxssalgo.ScanPage(pageEntity=pageEntity2,
                  sessionEntity=sessionEntity)
rxssalgo.ScanPage(pageEntity=pageEntity3,
                  sessionEntity=sessionEntity)

# app.exec_()
