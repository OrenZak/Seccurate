import sys
from Methods import ParseForms
import SQLICrud
from bs4 import BeautifulSoup
from urllib import urlencode
from urlparse import urlparse
import ConfigParser

reload(sys)
sys.setdefaultencoding('utf8')


class SQLIAlgorithm():

    def __init__(self, db_type):
        self.sqliDBInstance = SQLICrud  # TODO: remove this - not needed
        self.get_configuration_properties()

    def get_configuration_properties(self):
        self.config = ConfigParser.RawConfigParser()
        self.config.read(
            '..\common\config.properties')

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

    def start_scan(self, pageEntity, forms, links, vulnUtils):
        # if forms or links:
        #    self.error_based_payloads = self.get_payloads_by_type(payload_type=self.error_based)
        #    self.error_based_responses = self.get_error_based_responses()
        for link in links:
            self.inject_to_links(link, pageEntity, vulnUtils)
        for form in forms:
            self.inject_to_form(forms[form], pageEntity, vulnUtils)  # self.update_scanned_pages()

    # def get_soup_from_url(self, url):
    #     response = unicode(self.br.open(url).read(), 'utf-8')
    #     return BeautifulSoup(response, 'html.parser')

    # def get_payloads_by_type(self, payload_type):
    #     payloads = []
    #     i = 0
    #     page_result = self.sqliDBInstance.getPayloadsByType(type=payload_type, page=i)
    #     while page_result:
    #         for payload in page_result:
    #             payloads.append(payload)
    #         i += 1
    #         page_result = self.sqliDBInstance.getPayloadsByType(type=payload_type, page=i)
    #     return payloads
    #
    # def get_error_based_responses(self):
    #     error_based_responses = []
    #     i = 0
    #     page_result = self.sqliDBInstance.getResponses(page=i)
    #     while page_result:
    #         for response in page_result:
    #             error_based_responses.append(response)
    #         i += 1
    #         page_result = self.sqliDBInstance.getResponses(page=i)
    #     return error_based_responses

    def inject_to_form(self, form_attributes, page_entity, vulnUtils):
        non_vulnerable_inputnames = form_attributes[self.inputnames_index]
        i = 0
        while i < self.injection_types_count and non_vulnerable_inputnames != {}:
            non_vulnerable_inputnames = self.inject_to_inputnames(injection_type=self.injection_types[i],
                                                                  non_vulnerable_inputnames=non_vulnerable_inputnames,
                                                                  page_entity=page_entity,
                                                                  form_attributes=form_attributes, vulnUtils=vulnUtils)
            i += 1

    def inject_to_links(self, link, page_entity, vulnUtils):
        all_inputnames = self.get_link_input_names(link)
        non_vulnerable_inputnames = all_inputnames
        i = 0
        while i < self.injection_types_count and non_vulnerable_inputnames != {}:
            non_vulnerable_inputnames = self.inject_to_inputnames(injection_type=self.injection_types[i],
                                                                  non_vulnerable_inputnames=non_vulnerable_inputnames,
                                                                  page_entity=page_entity,
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
            for payload in vulnUtils.getErrorBasedPayloads():
                # TODO: turn error_based_payloads into a list of tuples instead of splitting it every iterations
                splitted_payload = payload.getPayload().split(';;')

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
                vulnUtils.verifyHash(url, page_entity.getPageHash())
                error_result = vulnUtils.get_url_open_results(method, data[self.error_result_index], url)
                regular_imitating_result = vulnUtils.get_url_open_results(method,
                                                                          data[self.regular_imitating_result_index],
                                                                          url)

                if self.validate_error_based(regular_result, error_result, regular_imitating_result, vulnUtils):
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
        return [ParseForms(inputname, inputnames, payload, inputnonames) for payload in splitted_payload]

    def get_link_input_names(self, link):
        inputnames = {}
        if len(urlparse(link).query):
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
        return data

    def link_to_url(self, link):
        urlform = urlparse(link).scheme + "://" + urlparse(link).hostname + urlparse(link).path + urlparse(link).params
        return urlform.encode("utf8")

    def validate_error_based(self, regular_result, error_result, regular_imitating_result, vulnUtils):
        if regular_result[self.hash_index] == regular_imitating_result[self.hash_index] and regular_result[
            self.hash_index] != error_result[self.hash_index]:
            return True
        else:
            diff = self.get_diff_response_content(regular_result[self.response_index],
                                                  error_result[self.response_index],
                                                  regular_imitating_result[self.response_index])
            for response in vulnUtils.getErrorBasedResponses():
                if response.getResponse() in diff:
                    return True
        return False

    def get_diff_response_content(self, response1, response2, response3):
        soup1 = BeautifulSoup(response1, 'html.parser').find_all()
        soup1_contents = [tag.string for tag in soup1]
        soup2 = BeautifulSoup(response2, 'html.parser').find_all()
        soup2_contents = [tag.string for tag in soup2]
        soup3 = BeautifulSoup(response3, 'html.parser').find_all()
        soup3_contents = [tag.string for tag in soup2]
        return str([x for x in soup2_contents if x not in soup1_contents and x not in soup3_contents])
