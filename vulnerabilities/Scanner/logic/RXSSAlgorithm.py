# encoding=utf8
import ConfigParser
import base64
import sys

import RXSSCrud
# from VulnerabilitiesCRUD import VulnerabilitiesCRUD
import VulnerabilitiesCRUD
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
from methods import GetFormInputFields, ParseForms

reload(sys)
sys.setdefaultencoding('utf8')
import os
from PyQt4.QtGui import *
from PyQt4.QtCore import *
from PyQt4.QtWebKit import *
from PyQt4.QtNetwork import *
import mechanize
import cookielib
import json
import urllib
from urlparse import urlparse, urljoin
from bs4 import BeautifulSoup


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
        # self.updateCookiesQttoMechanize()
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

    # def updateCookiesQttoMechanize(self):
    #     list = []
    #     self.cj_mechanize = cookielib.LWPCookieJar()
    #     for Qcookie in self.cookieJar.allCookies():
    #         ck = cookielib.Cookie(
    #             version=0,
    #             name=Qcookie.name().data().decode(),
    #             value=Qcookie.value().data().decode(),
    #             port=None,
    #             port_specified=False,
    #             domain=str(Qcookie.domain()),
    #             domain_specified=True,
    #             domain_initial_dot=False,
    #             path='/',
    #             path_specified=True,
    #             secure=False,
    #             expires=None,
    #             discard=False,
    #             comment=None,
    #             comment_url=None,
    #             rest=None
    #         )
    #         # print ck
    #         self.cj_mechanize.set_cookie(ck)
    #         list.append(Qcookie.name().data().decode() + ":" + Qcookie.value().data().decode())


class MainWindow(QMainWindow):
    def __init__(self, table_name=None, db_type=None, *args,
                 **kwargs):
        self.app = QApplication(sys.argv)
        self.app.setApplicationName(QString("Chrome"))
        self.app.setApplicationVersion(QString("53.0.2785.113"))
        super(MainWindow, self).__init__(*args, **kwargs)
        self.setWindowTitle("ScarpSite")
        self.browser = QWebView()
        # self.html = self.browser.page().mainFrame().toHtml().toUtf8()
        # self.soup = BeautifulSoup(str(self.html), 'html.parser')
        self.networkAccessManager = QNetworkAccessManager()
        self.cookieJar = QNetworkCookieJar()
        self.__VulnCrud = VulnerabilitiesCRUD
        self.__RXSSCrud = RXSSCrud
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

        # form_attributes_indices
        self.method_index = int(self.config.get('FormAttributes', 'method'))
        self.inputnames_index = int(self.config.get('FormAttributes', 'inputnames'))
        self.inputnonames_index = int(self.config.get('FormAttributes', 'inputnonames'))

        # get rxss description key
        self.descriptionKey = self.config.get('RXSS', 'description_key')

    def setcookies(self, domain):
        self.networkAccessManager = QNetworkAccessManager()
        self.cookieJar = QNetworkCookieJar()
        self.networkAccessManager.setCookieJar(self.cookieJar)
        cookieList = []
        list = []
        print " dir is" + os.getcwd()
        for cookie in self.__sessionEntity.getValue().split(";"):
            cookie_name = cookie.split("=")[0]  # Cookie name
            cookie_value = cookie[len(cookie.split("=")[0]) + 1:]  # Cookie value
            Qcookie = QNetworkCookie()
            Qcookie.setName(cookie_name)
            Qcookie.setValue(cookie_value)
            Qcookie.setDomain(domain)
            cookieList.append(Qcookie)
            # print cookie.value()
            list.append(cookie_name + ":" + cookie_value)
        # print "[*] Cookies from file: " +str(list)
        self.cookieJar.setAllCookies(cookieList)

    def ScanPage(self, pageEntity=None, forms=None, links=None, vulnUtils=None):
        self.forms = forms
        self.links = links
        self.vulnUtils = vulnUtils
        self.updateCookiesMechanizetoQt(self.vulnUtils.getCookieJar())
        self.url = pageEntity.getURL()
        self.domain = urlparse(self.url).hostname
        self.browser.loadFinished.connect(self.__urlLoadFinished)
        self.browser.page().setNetworkAccessManager(self.networkAccessManager)
        self.browser.page().userAgentForUrl(QUrl(self.url))
        curURL = QUrl(self.url)
        self.browser.load(curURL)
        self.setCentralWidget(self.browser)
        self.show()
        self.app.exec_()

    def __urlLoadFinished(self):
        self.browser.loadFinished.disconnect(self.__urlLoadFinished)
        # self.html = self.browser.page().mainFrame().toHtml().toUtf8()
        # self.soup = BeautifulSoup(str(self.html), 'html.parser')
        # self.InitMechanize()
        self.LoadConfigurations()
        self.ScanPageLinks()
        self.ScanForms()
        # self.scarplinks()
        self.app.closeAllWindows()
        self.app.quit()

    # def extractLinksFromURL(self):
    #     links = self.soup.findAll(name='a')
    #     self.links_array_include_mainUrl = []
    #     for link in links:
    #         # print link
    #         if link.has_attr('href'):
    #             href_full_link = urljoin(self.url, link['href'])
    #             if urlparse(href_full_link).hostname == self.domain:
    #                 self.links_array_include_mainUrl.append(href_full_link)
    #     self.links_array_include_mainUrl.append(self.url)
    #     self.links_array_include_mainUrl = list(set(self.links_array_include_mainUrl))

    # def InitMechanize(self):
    #     self.br = mechanize.Browser()
    #     self.UpdateCookiesQttoMechanize()
    #     self.br.set_cookiejar(self.cj_mechanize)
    #     # Browser options
    #     self.br.set_handle_equiv(True)
    #     self.br.set_handle_gzip(True)
    #     self.br.set_handle_redirect(True)
    #     self.br.set_handle_referer(True)
    #     self.br.set_handle_robots(False)
    #     self.br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(),
    #                                max_time=1)  # Follows refresh 0 but not hangs on refresh > 1
    #     # Want debugging messages?
    #     # br.set_debug_http(True)
    #     # br.set_debug_redirects(True)
    #     # br.set_debug_responses(True)
    #
    #     # User-Agent
    #     self.br.addheaders = [('User-agent',
    #                            'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]

    def LoadConfigurations(self):
        ALLPAYLOADS = 1000
        self.xsspayload = self.__RXSSCrud.getRXSSPayloads(page=0, size=ALLPAYLOADS)

    def ScanForms(self):
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
        # self.UpdateCookiesMechanizetoQt()
        # self.htmlresponse = unicode(htmlResponse.read(), 'utf-8')
        self.htmlResponse = htmlResponse
        self.RenderingHandler()
        if (payload.getExpectedResult() in self.htmlResponse) or payload.getPayload() in self.htmlResponse:
            print "**Response Before Rendering** method: " + method + " Maybe XSS: payload " + payload.getPayload() + " return in the response, URL: " + self.urlform + " payload: " + data + "\n"
            if payload.getExpectedResult() in self.MainWindowJShandle.htmlResponse:
                self.event = "**XSS Detected After Rendering** method: " + method + " payload " + payload.getPayload() + " URL : " + self.urlform + " payload: " + data + "\n"
                self.addEvent(vuln_descriptor=self.descriptionKey, url=self.urlform,
                              payload=payload.getPayload(),
                              requestB64=requestB64)
            else:  # False Positive
                print "***Identified False Positive*** method:" + method + " payload " + payload.getPayload() + " URL: " + self.urlform + " payload: " + data + "\n"

    def RenderingHandler(self):
        # self.browser.hide()
        self.MainWindowJShandle = JShandle()
        self.MainWindowJShandle.RenderPage(self.htmlResponse, self.vulnUtils.getCookieJar(), self.urlform)
        self.MainWindowJShandle.htmlResponse = self.MainWindowJShandle.RenderPageFinishedEvent()
        # if str(self.cj_mechanize) != str(self.MainWindowJShandle.cj_mechanize):
        #     self.cj_mechanize = self.MainWindowJShandle.cj_mechanize

    def updateCookiesMechanizetoQt(self,cj_mechanize):
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

    # def UpdateCookiesQttoMechanize(self):
    #     list = []
    #     self.cj_mechanize = cookielib.LWPCookieJar()
    #     for Qcookie in self.cookieJar.allCookies():
    #         # name = Qcookie.name().data().decode()
    #         # value = Qcookie.value().data().decode()
    #         # Set cookies from file
    #         ck = cookielib.Cookie(
    #             version=0,
    #             name=Qcookie.name().data().decode(),
    #             value=Qcookie.value().data().decode(),
    #             port=None,
    #             port_specified=False,
    #             domain=self.domain,
    #             domain_specified=True,
    #             domain_initial_dot=False,
    #             path='/',
    #             path_specified=True,
    #             secure=False,
    #             expires=None,
    #             discard=False,
    #             comment=None,
    #             comment_url=None,
    #             rest=None
    #         )
    #         # print ck
    #         self.cj_mechanize.set_cookie(ck)
    #         list.append(Qcookie.name().data().decode() + ":" + Qcookie.value().data().decode())

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

    def ScanPageLinks(self):
        # self.extractLinksFromURL()
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

    # def scarplinks(self):
    #     self.browser.loadFinished.connect(self.handleLoadFinished)
    #     self.browser.page().setNetworkAccessManager(self.networkAccessManager)
    #     self.browser.load(QUrl(self.url))
    #     self.handleLoadFinished()

    # def handleLoadFinished(self):
    #     self.browser.loadFinished.disconnect(self.handleLoadFinished)
    #     self.html = self.browser.page().mainFrame().toHtml().toUtf8()
    #     self.soup = BeautifulSoup(str(self.html), 'html.parser')
    #     self.ScanForms()

    def addEvent(self, vuln_descriptor=None, url=None,
                 payload=None,
                 requestB64=None):
        simpleVulnerability = SimpleVulnerabilityEntity(name=vuln_descriptor, url=url,
                                                        payload=payload,
                                                        requestB64=requestB64)
        createdVuln = self.__VulnCrud.createVulnerability(simpleVulnerability, self.__dbName)
        f = open("Results.html", "a")
        f.write(self.event)
        f.close()
