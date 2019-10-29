import sys
import optparse

from RXSSAlgorithm import *
from PageObject import PageEntity
from SessionObject import SessionEntity

reload(sys)
sys.setdefaultencoding('utf8')

f = open("Results.html", "w")
f.write("")
f.close()

pageEntity1 = PageEntity(url="http://alesev.co.il/xss.php", pageHash=123)
pageEntity2 = PageEntity(url="http://alesev.co.il/xss2.php", pageHash=123)
pageEntity3 = PageEntity(url="http://alesev.co.il/xss3.php", pageHash=123)
sessionEntity = SessionEntity(type="cookie", value="sessionID=blablalba")

# app = QApplication(sys.argv)
# app.setApplicationName(QString("Chrome"))
# app.setApplicationVersion(QString("53.0.2785.113"))

rxssalgo = MainWindow(pageEntities=[pageEntity1, pageEntity2, pageEntity3], sessionEntity=sessionEntity)
rxssalgo.StartScan()

# app.exec_()
