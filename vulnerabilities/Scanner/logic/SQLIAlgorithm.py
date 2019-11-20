import sys
from methods import GetFormInputFields, ParseFormsSQLI
import SQLICrud
from bs4 import BeautifulSoup
from urllib import urlencode
from urlparse import urlparse, urljoin
import json
import mechanize
import hashlib
import re
import time
import ConfigParser
from VulnerabilitiesObjects import SimpleVulnerabilityEntity
import VulnerabilitiesCRUD
import base64
from cookielib import Cookie
import cookielib

reload(sys)
sys.setdefaultencoding('utf8')


class SQLIAlgorithm():

    def __init__(self, db_type):#,
                 #vuln_table_name):  # , page_entities=None, session_entity=None):  # db, links=None, cookie_jar=None):
        self.sqliDBInstance = SQLICrud #TODO: remove this - not needed
        #self.__vuln_table_name = vuln_table_name
        #self.vuln_db_instance = VulnerabilitiesCRUD
        self.get_configuration_properties()
        #self.init_mechanize()

    def get_configuration_properties(self):
        self.config = ConfigParser.RawConfigParser()
        self.config.read(
            'C:\\Users\\Guy Shakked\\PycharmProjects\\Seccurate\\vulnerabilities\\Scanner\\common\\config.properties')
        # means for authentication
        self.cookie = self.config.get('Authentication', 'Cookie')
        self.baseAuth = self.config.get('Authentication', 'BasicAuthentication')

        # form_attributes_indices
        self.method_index = int(self.config.get('FormAttributes', 'method'))
        self.inputnames_index = int(self.config.get('FormAttributes', 'inputnames'))
        self.inputnonames_index = int(self.config.get('FormAttributes', 'inputnonames'))

        # get_open_url_result_indices
        self.response_index = int(self.config.get('URLOpenResultIndices', 'response'))
        self.hash_index = int(self.config.get('URLOpenResultIndices', 'hash'))
        self.time_index = int(self.config.get('URLOpenResultIndices', 'time'))
        self.requestb64_index = int(self.config.get('URLOpenResultIndices', 'requestb64'))

        # error_based results indices
        self.regular_result_index = int(self.config.get('ErrorBasedVulnerabilityCheckIndices', 'regular'))
        self.error_result_index = int(self.config.get('ErrorBasedVulnerabilityCheckIndices', 'error'))
        self.regular_imitating_result_index = int(
            self.config.get('ErrorBasedVulnerabilityCheckIndices', 'regular_imitating'))

        # injection types data
        self.injection_types_count = len(self.config.options('SQLITypes'))
        self.injection_types = [self.config.get('SQLITypes', option) for option in self.config.options('SQLITypes')]
        self.error_based = self.config.get('SQLITypes', 'error_based')

    # def init_mechanize(self):
    #     self.br = mechanize.Browser()
    #
    #     self.cookie_jar = mechanize.CookieJar()
    #     self.br.set_cookiejar(self.cookie_jar)
    #
    #     # Browser options - have to understand what each of them means
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
    #     # User-Agent TODO: create a list to rotate from? That list should use both of us and be implementes in config
    #     self.br.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 \
    #     (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]

    def start_scan(self, pageEntity, forms, links, vulnUtils):#sessionEntity):
        #self.updateAuthenticationMethod(sessionEntity)
        #forms, links = self.get_injection_points(pageEntity)
        if forms or links:
            self.error_based_payloads = self.get_payloads_by_type(payload_type=self.error_based)
            self.error_based_responses = self.get_error_based_responses()
        #for page_entity in links:
        for link in links:
            self.inject_to_links(link, pageEntity, vulnUtils)
        for form in forms:
            self.inject_to_form(forms[form], pageEntity, vulnUtils)  # self.update_scanned_pages()

    # def updateAuthenticationMethod(self, sessionEntity):
    #     if (sessionEntity.getType() == self.cookie):  # TODO: should it be self.COOKIE?
    #         for cookie in sessionEntity.getValue().split(";"):
    #             #TODO - will we have problems if server would specify domain?
    #              self.cookie_jar.set_cookie(Cookie(version=0, name=str(cookie).split('=')[0], value=str(cookie).split('=')[1],
    #                                                port=None, port_specified=False, domain=str(cookie).split('=')[2],
    #                                                domain_specified=False, domain_initial_dot=False, path=str(cookie).split('=')[3],
    #                                                path_specified=True, secure=False, expires=None,#should change when I have cookie boundary
    #                                                discard=True, comment=None, comment_url=None, rest={}, rfc2109=False))
    #     elif (sessionEntity.getType() == self.baseAuth):
    #         #TODO: understand whether this adds headers also for future requests (that might need cookie instead)
    #         self.br.addheaders.append(('Authorization', sessionEntity.getValue()))

    # def get_injection_points(self, pageEntity):
    #     """return dictionary containing a url and its form/parsed link objects"""
    #     forms = {}
    #     links = {}
    #     url = pageEntity.getURL()
    #     domain = urlparse(url).hostname
    #     soup = self.get_soup_from_url(url)
    #     links_list = self.extract_links(url, domain, soup)
    #     forms_list = self.extract_forms(soup)
    #     links[pageEntity] = links_list
    #     forms[pageEntity] = {}
    #     for form in forms_list:
    #         (method, inputnames, inputnonames) = GetFormInputFields(url, form)
    #         str_inputnames = {}
    #         for k, v in inputnames.iteritems():
    #             str_inputnames[k] = unicode(v).encode('utf-8')
    #         inputnames = str_inputnames
    #         forms[pageEntity][form] = (method, inputnames, inputnonames)
    #     # self.page_entities_chosen_to_scan.append(pageEntity)
    #     # self.page_entities_backlog.remove(pageEntity)
    #     return forms, links

    def get_soup_from_url(self, url):
        response = unicode(self.br.open(url).read(), 'utf-8')
        return BeautifulSoup(response, 'html.parser')

    # def extract_links(self, url, domain, soup):
    #     links_list = []
    #     embedded_links = soup.findAll(name='a')
    #     for embedded_link in embedded_links:
    #         if embedded_link.has_attr('href'):
    #             href_full_link = urljoin(url, embedded_link['href'])
    #             if urlparse(href_full_link).hostname == domain:
    #                 links_list.append(href_full_link)  # print href_full_link
    #     print ("[*] Number of links: " + str(len(links_list)))
    #     return links_list
    #
    # def extract_forms(self, soup):
    #     return soup.findAll(name='form', action=True)

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

    def inject_to_form(self, form_attributes, page_entity, vulnUtils):
        # non_vulnerable_inputnames = []
        non_vulnerable_inputnames = form_attributes[self.inputnames_index]
        i = 0
        while i < self.injection_types_count and non_vulnerable_inputnames != {}:
            non_vulnerable_inputnames = self.inject_to_inputnames(injection_type=self.injection_types[i],
                non_vulnerable_inputnames=non_vulnerable_inputnames, page_entity=page_entity,
                form_attributes=form_attributes, vulnUtils=vulnUtils)
            i += 1

    def inject_to_links(self, link, page_entity, vulnUtils):
        all_inputnames = self.get_link_input_names(link)
        non_vulnerable_inputnames = all_inputnames
        i = 0
        while i < self.injection_types_count and non_vulnerable_inputnames != {}:
            non_vulnerable_inputnames = self.inject_to_inputnames(injection_type=self.injection_types[i],
                non_vulnerable_inputnames=non_vulnerable_inputnames, page_entity=page_entity,
                link_attributes=all_inputnames, vulnUtils=vulnUtils)
            i += 1

    def inject_to_inputnames(self, injection_type, non_vulnerable_inputnames, page_entity, form_attributes=None,
                             link_attributes=None, vulnUtils=None):
        # TODO: add other types in the next version and check if it is a form or a link
        if injection_type == self.error_based:
            if form_attributes:
                return self.handle_error_based(non_vulnerable_inputnames=non_vulnerable_inputnames,
                                               page_entity=page_entity, form_attributes=form_attributes,
                                               vulnUtils=vulnUtils)
            elif link_attributes:
                return self.handle_error_based(non_vulnerable_inputnames=non_vulnerable_inputnames,
                                               page_entity=page_entity, link_attributes=link_attributes,
                                               vulnUtils=vulnUtils)

    def handle_error_based(self, non_vulnerable_inputnames, page_entity, form_attributes=None, link_attributes=None,
                           vulnUtils=None):
        url = self.link_to_url(page_entity.getURL())
        final_non_vulnerable_input_names = []
        for inputname in non_vulnerable_inputnames:
            vulnerable = False
            for payload in self.error_based_payloads:
                # TODO: turn error_based_payloads into a list of tuples instead of splitting it every iterations
                splitted_payload = payload.getPayload().split(';;')
                # regular_payload, error_payload, regular_imitating_payload = splitted_payload[0], splitted_payload[
                #    1], splitted_payload[2]

                if form_attributes:
                    method = form_attributes[self.method_index]
                    data = self.get_form_data_with_payload(inputname=inputname,
                                                           inputnames=form_attributes[self.inputnames_index],
                                                           inputnonames=form_attributes[self.inputnonames_index],
                                                           splitted_payload=splitted_payload)
                else:  # links
                    method = "get"
                    data = self.get_link_data_with_payload(inputname, link_attributes, splitted_payload)

                regular_result = vulnUtils.get_url_open_results(method, data[self.regular_result_index], url)
                self.verify_regular_hash(regular_result[self.response_index], page_entity.getPageHash())
                error_result = vulnUtils.get_url_open_results(method, data[self.error_result_index], url)
                regular_imitating_result = vulnUtils.get_url_open_results(method, data[self.regular_imitating_result_index],
                                                                     url)

                if self.validate_error_based(regular_result, error_result, regular_imitating_result):
                    self.event = "SQLI Detected in :" + inputname
                    print(self.event)
                    vulnUtils.add_event(name=payload.getType(), url=url, payload=payload.getPayload(),
                                   requestB64=error_result[self.requestb64_index])
                    vulnerable = True
                    break
                else:
                    print (inputname + " not vulnerable to payload " + splitted_payload[
                        1])  # non_vulnerable_inputnames.append(inputname)
            if not vulnerable:
                final_non_vulnerable_input_names.append(inputname)
        return final_non_vulnerable_input_names

    def get_form_data_with_payload(self, inputname, inputnames, inputnonames, splitted_payload):
        """result = []
        for i in range(len(splitted_payload)):
            result.append(ParseFormsSQLI(inputname, inputnames, splitted_payload[i], inputnonames))
        return result"""
        return [ParseFormsSQLI(inputname, inputnames, payload, inputnonames) for payload in splitted_payload]

    def get_link_input_names(self, link):
        inputnames = {}
        if len(urlparse(link).query):
            # print urlparse(link).query
            for parameter in urlparse(link).query.split('&'):
                if len(parameter.split('=')) >= 2:  # TODO: what if values is base64/urlsafe padded with equal sign??
                    inputnames[parameter.split('=')[0]] = parameter.split('=')[1]
                elif len(parameter.split('=')) == 1:
                    inputnames[parameter.split('=')[0]] = ''
        return inputnames

    def get_link_data_with_payload(self, inputname, inputnames, splittes_payload):
        data = []
        for payload in splittes_payload:
            temp_inputnames = inputnames
            temp_inputnames[inputname] = payload
            data.append(urlencode(temp_inputnames))
        return data  # inputnames[inputname] = payload  # return urlencode(inputnames)

    """def get_url_open_results(self, method, data, url):
        check_r = True
        if method.lower() == "post":
            try:
                # Get Response From the Server
                start = time.time()
                r = self.br.open(url, data.encode('utf-8'))
                end = time.time()
            except Exception as e:
                check_r = False

                event = "<h1>[-]Error:<h1><h2>URL:</h2> " + url + "<br><h2>Data:</h2> " + data.encode(
                    'utf-8') + "<br><h2>Error: </h2>" + str(e) + "<br><br><br><br>"
                print(
                    event)  # print "[+] ***Original HTML response***\n    Maybe XSS: payload "+response+" return in the response, \  # URL: "+self.urlform+" payload: "+data+"\n\n"  # self.add_event()
        else:
            try:
                # Get Response From the Server
                start = time.time()
                r = self.br.open(url + "?" + data.encode('utf-8'))
                end = time.time()
            except Exception as e:
                check_r = False
                event = "<h1>[-]Error:<h1><h2>URL:</h2> " + url + "?" + data.encode(
                    'utf-8') + "<br><h2>Error: </h2>" + str(e) + "<br><br><br><br>"
                print(event)  # self.add_event()
        if check_r:
            # self.UpdateCookiesMechanizetoQt()
            htmlresponse = unicode(r.read(), 'utf-8')
            elapsed_time = end - start
            response_hash = self.hash_page(htmlresponse)
            request = str(method) + "\n" + "url = " + url + "\n" + "fullpayload = " + data
            return [htmlresponse, response_hash, elapsed_time, base64.b64encode(request)]"""

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
        if regular_result[self.hash_index] == regular_imitating_result[self.hash_index] and regular_result[
            self.hash_index] != error_result[self.hash_index]:
            return True
        else:
            diff = self.get_diff_response_content(regular_result[self.response_index],
                                                  error_result[self.response_index])
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

    #     def hash_page(self, page):

    # self.hashSoup = BeautifulSoup(page, 'html.parser')
    #     self.remove_changing_attributes_from_soup()
    #     self.hash = hashlib.md5(str(self.hashSoup))
    #     return self.hash.digest()

    def verify_regular_hash(self, actual_response, expected_hash):
        # TODO: edit this function after oren implements hash
        """if hashes not equal:
            if self.__session_entity.getType() == self.cookie:
                print ("cookie expired")  # TODO: raise ExpiredCookieException(page_entity)
            elif self.__session_entity.getType() == self.baseAuth:
                print ("wrong baseAuth")  # TODO: raise WrongBaseAuthCredentialsException(page_entity)"""
        return True

    # def remove_changing_attributes_from_soup(self):
    #     tags_to_remove = self.hashSoup.find_all(value=re.compile('[-a-zA-Z0-9+_/]{50,}'))
    #     for tag in tags_to_remove:
    #         tag.decompose()

    # def add_event(self, name=None, url=None, payload=None, requestB64=None):
    #     simpleVulnerability = SimpleVulnerabilityEntity(name=name, url=url, payload=payload, requestB64=requestB64)
    #     createdVuln = self.vuln_db_instance.createVulnerability(simpleVulnerability, self.__vuln_table_name)
    #     print(createdVuln.getRequestB64())  # f = open("Results.html", "a")  # f.write(self.event)  # f.close()



"""regular_result = self.get_url_open_results(form_attributes[self.method_index],
                                           ParseFormsSQLI(inputname,
                                                          form_attributes[self.inputnames_index],
                                                          regular_payload,
                                                          form_attributes[self.inputnonames_index]),
                                           url)
if not self.verify_regular_hash(regular_result[self.response_index], page_entity.getPageHash()):
    if self.__session_entity.getType() == self.cookie:
        print ("cookie expired")  # TODO: raise ExpiredCookieException(page_entity)
    elif self.__session_entity.getType() == self.baseAuth:
        print ("wrong baseAuth")  # TODO: raise WrongBaseAuthCredentialsException(page_entity)
error_result = self.get_url_open_results(form_attributes[self.method_index],
                                         ParseFormsSQLI(inputname,
                                                        form_attributes[self.inputnames_index],
                                                        error_payload,
                                                        form_attributes[self.inputnonames_index]),
                                         url)
regular_imitating_result = self.get_url_open_results(form_attributes[self.method_index],
                                                     ParseFormsSQLI(inputname,
                                                         form_attributes[self.inputnames_index],
                                                         regular_imitating_payload,
                                                         form_attributes[self.inputnonames_index]),
                                                     url)"""

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
