# encoding=utf8 
import sys

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
        # self.browser.setUrl(QUrl(urlform))
        # self.setCentralWidget(self.browser)
        self.browser.page().setNetworkAccessManager(self.networkAccessManager)
        self.browser.loadFinished.connect(self.RenderPageFinishedEvent)
        # with open('cur.txt', 'w') as file:
        #    file.write(html)
        # file_path = "C:\Users\zur\XSS Scanner\XSS Scanner\layout\cur.txt"
        # local_url = QUrl.fromLocalFile(file_path)
        # self.browser.load(local_url)
        self.browser.setHtml(html, QUrl(urlform))
        self.setCentralWidget(self.browser)

    def RenderPageFinishedEvent(self):
        self.htmlresponse = self.browser.page().mainFrame().toHtml().toUtf8()
        # print " new result : "+self.htmlresponse
        # self.show()
        self.updateCookiesQttoMechanize()
        return self.htmlresponse

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
        # print "[*] Cookies update Mechanize to QT from form view: " +str(list)
        self.cookieJar.setAllCookies(QcookieList)

    def updateCookiesQttoMechanize(self):
        list = []
        self.cj_mechanize = cookielib.LWPCookieJar()
        for Qcookie in self.cookieJar.allCookies():
            # name = Qcookie.name().data().decode()
            # value = Qcookie.value().data().decode()
            # Set cookies from file
            ck = cookielib.Cookie(
                version=0,
                name=Qcookie.name().data().decode(),
                value=Qcookie.value().data().decode(),
                port=None,
                port_specified=False,
                domain=str(Qcookie.domain()),
                domain_specified=True,
                domain_initial_dot=False,
                path='/',
                path_specified=True,
                secure=False,
                expires=None,
                discard=False,
                comment=None,
                comment_url=None,
                rest=None
            )
            # print ck
            self.cj_mechanize.set_cookie(ck)
            list.append(Qcookie.name().data().decode() + ":" + Qcookie.value().data().decode())


class MainWindow(QMainWindow):
    def __init__(self, *args, **kwargs):
        super(MainWindow, self).__init__(*args, **kwargs)
        self.setWindowTitle("ScarpSite")
        self.browser = QWebView()

    def setcookies(self, domain):
        self.networkAccessManager = QNetworkAccessManager()
        self.cookieJar = QNetworkCookieJar()
        self.networkAccessManager.setCookieJar(self.cookieJar)
        cookieList = []
        list = []
        print " dir is" + os.getcwd()
        for cookie in open("..\common\cookies.txt", "r").read().split(";"):
            cookie_name = cookie.split("=")[0].rstrip('\n');  # Cookie name
            cookie_value = cookie[len(cookie.split("=")[0]) + 1:].rstrip('\n');  # Cookie value
            Qcookie = QNetworkCookie()
            Qcookie.setName(cookie_name)
            Qcookie.setValue(cookie_value)
            Qcookie.setDomain(domain)
            cookieList.append(Qcookie)
            # print cookie.value()
            list.append(cookie_name + ":" + cookie_value)
        # print "[*] Cookies from file: " +str(list)
        self.cookieJar.setAllCookies(cookieList)

    def StartCrawling(self, url):
        self.url = url
        self.domain = urlparse(self.url).hostname;
        self.browser.loadFinished.connect(self.GetPages)
        self.browser.page().setNetworkAccessManager(self.networkAccessManager)
        self.browser.page().userAgentForUrl(QUrl(self.url))
        self.browser.load(QUrl(self.url))
        self.setCentralWidget(self.browser)
        self.show()

    def GetPages(self):
        self.browser.loadFinished.disconnect(self.GetPages)
        self.html = self.browser.page().mainFrame().toHtml().toUtf8()
        self.soup = BeautifulSoup(str(self.html), 'html.parser')
        links = self.soup.findAll(name='a')
        self.links_array = []
        # self.links_array.append(self.url)
        for link in links:
            # print link
            if link.has_attr('href'):
                href_full_link = urljoin(self.url, link['href'])
                if urlparse(href_full_link).hostname == self.domain:
                    self.links_array.append(href_full_link)
            # print href_full_link
        self.links_array_include_mainUrl = self.links_array
        self.links_array_include_mainUrl.append(self.url)
        self.links_array_include_mainUrl = list(set(self.links_array_include_mainUrl))
        self.links_array = list(set(self.links_array))
        print ("[*] Number of links: " + str(len(self.links_array)))
        self.InitMechanize()
        self.LoadConfigurations()
        self.ScanPageLinks()
        self.scarplinks()

    def InitMechanize(self):
        self.br = mechanize.Browser()
        self.UpdateCookiesQttoMechanize()
        self.br.set_cookiejar(self.cj_mechanize)
        # Browser options
        self.br.set_handle_equiv(True)
        self.br.set_handle_gzip(True)
        self.br.set_handle_redirect(True)
        self.br.set_handle_referer(True)
        self.br.set_handle_robots(False)
        self.br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(),
                                   max_time=1)  # Follows refresh 0 but not hangs on refresh > 1
        # Want debugging messages?
        # br.set_debug_http(True)
        # br.set_debug_redirects(True)
        # br.set_debug_responses(True)

        # User-Agent
        self.br.addheaders = [('User-agent',
                               'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]

    def LoadConfigurations(self):
        f = open("..\common\\xsspayload.json", "r")
        self.xsspayload = json.load(f)
        f = open("..\common\\xssnontauchbleparameters.json", "r")
        self.xssnontauchbleparameters = json.load(f)
        f = open("..\common\\xssfixedparameters.json", "r")
        self.xssfixedparameters = json.load(f)
        f.close()

    def ScanForms(self):
        forms = self.soup.findAll(name='form', action=True)
        for form in forms:
            (method, inputnames, inputnonames) = GetFormInputFields(self.url, form)
            str_inputnames = {}
            for k, v in inputnames.iteritems():
                str_inputnames[k] = unicode(v).encode('utf-8')
            inputnames = str_inputnames
            for inputname in inputnames:
                if (inputname not in self.xssnontauchbleparameters) and (inputname not in self.xssfixedparameters):
                    for payload in self.xsspayload:
                        data = ParseForms(inputname, inputnames, self.xssfixedparameters, payload, inputnonames)
                        check_r = True
                        if method.lower() == "post":
                            try:
                                # Get Response From the Server
                                r = self.br.open(self.urlform, data.encode('utf-8'))
                            except Exception as e:
                                check_r = False
                                self.event = "<h1>[-]Error:<h1><h2>URL:</h2> " + self.urlform + "<br><h2>Data:</h2> " + data.encode(
                                    'utf-8') + "<br><h2>Error: </h2>" + str(e) + "<br><br><br><br>"
                                # print "[+] ***Original HTML response***\n    Maybe XSS: payload "+response+" return in the response, URL: "+self.urlform+" payload: "+data+"\n\n"
                                self.addEvent()
                        else:
                            try:
                                # Get Response From the Server
                                r = self.br.open(self.urlform + "?" + data.encode('utf-8'))
                            except Exception as e:
                                check_r = False
                                self.event = "<h1>[-]Error:<h1><h2>URL:</h2> " + self.urlform + "?" + data.encode(
                                    'utf-8') + "<br><h2>Error: </h2>" + str(e) + "<br><br><br><br>"
                                self.addEvent()
                        if check_r:
                            self.UpdateCookiesMechanizetoQt()
                            self.htmlresponse = unicode(r.read(), 'utf-8')
                            # print self.html
                            self.RenderingHandler()
                            for response in self.xsspayload[payload]:
                                if response in self.htmlresponse:
                                    self.event = "**Response Before Rendering** method: " + method + " Maybe XSS: payload " + response + " return in the response, URL: " + self.urlform + " payload: " + data + "\n"
                                    self.addEvent()
                                    if response in self.MainWindowJShandle.htmlresponse:
                                        self.event = "**XSS Detected After Rendering** method: " + method + " payload " + response + " URL : " + self.urlform + " payload: " + data + "\n"
                                        self.addEvent()
                                    else:  # False Positive
                                        self.event = "***Identified False Positive*** method:" + method + " payload " + response + " URL: " + self.urlform + " payload: " + data + "\n"
                                        self.addEvent()

    def RenderingHandler(self):
        # self.browser.hide()
        self.MainWindowJShandle = JShandle()
        self.MainWindowJShandle.RenderPage(self.htmlresponse, self.cj_mechanize, self.urlform)
        self.MainWindowJShandle.htmlresponse = self.MainWindowJShandle.RenderPageFinishedEvent()
        if str(self.cj_mechanize) != str(self.MainWindowJShandle.cj_mechanize):
            self.cj_mechanize = self.MainWindowJShandle.cj_mechanize

    def UpdateCookiesMechanizetoQt(self):
        QcookieList = []
        list = []
        for Mcookie in self.cj_mechanize:
            Qcookie = QNetworkCookie()
            Qcookie.setName(Mcookie.name)
            Qcookie.setValue(Mcookie.value)
            Qcookie.setDomain(Mcookie.domain)
            QcookieList.append(Qcookie)
            list.append(Mcookie.name + ":" + Mcookie.value)
        # print "[*] Cookies update from Mechanize to QT : " +str(list)
        self.cookieJar.setAllCookies(QcookieList)

    def UpdateCookiesQttoMechanize(self):
        list = []
        self.cj_mechanize = cookielib.LWPCookieJar()
        for Qcookie in self.cookieJar.allCookies():
            # name = Qcookie.name().data().decode()
            # value = Qcookie.value().data().decode()
            # Set cookies from file
            ck = cookielib.Cookie(
                version=0,
                name=Qcookie.name().data().decode(),
                value=Qcookie.value().data().decode(),
                port=None,
                port_specified=False,
                domain=self.domain,
                domain_specified=True,
                domain_initial_dot=False,
                path='/',
                path_specified=True,
                secure=False,
                expires=None,
                discard=False,
                comment=None,
                comment_url=None,
                rest=None
            )
            # print ck
            self.cj_mechanize.set_cookie(ck)
            list.append(Qcookie.name().data().decode() + ":" + Qcookie.value().data().decode())

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
        for link in self.links_array_include_mainUrl:
            inputnames = self.GetLinkInputFields(link)
            if (inputnames != None):
                for inputname in inputnames:
                    if (inputname not in self.xssnontauchbleparameters) and (inputname not in self.xssfixedparameters):
                        for payload in self.xsspayload:
                            originalvalue = inputnames[inputname]
                            inputnames[inputname] = payload
                            for fixedinputname in self.xssfixedparameters:
                                for inputname0 in inputnames:
                                    if fixedinputname == inputname0:
                                        inputnames[inputname0] = self.xssfixedparameters[fixedinputname]
                            data = urllib.urlencode(inputnames)
                            print self.urlform + "?" + data.encode('utf-8')
                            inputnames[inputname] = originalvalue

                            try:
                                r = self.br.open(self.urlform + "?" + data.encode('utf-8'))
                                self.UpdateCookiesMechanizetoQt()
                                self.htmlresponse = unicode(r.read(), 'utf-8')
                                self.RenderingHandler()
                                for response in self.xsspayload[payload]:
                                    if response in self.htmlresponse:
                                        self.event = "**Response Before Rendering** method: GET Maybe XSS: payload " + response + " return in the response, URL: " + self.urlform + " payload: " + data + "\n"
                                        self.addEvent()
                                        if response in self.MainWindowJShandle.htmlresponse:
                                            self.event = "**XSS Detected method: GET : payload " + response + " return in the response, URL: " + self.urlform + " payload: " + data + "\n"
                                            self.addEvent()
                                        else:
                                            self.event = "***Identified False Positive*** method: GET payload " + response + " URL: " + self.urlform + " payload: " + data + "\n"
                                            self.addEvent()
                            except Exception as e:
                                self.event = "[-] Error happend " + str(e)
                                self.addEvent()

    def scarplinks(self):
        self.browser.loadFinished.connect(self.handleLoadFinished)
        self.browser.page().setNetworkAccessManager(self.networkAccessManager)
        self.browser.load(QUrl(self.url))
        self.count = 0

    def handleLoadFinished(self):
        self.html = self.browser.page().mainFrame().toHtml().toUtf8()
        self.soup = BeautifulSoup(str(self.html), 'html.parser')
        self.ScanForms()
        # soup = BeautifulSoup(str(frame), 'html.parser')
        # print soup.find_all(attrs={'id' : 'test'})
        if self.count < len(self.links_array):
            self.browser.load(QUrl(self.links_array[self.count]))
            print "[*] Link number: " + str(self.count + 1) + " - " + self.links_array[self.count]
            print "[*] Links left: " + str(int(len(self.links_array)) - int(self.count))
            # print self.browser.page().mainFrame().toHtml().toUtf8()
            self.count += 1

    def addEvent(self):
        f = open("Results.html", "a")
        f.write(self.event)
        f.close()
