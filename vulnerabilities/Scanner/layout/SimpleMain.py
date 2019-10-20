import sys
import optparse

import RXSSAlgorithm

reload(sys)
sys.setdefaultencoding('utf8')
from PyQt4.QtGui import *
from PyQt4.QtCore import *
from PyQt4.QtWebKit import *
from PyQt4.QtNetwork import *

from urlparse import urlparse
# from logic import RXSSAlgorithm

import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    # Legacy Python that doesn't verify HTTPS certificates by default
    pass
else:
    # Handle target environment that doesn't support HTTPS verification
    ssl._create_default_https_context = _create_unverified_https_context
parser = optparse.OptionParser("usage%prog " + \
                               "-u <URL>")
parser.add_option('-u', dest='url', type='string', \
                  help='specify url path')
(options, args) = parser.parse_args()
if (options.url == None):
    print parser.usage
    exit(0)
else:
    url = options.url

app = QApplication(sys.argv)
app.setApplicationName(QString("Chrome"));
app.setApplicationVersion(QString("53.0.2785.113"));
f = open("Results.html", "w")
f.write("")
f.close()
window = RXSSAlgorithm.MainWindow()
window.setcookies(urlparse(url).hostname)
window.StartCrawling(url)

app.exec_()
