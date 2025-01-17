import ConfigParser
import requests

import VulnerabilitiesCRUD
from Methods import ParseForms
import urllib
from urlparse import urlparse


# class JShandle(QMainWindow):
#     def __init__(self, parent=None):
#         super(JShandle, self).__init__(parent)
#
#     def RenderPage(self, html, cj_mechanize, urlform):
#         self.setWindowTitle("TestingSite")
#         self.browser = QWebView()
#         self.cj_mechanize = cj_mechanize
#         self.updateCookiesMechanizetoQt()
#         self.networkAccessManager = QNetworkAccessManager()
#         self.networkAccessManager.setCookieJar(self.cookieJar)
#         self.browser.page().setNetworkAccessManager(self.networkAccessManager)
#         self.browser.loadFinished.connect(self.RenderPageFinishedEvent)
#         self.browser.setHtml(html, QUrl(urlform))
#         self.setCentralWidget(self.browser)
#
#     def RenderPageFinishedEvent(self):
#         # self.browser.loadFinished.disconnect(self.RenderPageFinishedEvent)
#         self.htmlResponse = self.browser.page().mainFrame().toHtml().toUtf8()
#         return self.htmlResponse
#
#     def updateCookiesMechanizetoQt(self):
#         self.cookieJar = QNetworkCookieJar()
#         QcookieList = []
#         list = []
#         for Mcookie in self.cj_mechanize:
#             Qcookie = QNetworkCookie()
#             Qcookie.setName(Mcookie.name)
#             Qcookie.setValue(Mcookie.value)
#             Qcookie.setDomain(Mcookie.domain)
#             QcookieList.append(Qcookie)
#             list.append(Mcookie.name + ":" + Mcookie.value)
#         self.cookieJar.setAllCookies(QcookieList)


class MainWindow():
    def __init__(self, *args,
                 **kwargs):
        self.__VulnCrud = VulnerabilitiesCRUD
        self.get_configuration_properties()

    def get_configuration_properties(self):
        self.config = ConfigParser.RawConfigParser()
        self.config.read('../common/config.properties')
        # means for authentication
        self.cookie = self.config.get('Authentication', 'Cookie')
        self.baseAuth = self.config.get('Authentication', 'BasicAuthentication')

        # Get render service URL
        self.renderServiceURL = self.config.get('RenderServerInfo', 'url')

        self.env_type = self.config.get('CurrentEnvironment', 'type')

        # form_attributes_indices
        self.method_index = int(self.config.get('FormAttributes', 'method'))
        self.inputnames_index = int(self.config.get('FormAttributes', 'inputnames'))
        self.inputnonames_index = int(self.config.get('FormAttributes', 'inputnonames'))

        # get rxss description key
        self.descriptionKey = self.config.get('RXSS', 'rxss')
        self.vulnType = self.config.get('Vulnerabilities', 'RXSS');

    def ScanPage(self, pageEntity=None, forms=None, links=None, vulnUtils=None):
        self.forms = forms
        self.links = links
        self.page_entity = pageEntity
        self.vulnUtils = vulnUtils
        self.url = pageEntity.getURL()
        self.domain = urlparse(self.url).hostname
        self.__onUrlLoaded()

    def __onUrlLoaded(self):
        self.LoadConfigurations()
        self.ScanLinks()
        self.ScanForms()

    def LoadConfigurations(self):
        self.xsspayload = self.vulnUtils.getRXSSPayloads()

    def ScanForms(self):
        print("scanning forms")
        for form in self.forms:
            (method, inputnames) = self.forms[form][self.method_index], self.forms[form][self.inputnames_index]
            inputnonames = self.vulnUtils.getUncheckedFormInputNames(form,
                                                                     self.forms[form][self.inputnonames_index],
                                                                     self.vulnType)
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
                        self.vulnUtils.compareHashes(self.url, self.page_entity.getPageHash())
                    except Exception as e:
                        check_r = False
                        print "[-] Error happend " + str(e)
                    if check_r:
                        result = self.validatePayload(payload=payload, method=method, data=data,
                                                      htmlResponse=htmlResponse,
                                                      requestB64=requestB64)
                        if result:
                            break
                        #All inputnames left are not vulnerable and will not be checked again for vulnType vulnerability
                        self.vulnUtils.addNonVulnerableFormInputNames(form, inputnonames, self.vulnType)

    def validatePayload(self, payload=None, method=None, data=None, htmlResponse=None, requestB64=None):
        self.htmlResponse = htmlResponse
        if (payload.getExpectedResult() in urllib.unquote(self.htmlResponse)) or payload.getPayload() in urllib.unquote(
                self.htmlResponse):
            print "**Response Before Rendering** method: " + method + " Maybe XSS: payload " + payload.getPayload() + " return in the response, URL: " + self.url + " payload: " + data + "\n"
            req = requests.post(self.renderServiceURL, data={'content': str(self.htmlResponse)})
            if payload.getExpectedResult() in urllib.unquote(req.json()["result"]):
                self.event = "**XSS Detected After Rendering** method: " + method + " payload " + payload.getPayload() + " URL : " + self.url + " payload: " + data + "\n"
                print(self.event)
                self.vulnUtils.add_event(name=self.descriptionKey, url=self.url, payload=payload.getPayload(),
                                         requestB64=requestB64)
                return True
            else:  # False Positive
                print "***Identified False Positive*** method:" + method + " payload " + payload.getPayload() + " URL: " + self.url + " payload: " + data + "\n"
        else:
            print(
                    "page : " + self.url + " does not vulnerable to RXSS using the following payload :" + payload.getPayload())
        return False

    # def GetLinkInputFields(self, link):
    #     self.urlform = urlparse(link).scheme + "://" + urlparse(link).hostname + urlparse(link).path + urlparse(
    #         link).params
    #     self.urlform = self.urlform.encode("utf8")
    #     if len(urlparse(link).query):
    #         inputnames = {}
    #         print urlparse(link).query
    #         for parameter in urlparse(link).query.split('&'):
    #             if len(parameter.split('=')) >= 2:
    #                 inputnames[parameter.split('=')[0]] = parameter.split('=')[1]
    #             elif len(parameter.split('=')) == 1:
    #                 inputnames[parameter.split('=')[0]] = ''
    #         return inputnames

    def ScanLinks(self):
        print("scanning links")
        for link in self.links:
            # I moved the self.urlform update to here from GetLinkInputFields
            self.urlform = urlparse(link).scheme + "://" + urlparse(link).hostname + urlparse(link).path + urlparse(
                link).params
            self.urlform = self.urlform.encode("utf8")
            # inputnames = self.GetLinkInputFields(link)
            allInputnames, uncheckedInputNames = self.vulnUtils.get_link_input_names(link)
            # if (inputnames != None):
            for inputname in uncheckedInputNames:
                for payload in self.xsspayload:
                    originalvalue = allInputnames[inputname]  # changed from inputnames
                    allInputnames[inputname] = payload.getPayload()  # changed from inputnames
                    data = urllib.urlencode(allInputnames)  # changed from inputnames
                    print self.urlform + "?" + data.encode('utf-8')
                    allInputnames[inputname] = originalvalue  # changed from inputnames
                    try:
                        method = "GET"
                        htmlresponse, response_hash, elapsed_time, requestB64 = self.vulnUtils.get_url_open_results(
                            method, data, self.url)
                        self.vulnUtils.compareHashes(self.url, self.page_entity.getPageHash())
                        result = self.validatePayload(payload=payload, method=method, data=data,
                                                      htmlResponse=htmlresponse,
                                                      requestB64=requestB64)
                        if result:
                            break
                    except Exception as e:
                        print "[-] Error happend " + str(e)
