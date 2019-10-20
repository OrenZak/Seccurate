import sys
from methods import GetFormInputFields, ParseFormsSQLI
from SQLICrud import SQLICrud
from bs4 import BeautifulSoup
from urllib import urlencode
from urlparse import urlparse, urljoin
import json
import mechanize
import hashlib
import re
import time

reload(sys)
sys.setdefaultencoding('utf8')


class SQLIAlgorithm():

    def __init__(self, db, links=None, cookie_jar=None):
        self.sqliDBInstance = SQLICrud.getInstance(db)
        self.__links_backlog = []
        self.__links_chosen_to_scan = []
        self.__scanned = []
        if links is not None:
            self.update_links(links)
        self.__cookie_jar = cookie_jar
        self.init_mechanize()

    # self.load_configuration()

    def load_configuration(self):
        # TODO: solve problems of storing ' in DB + json wouldn't parse escape character
        f = open("..\common\\sqliPayloads.json", "r")
        self.sqli_payloads = json.load(f)
        f.close()
        """f = open("..\common\\xssnontauchbleparameters.json", "r")
        self.xssnontauchbleparameters = json.load(f)
        f = open("..\common\\xssfixedparameters.json", "r")
        self.xssfixedparameters = json.load(f)
        f.close()"""

    def update_links(self, links):
        for link in links:
            if link not in self.__links_backlog and link not in self.__scanned and link not in self.__links_chosen_to_scan:
                self.__links_backlog.append(link)

    def init_mechanize(self):
        self.br = mechanize.Browser()
        # self.UpdateCookiesQttoMechanize()
        self.br.set_cookiejar(self.__cookie_jar)

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
        self.br.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 \
        (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]

    def scan_sqli(self, extra_links=None):
        if extra_links is not None:
            self.update_links(extra_links)
        forms, links = self.get_injection_points()
        self.error_based_payloads = self.get_payloads_by_type(payload_type="error-based")
        self.error_based_responses = self.get_error_based_responses()
        for link in links:
            pass  # self.injectToLink(links[link])
        for link in forms:
            for form in forms.get(link):
                self.inject_to_form(forms[link][form], link)
        for link in self.__links_chosen_to_scan:
            self.__scanned.append(link)
            self.__links_chosen_to_scan.remove(link)

    def get_injection_points(self):
        """return dictionary containing a url and its form/parsed link objects"""
        forms = {}
        links = {}
        for link in self.__links_backlog:
            domain = urlparse(link).hostname
            response = unicode(self.br.open(link).read(), 'utf-8')
            self.soup = BeautifulSoup(response, 'html.parser')
            links_list = self.extract_links(link, domain)
            forms_list = self.extract_forms()
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
        return forms, links

    def extract_links(self, link, domain):
        links_list = []
        embedded_links = self.soup.findAll(name='a')
        for embedded_link in embedded_links:
            if embedded_link.has_attr('href'):
                href_full_link = urljoin(link, embedded_link['href'])
                if urlparse(href_full_link).hostname == domain:
                    links_list.append(href_full_link)  # print href_full_link
        print ("[*] Number of links: " + str(len(links_list)))
        return links_list

    def extract_forms(self):
        return self.soup.findAll(name='form', action=True)

    def get_payloads_by_type(self, payload_type):
        payloads = []
        i = 0
        page_result = self.sqliDBInstance.getPayloadsByType(type=payload_type, page=i)
        while page_result:
            for payload in page_result:
                payloads.append(payload)
            i += 1
            page_result = self.sqliDBInstance.getPayloadsByType(type=payload_type, page=i)
        return payloads

    def get_error_based_responses(self):
        error_based_responses = []
        i = 0
        page_result = self.sqliDBInstance.getResponses(page=i)
        while page_result:
            for response in page_result:
                error_based_responses.append(response)
            i += 1
            page_result = self.sqliDBInstance.getResponses(page=i)
        return error_based_responses

    def inject_to_form(self, form_attributes, link):
        non_vulnerable_inputnames = form_attributes[1]
        url = self.link_to_url(link)
        # error-based
        for payload in self.error_based_payloads:
            splitted_payload = payload.getPayload().split(';;')
            regular_payload, error_payload, regular_imitating_payload = splitted_payload[0], splitted_payload[1], \
                                                                        splitted_payload[2]
            for inputname in non_vulnerable_inputnames:
                regular_result = self.get_url_open_results(form_attributes[0],
                                                           ParseFormsSQLI(inputname, form_attributes[1],
                                                                          regular_payload, form_attributes[2]), url)
                error_result = self.get_url_open_results(form_attributes[0],
                                                         ParseFormsSQLI(inputname, form_attributes[1], error_payload,
                                                                        form_attributes[2]), url)
                regular_imitating_result = self.get_url_open_results(form_attributes[0],
                                                                     ParseFormsSQLI(inputname, form_attributes[1],
                                                                                    regular_imitating_payload,
                                                                                    form_attributes[2]), url)
                if self.validate_error_based(regular_result, error_result, regular_imitating_result):
                    self.event = "**SQLI Detected** method: " + str(form_attributes[0]) + " response " + str(
                        error_result[0]) + " URL : " + url + " payload: " + error_payload + "\n"
                    self.add_event()
                    non_vulnerable_inputnames.pop(inputname, None)
                else:
                    print (inputname + " not vulnerable to payload " + error_payload)

    def inject_to_links(self, links):
        for link in links:
            url = self.link_to_url(link)
            inputnames = self.get_link_input_names(link)
            non_vulnerable_inputnames = inputnames
            # error_based
            for payload in self.error_based_payloads:
                splitted_payload = payload.getPayload().split(';;')
                regular_payload, error_payload, regular_imitating_payload = splitted_payload[0], splitted_payload[1], \
                                                                            splitted_payload[2]
                for inputname in non_vulnerable_inputnames:
                    regular_result = self.get_url_open_results("get", self.get_link_data(inputname, inputnames,
                                                                                         regular_payload), url)
                    error_result = self.get_url_open_results("get",
                                                             self.get_link_data(inputname, inputnames, error_payload),
                                                             url)
                    regular_imitating_result = self.get_url_open_results("get",
                                                                         self.get_link_data(inputname, inputnames,
                                                                                            error_payload), url)

                    if self.validate_error_based(regular_result, error_result, regular_imitating_result):
                        self.event = "**SQLI Detected** method: GET response " + str(
                            error_result[0]) + " URL : " + url + " payload: " + error_payload + "\n"
                        self.add_event()
                        non_vulnerable_inputnames.pop(inputname, None)
                    else:
                        print (inputname + " not vulnerable to payload " + error_payload)

    def get_link_input_names(self, link):
        inputnames = {}
        if len(urlparse(link).query):
            # print urlparse(link).query
            for parameter in urlparse(link).query.split('&'):
                if len(parameter.split('=')) >= 2:
                    inputnames[parameter.split('=')[0]] = parameter.split('=')[1]
                elif len(parameter.split('=')) == 1:
                    inputnames[parameter.split('=')[0]] = ''
        return inputnames

    def get_link_data(self, inputname, inputnames, payload):
        inputnames[inputname] = payload
        return urlencode(inputnames)

    def get_url_open_results(self, method, data, url):
        check_r = True
        if method.lower() == "post":
            try:
                # Get Response From the Server
                start = time.time()
                r = self.br.open(url, data.encode('utf-8'))
                end = time.time()
            except Exception as e:
                check_r = False

                self.event = "<h1>[-]Error:<h1><h2>URL:</h2> " + url + "<br><h2>Data:</h2> " + data.encode(
                    'utf-8') + "<br><h2>Error: </h2>" + str(e) + "<br><br><br><br>"
                # print "[+] ***Original HTML response***\n    Maybe XSS: payload "+response+" return in the response, \
                # URL: "+self.urlform+" payload: "+data+"\n\n"
                self.add_event()
        else:
            try:
                # Get Response From the Server
                start = time.time()
                r = self.br.open(url + "?" + data.encode('utf-8'))
                end = time.time()
            except Exception as e:
                check_r = False
                self.event = "<h1>[-]Error:<h1><h2>URL:</h2> " + url + "?" + data.encode(
                    'utf-8') + "<br><h2>Error: </h2>" + str(e) + "<br><br><br><br>"
                self.add_event()
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

    def link_to_url(self, link):
        urlform = urlparse(link).scheme + "://" + urlparse(link).hostname + urlparse(link).path + urlparse(link).params
        return urlform.encode("utf8")

    def validate_error_based(self, regular_result, error_result,
                             regular_imitating_result):  # , url, form_attributes, splitted_payload):
        if regular_result[1] == regular_imitating_result[1] and regular_result[1] != error_result[1]:
            return True
        else:
            diff = self.get_diff_response_content(regular_result[0], error_result[0])
            for response in self.error_based_responses:
                if response.getResponse() in diff:
                    return True
        return False

    def get_diff_response_content(self, response1, response2):
        soup1 = BeautifulSoup(response1, 'html.parser').find_all()
        soup1_contents = [tag.string for tag in soup1]
        soup2 = BeautifulSoup(response2, 'html.parser').find_all()
        soup2_contents = [tag.string for tag in soup2]
        return str([x for x in soup2_contents if x not in soup1_contents])

    def hash_page(self, page):
        self.hashSoup = BeautifulSoup(page, 'html.parser')
        self.remove_changing_attributes_from_soup()
        self.hash = hashlib.md5(str(self.hashSoup))
        return self.hash.digest()

    def remove_changing_attributes_from_soup(self):
        tags_to_remove = self.hashSoup.find_all(value=re.compile('[-a-zA-Z0-9+_/]{50,}'))
        for tag in tags_to_remove:
            tag.decompose()

    def add_event(self):
        f = open("Results.html", "a")
        f.write(self.event)
        f.close()

    def update_cookie_jar(self, cookie):
        self.__cookie_jar.set_cookie(cookie)

    def get_cookiejar(self):
        return self.__cookie_jar


"""s = SQLIAlgorithm()
br = mechanize.Browser()
br.addheaders = [('User-agent',
                  'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 \
                  (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]
response1 = br.open('https://opsrv.apps.openu.ac.il/digitalidentity/Basic')
response2 = br.open('https://opsrv.apps.openu.ac.il/digitalidentity/Basic')
# s.hash_page(str(response.read()))
f = htmldiff(str(unicode(response1.read(), 'utf-8')), str(unicode(response2.read(), 'utf-8')))
soup = BeautifulSoup(f, 'html.parser')
print(str(soup))"""
