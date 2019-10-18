import sys
from methods import GetFormInputFields, ParseFormsSQLI
from SQLICrud import SQLICrud
from PayloadObjects import SQLIPayloadEntity
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
from VulnerabilitiesCRUD import VulnerabilitiesCRUD

reload(sys)
sys.setdefaultencoding('utf8')
from mechanize import Browser
from bs4 import BeautifulSoup
from urllib import urlencode
from urlparse import urlparse, urljoin
import json
import mechanize
import hashlib
import re
import time
from lxml.html.diff import htmldiff


class SQLIAlgorithm():

    def __init__(self, db, links=None):
        self.sqliDBInstance = SQLICrud.getInstance(db)
        self.__links_backlog = []
        self.__links_chosen_to_scan = []
        self.__scanned = []
        if links is not None:
            self.updateLinks(links)

    # self.loadConfiguration()

    def loadConfiguration(self):
        # TODO: solve problems of storing ' in DB + json wouldn't parse escape character
        f = open("..\common\\sqliPayloads.json", "r")
        self.sqliPayloads = json.load(f)
        f.close()
        """f = open("..\common\\xssnontauchbleparameters.json", "r")
        self.xssnontauchbleparameters = json.load(f)
        f = open("..\common\\xssfixedparameters.json", "r")
        self.xssfixedparameters = json.load(f)
        f.close()"""

    def updateLinks(self, links):
        for link in links:
            if link not in self.__links_backlog and link not in self.__scanned and link not in self.__links_chosen_to_scan:
                self.__links_backlog.append(link)

    def InitMechanize(self):
        self.br = mechanize.Browser()
        # self.UpdateCookiesQttoMechanize()
        # self.br.set_cookiejar(self.cj_mechanize)

        # Browser options - have to understand what each of them means
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

    def scanSQLI(self, links=None):
        if links is not None:
            self.updateLinks(links)
        forms, links = self.getInjectionPoints()
        self.error_based_payloads = self.getPayloadsByType(type="error-based")
        self.error_based_responses = self.getErrorBasedResponses()
        for link in links:
            continue
        for link in forms:
            for form in link:
                # for payload in self.sqliPayloads:
                self.injectToForm(forms[link][form],
                                  link)  # , payload) #((method,inputnames,inputnonames),link,payload)
        # self.normalizePendingLinks(forms, links)
        # self.sqliDBInstance.closeConnection()
        for link in self.__links_chosen_to_scan:
            self.__scanned.append(link)
            self.__links_chosen_to_scan.remove(link)

    def getSQLIPayloads(self):
        payloads = []
        i = 0
        page_result = self.sqliDBInstance.getSQLIPayloads(page=i)
        while page_result != []:
            # payloads.extend(page_result)
            for payload in page_result:
                payloads.append(payload)
            i += 1
            page_result = self.sqliDBInstance.getSQLIPayloads(page=i)
        return payloads

    def getInjectionPoints(self):
        """return dictionary containing a url and its form/parsed link objects"""
        forms = {}
        links = {}
        for link in self.__links_backlog:
            domain = urlparse(link).hostname
            self.soup = BeautifulSoup(link, 'html.parser')
            links_list = self.extractLinks(link, domain)
            forms_list = self.extractForms()
            links[link] = links_list
            forms[link] = {}
            for form in forms_list:
                (method, inputnames, inputnonames) = GetFormInputFields(link, form)
                str_inputnames = {}
                for k, v in inputnames.iteritems():
                    str_inputnames[k] = unicode(v).encode('utf-8')
                inputnames = str_inputnames
                forms[link][form] = (method, inputnames, inputnonames)
            self.__links_chosen_to_scan.append(link)
            self.__links_backlog.remove(link)
        return (forms, links)

    def extractLinks(self, link, domain):
        links_list = []
        embedded_links = self.soup.findAll(name='a')
        for embedded_link in embedded_links:
            # print link
            if embedded_link.has_attr('href'):
                href_full_link = urljoin(link, embedded_link['href'])
                if urlparse(href_full_link).hostname == domain:
                    links_list.append(href_full_link)  # print href_full_link
        print ("[*] Number of links: " + str(len(links_list)))
        return links_list

    def extractForms(self):
        return self.soup.findAll(name='form', action=True)

    def injectToLink(self):
        pass

    def getPayloadsByType(self, type):
        payloads = []
        i = 0
        page_result = self.sqliDBInstance.getPayloadsByType(type=type, page=i)
        while page_result != []:
            for payload in page_result:
                payloads.append(payload)
            i += 1
            page_result = self.sqliDBInstance.getPayloadsByType(type=type, page=i)
        return payloads

    def getErrorBasedResponses(self):
        error_based_responses = []
        i = 0
        page_result = self.sqliDBInstance.getResponses()
        while page_result != []:
            for response in page_result:
                error_based_responses.append(response)
            i += 1
            page_result = self.sqliDBInstance.getResponses()
        return error_based_responses

    def injectToForm(self, form_attributes, link):
        non_vulnerable_inputnames = form_attributes[1]
        url = self.linkToURL(link)
        # error-based
        for payload in self.error_based_payloads:
            splitted_payload = payload.getPayload().split(';;')
            regular_payload, error_payload, regular_imitating_payload = splitted_payload[0], splitted_payload[1], \
                                                                        splitted_payload[2]
            for inputname in non_vulnerable_inputnames:
                regular_result = self.getUrlOpenResults(form_attributes[0],
                                                                ParseFormsSQLI(inputname, form_attributes[1],
                                                                               regular_payload, form_attributes[2]),
                                                                url)
                error_result = self.getUrlOpenResults(form_attributes[0],
                                                      ParseFormsSQLI(inputname, form_attributes[1], error_payload,
                                                                     form_attributes[2]), url)
                regular_imitating_result = self.getUrlOpenResults(form_attributes[0],
                                                                  ParseFormsSQLI(inputname, form_attributes[1],
                                                                                 regular_imitating_payload,
                                                                                 form_attributes[2]), url)
                if self.validateErrorBased(regular_result, error_result, regular_imitating_result, url, form_attributes, splitted_payload):
                    self.event = "**SQLI Detected** method: " + form_attributes[0] + " response " + error_result[
                        0] + " URL : " + url + " payload: " + error_payload + "\n"
                    self.addEvent()
                    non_vulnerable_inputnames.remove(inputname)


    def getUrlOpenResults(self, method, data, url):
        check_r = True
        if method.lower() == "post":
            try:
                # Get Response From the Server
                start = time.time()
                r = self.br.open(url, data.encode('utf-8'))
                end = time.time()
            except Exception as e:
                check_r = False
                """self.event = "<h1>[-]Error:<h1><h2>URL:</h2> " + url + "<br><h2>Data:</h2> " + data.encode(
                    'utf-8') + "<br><h2>Error: </h2>" + str(e) + "<br><br><br><br>"
                # print "[+] ***Original HTML response***\n    Maybe XSS: payload "+response+" return in the response, URL: "+self.urlform+" payload: "+data+"\n\n"
                self.addEvent()"""
        else:
            try:
                # Get Response From the Server
                start = time.time()
                r = self.br.open(url + "?" + data.encode('utf-8'))
                end = time.time()
            except Exception as e:
                check_r = False
                """self.event = "<h1>[-]Error:<h1><h2>URL:</h2> " + url + "?" + data.encode(
                    'utf-8') + "<br><h2>Error: </h2>" + str(e) + "<br><br><br><br>"
                self.addEvent()"""
        if check_r:
            # self.UpdateCookiesMechanizetoQt()
            htmlresponse = unicode(r.read(), 'utf-8')
            elapsed_time = end - start
            response_hash = self.hash_page(htmlresponse)
            return [htmlresponse, response_hash, elapsed_time]

    """def getRegularRequestData(self, form_attributes, url):
        data = urlencode(form_attributes[1])  # inputnames
        removefirstchar = len(data) == 0
        for inputnoname in form_attributes[2]:  # inputnonames
            data = data + "&" + inputnoname
        if removefirstchar:
            data = data[1::]
        return data"""

    def linkToURL(self, link):
        urlform = urlparse(link).scheme + "://" + urlparse(link).hostname + urlparse(link).path + urlparse(link).params
        return urlform.encode("utf8")

    def getLinkInputNames(self, link):
        inputnames = {}
        if len(urlparse(link).query):
            # print urlparse(link).query
            for parameter in urlparse(link).query.split('&'):
                if len(parameter.split('=')) >= 2:
                    inputnames[parameter.split('=')[0]] = parameter.split('=')[1]
                elif len(parameter.split('=')) == 1:
                    inputnames[parameter.split('=')[0]] = ''
        return inputnames

    def validateErrorBased(self, regular_result, error_result, regular_imitating_result, url, form_attributes, splitted_payload):
        if regular_result[1] == regular_imitating_result[1] and regular_result[1] != error_result[1]:
            return True
        else:
            soup = BeautifulSoup(self.getDiffHtml(regular_result[0], error_result[1]))
            for response in self.error_based_responses:
                if soup.find(response.getResponse()):
                    return True
        return False

    def getDiffHtml(self, html1, html2):
        #TODO: complete function
        return

    def hash_page(self, page):
        self.hashSoup = BeautifulSoup(page, 'html.parser')
        self.removeChangingAttributesFromSoup()
        self.hash = hashlib.md5(str(self.hashSoup))
        return self.hash.digest()

    def removeChangingAttributesFromSoup(self):
        tags_to_remove = self.hashSoup.find_all(value=re.compile('[-a-zA-Z0-9+_/]{50,}'))
        for tag in tags_to_remove:
            tag.decompose()

    def addEvent(self):
        f = open("Results.html", "a")
        f.write(self.event)
        f.close()


"""s = SQLIAlgorithm()
br = mechanize.Browser()
br.addheaders = [('User-agent',
                  'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
response1 = br.open('https://opsrv.apps.openu.ac.il/digitalidentity/Basic')
response2 = br.open('https://opsrv.apps.openu.ac.il/digitalidentity/Basic')
# s.hash_page(str(response.read()))
f = htmldiff(str(unicode(response1.read(), 'utf-8')), str(unicode(response2.read(), 'utf-8')))
soup = BeautifulSoup(f, 'html.parser')
print(str(soup))"""
