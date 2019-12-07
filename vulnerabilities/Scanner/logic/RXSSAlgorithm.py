import ConfigParser
import sys

import VulnerabilitiesCRUD
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
from Methods import ParseForms

reload(sys)
sys.setdefaultencoding('utf8')
import os
from PyQt4.QtGui import *
from PyQt4.QtCore import *
from PyQt4.QtWebKit import *
from PyQt4.QtNetwork import *
import urllib
from urlparse import urlparse


class JShandle(QMainWindow):
    def __init__(self, parent=None):
        super(JShandle, self).__init__(parent)

    def RenderPage(self, html, cj_mechanize, urlform):
        self.setWindowTitle("TestingSite")
        self.browser = QWebView()
        self.cj_mechanize = cj_mechanize
        self.updateCookiesMechanizetoQt()
        self.networkAccessManager = QNetworkAccessManager()
        self.networkAccessManager.setCookieJar(self.cookieJar)
        self.browser.page().setNetworkAccessManager(self.networkAccessManager)
        self.browser.loadFinished.connect(self.RenderPageFinishedEvent)
        self.browser.setHtml(html, QUrl(urlform))
        self.setCentralWidget(self.browser)

    def RenderPageFinishedEvent(self):
        self.htmlResponse = self.browser.page().mainFrame().toHtml().toUtf8()
        return self.htmlResponse

    def updateCookiesMechanizetoQt(self):
        self.cookieJar = QNetworkCookieJar()
        QcookieList = []
        list = []
        for Mcookie in self.cj_mechanize:
            Qcookie = QNetworkCookie()
            Qcookie.setName(Mcookie.name)
            Qcookie.setValue(Mcookie.value)
            Qcookie.setDomain(Mcookie.domain)
            QcookieList.append(Qcookie)
            list.append(Mcookie.name + ":" + Mcookie.value)
        self.cookieJar.setAllCookies(QcookieList)


class MainWindow(QMainWindow):
    def __init__(self, table_name=None, db_type=None, *args,
                 **kwargs):
        self.app = QApplication(sys.argv)
        self.app.setApplicationName(QString("Chrome"))
        self.app.setApplicationVersion(QString("53.0.2785.113"))
        super(MainWindow, self).__init__(*args, **kwargs)
        self.setWindowTitle("ScarpSite")
        self.browser = QWebView()
        self.networkAccessManager = QNetworkAccessManager()
        self.cookieJar = QNetworkCookieJar()
        self.__VulnCrud = VulnerabilitiesCRUD
        self.__tableName = table_name
        self.get_configuration_properties()

    def setTableName(self, tableName):
        self.__tableName = tableName

    def get_configuration_properties(self):
        self.config = ConfigParser.RawConfigParser()
        self.config.read('..\common\config.properties')
        # means for authentication
        self.cookie = self.config.get('Authentication', 'Cookie')
        self.baseAuth = self.config.get('Authentication', 'BasicAuthentication')

        self.env_type = self.config.get('CurrentEnvironment', 'type')

        # form_attributes_indices
        self.method_index = int(self.config.get('FormAttributes', 'method'))
        self.inputnames_index = int(self.config.get('FormAttributes', 'inputnames'))
        self.inputnonames_index = int(self.config.get('FormAttributes', 'inputnonames'))

        # get rxss description key
        self.descriptionKey = self.config.get('RXSS', 'rxss')

    def ScanPage(self, pageEntity=None, forms=None, links=None, vulnUtils=None):
        self.forms = forms
        self.links = links
        self.vulnUtils = vulnUtils
        self.updateCookiesMechanizetoQt(self.vulnUtils.getCookieJar())
        self.url = pageEntity.getURL()
        self.domain = urlparse(self.url).hostname
        self.browser.loadFinished.connect(self.__onUrlLoaded)
        self.browser.page().setNetworkAccessManager(self.networkAccessManager)
        self.browser.page().userAgentForUrl(QUrl(self.url))
        curURL = QUrl(self.url)
        self.browser.load(curURL)
        self.setCentralWidget(self.browser)
        self.show()
        self.app.exec_()

    def __onUrlLoaded(self):
        print("RXSS url loaded")
        self.browser.loadFinished.disconnect(self.__onUrlLoaded)
        self.LoadConfigurations()
        self.ScanLinks()
        self.ScanForms()
        self.app.closeAllWindows()
        self.app.quit()
        self.browser.close()

    def LoadConfigurations(self):
        self.xsspayload = self.vulnUtils.getRXSSPayloads()

    def ScanForms(self):
        print("scanning forms")
        for form in self.forms:
            (method, inputnames, inputnonames) = self.forms[form][self.method_index], self.forms[form][
                self.inputnames_index], self.forms[form][
                                                     self.inputnonames_index]
            str_inputnames = {}
            for k, v in inputnames.iteritems():
                str_inputnames[k] = unicode(v).encode('utf-8')
            inputnames = str_inputnames
            for inputname in inputnames:
                for payload in self.xsspayload:
                    data = ParseForms(inputname, inputnames, payload.getPayload(), inputnonames)
                    check_r = True
                    try:
                        # Get Response From the Server
                        htmlResponse, response_hash, elapsed_time, requestB64 = self.vulnUtils.get_url_open_results(
                            method, data, self.url)
                    except Exception as e:
                        check_r = False
                        print "<h1>[-]Error:<h1><h2>URL:</h2> " + self.urlform + "<br><h2>Data:</h2> " + data.encode(
                            'utf-8') + "<br><h2>Error: </h2>" + str(e) + "<br><br><br><br>"
                    if check_r:
                        self.validatePayload(payload=payload, method=method, data=data, htmlResponse=htmlResponse,
                                             requestB64=requestB64)

    def validatePayload(self, payload=None, method=None, data=None, htmlResponse=None, requestB64=None):
        self.htmlResponse = htmlResponse
        self.RenderingHandler()
        if (payload.getExpectedResult() in self.htmlResponse) or payload.getPayload() in self.htmlResponse:
            print "**Response Before Rendering** method: " + method + " Maybe XSS: payload " + payload.getPayload() + " return in the response, URL: " + self.url + " payload: " + data + "\n"
            if payload.getExpectedResult() in self.MainWindowJShandle.htmlResponse:
                self.event = "**XSS Detected After Rendering** method: " + method + " payload " + payload.getPayload() + " URL : " + self.url + " payload: " + data + "\n"
                self.addEvent(vuln_descriptor=self.descriptionKey, url=self.url,
                              payload=payload.getPayload(),
                              requestB64=requestB64)
            else:  # False Positive
                print "***Identified False Positive*** method:" + method + " payload " + payload.getPayload() + " URL: " + self.urlform + " payload: " + data + "\n"

    def RenderingHandler(self):
        self.MainWindowJShandle = JShandle()
        self.MainWindowJShandle.RenderPage(self.htmlResponse, self.vulnUtils.getCookieJar(), self.urlform)
        self.MainWindowJShandle.htmlResponse = self.MainWindowJShandle.RenderPageFinishedEvent()

    def updateCookiesMechanizetoQt(self, cj_mechanize):
        self.cookieJar = QNetworkCookieJar()
        QcookieList = []
        list = []
        for Mcookie in cj_mechanize:
            Qcookie = QNetworkCookie()
            Qcookie.setName(Mcookie.name)
            Qcookie.setValue(Mcookie.value)
            Qcookie.setDomain(Mcookie.domain)
            QcookieList.append(Qcookie)
            list.append(Mcookie.name + ":" + Mcookie.value)
        self.cookieJar.setAllCookies(QcookieList)

    def GetLinkInputFields(self, link):
        self.urlform = urlparse(link).scheme + "://" + urlparse(link).hostname + urlparse(link).path + urlparse(
            link).params
        self.urlform = self.urlform.encode("utf8")
        if len(urlparse(link).query):
            inputnames = {}
            print urlparse(link).query
            for parameter in urlparse(link).query.split('&'):
                if len(parameter.split('=')) >= 2:
                    inputnames[parameter.split('=')[0]] = parameter.split('=')[1]
                elif len(parameter.split('=')) == 1:
                    inputnames[parameter.split('=')[0]] = ''
            return inputnames

    def ScanLinks(self):
        print("scanning links")
        for link in self.links:
            inputnames = self.GetLinkInputFields(link)
            if (inputnames != None):
                for inputname in inputnames:
                    for payload in self.xsspayload:
                        originalvalue = inputnames[inputname]
                        inputnames[inputname] = payload.getPayload()
                        data = urllib.urlencode(inputnames)
                        print self.urlform + "?" + data.encode('utf-8')
                        inputnames[inputname] = originalvalue
                        try:
                            method = "GET"
                            htmlresponse, response_hash, elapsed_time, requestB64 = self.vulnUtils.get_url_open_results(
                                method, data, self.url)
                            self.validatePayload(payload=payload, method=method, data=data, htmlResponse=htmlresponse,
                                                 requestB64=requestB64)
                        except Exception as e:
                            print "[-] Error happend " + str(e)

    def addEvent(self, vuln_descriptor=None, url=None,
                 payload=None,
                 requestB64=None):
        simpleVulnerability = SimpleVulnerabilityEntity(name=vuln_descriptor, url=url,
                                                        payload=payload,
                                                        requestB64=requestB64)
        createdVuln = self.__VulnCrud.createVulnerability(simpleVulnerability, self.__tableName, self.env_type)
        print(self.event)
