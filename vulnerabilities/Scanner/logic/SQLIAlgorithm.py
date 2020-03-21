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
        self.get_configuration_properties()

    def get_configuration_properties(self):
        self.config = ConfigParser.RawConfigParser()
        self.config.read('../common/config.properties')

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
        self.time_based = self.config.get('SQLITypes', 'time_based')
        self.second_order = self.config.get('SQLITypes', 'second_order')

    def start_scan(self, pageEntity, forms, links, vulnUtils):
        for link in links:
            self.inject_to_links(link, pageEntity, vulnUtils)
        for form in forms:
            self.inject_to_form(forms[form], pageEntity, vulnUtils)

    def inject_to_form(self, form_attributes, page_entity, vulnUtils):
        non_vulnerable_inputnames = form_attributes[self.inputnames_index]
        i = 0
        #print("there are " + str(self.injection_types_count) + " types of injections")
        injection_types = self.filter_out_second_order_type()
        while i < self.injection_types_count - 1 and non_vulnerable_inputnames != {}:
            non_vulnerable_inputnames = self.inject_to_inputnames(injection_type=injection_types[i],
                                                                  non_vulnerable_inputnames=non_vulnerable_inputnames,
                                                                  page_entity=page_entity,
                                                                  form_attributes=form_attributes, vulnUtils=vulnUtils)
            print ("in inject to form => there are " + str(len(non_vulnerable_inputnames)) + " non_vulnerable_inputnames after round " + str(i))
            i += 1

    def inject_to_links(self, link, page_entity, vulnUtils):
        all_inputnames = self.get_link_input_names(link)
        non_vulnerable_inputnames = all_inputnames
        i = 0
        injection_types = self.filter_out_second_order_type()
        while i < self.injection_types_count - 1 and non_vulnerable_inputnames != {}:
            non_vulnerable_inputnames = self.inject_to_inputnames(injection_type=injection_types[i],
                                                                  non_vulnerable_inputnames=non_vulnerable_inputnames,
                                                                  page_entity=page_entity,
                                                                  link_attributes=all_inputnames, vulnUtils=vulnUtils)
            i += 1

    def filter_out_second_order_type(self):
        return filter(lambda injection_type: injection_type != self.second_order, self.injection_types)

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
        elif injection_type == self.time_based:
            if form_attributes:
                return self.handle_time_based(non_vulnerable_inputnames=non_vulnerable_inputnames,
                                              page_entity=page_entity, form_attributes=form_attributes,
                                              vulnUtils=vulnUtils)
            elif link_attributes:
                return self.handle_time_based(non_vulnerable_inputnames=non_vulnerable_inputnames,
                                              page_entity=page_entity, link_attributes=link_attributes,
                                              vulnUtils=vulnUtils)

    def get_pages_results(self, pages, vulnUtils):
        results = []
        for page in pages:
            results.append(vulnUtils.get_url_open_results(method='get', data='', url=page.getURL()))
        return results

    def start_second_order_scan(self, pages, vulnUtils):
        # TODO: run on all pages, get inject_p do injected, check all other pages if were changed
        print("@2nd start_second_order_scan")
        payloads = vulnUtils.getSecondOrderPayloads()
        for payload in payloads:
            print("Payload: " + payload.getPayload())
            splitted_payload = payload.getPayload().split(';;')
            for page in pages:
                pageEntity = page[0]
                sessionEntity = page[1]
                url = pageEntity.getURL()
                forms, links = vulnUtils.get_injection_points(pageEntity=pageEntity, sessionEntity=sessionEntity)
                # Create filtered list without the current running page.
                otherPages = map(lambda a_page: a_page[0], filter(lambda a_page: a_page != page, pages))

                # Inject to all forms
                for form in forms:
                    for inputName in forms[form][self.inputnames_index]:
                        method = forms[form][self.method_index]
                        data = self.get_form_data_with_payload(inputname=inputName,
                                                               inputnames=forms[form][self.inputnames_index],
                                                               inputnonames=forms[form][self.inputnonames_index],
                                                               payload_list=splitted_payload)

                        vulnUtils.get_url_open_results(method, data[self.regular_result_index], url)
                        otherPages_regular_results = self.get_pages_results(pages=otherPages, vulnUtils=vulnUtils)

                        error_result = vulnUtils.get_url_open_results(method, data[self.error_result_index], url)
                        otherPages_error_results = self.get_pages_results(pages=otherPages, vulnUtils=vulnUtils)

                        vulnUtils.get_url_open_results(method, data[self.regular_imitating_result_index], url)
                        otherPages_imitating_results = self.get_pages_results(pages=otherPages, vulnUtils=vulnUtils)

                        vulnerable = False
                        for index in range(len(otherPages)):
                            if self.validate_error_based(otherPages_regular_results[index],
                                                         otherPages_error_results[index],
                                                         otherPages_imitating_results[index], vulnUtils):
                                vulnerable = True
                                break

                        if vulnerable:
                            self.event = "SQLI - 2nd Order Detected in :" + inputName
                            print(self.event)
                            vulnUtils.add_event(name='second_order', url=url, payload=payload.getPayload(),
                                                requestB64=error_result[self.requestb64_index])

                # Inject to all links
                for link in links:
                    all_inputnames = self.get_link_input_names(link)
                    for inputName in all_inputnames:
                        method = "get"
                        data = self.get_link_data_with_payload(inputname=inputName,
                                                               inputnames=forms[form][self.inputnames_index],
                                                               payload_list=splitted_payload)

                        vulnUtils.get_url_open_results(method, data[self.regular_result_index], url)
                        otherPages_regular_results = self.get_pages_results(pages=otherPages, vulnUtils=vulnUtils)

                        error_result = vulnUtils.get_url_open_results(method, data[self.error_result_index], url)
                        otherPages_error_results = self.get_pages_results(pages=otherPages, vulnUtils=vulnUtils)

                        vulnUtils.get_url_open_results(method, data[self.regular_imitating_result_index], url)
                        otherPages_imitating_results = self.get_pages_results(pages=otherPages, vulnUtils=vulnUtils)

                        vulnerable = False
                        for index in range(len(otherPages)):
                            if self.validate_error_based(otherPages_regular_results[index],
                                                         otherPages_error_results[index],
                                                         otherPages_imitating_results[index], vulnUtils):
                                vulnerable = True
                                break

                        if vulnerable:
                            self.event = "SQLI - 2nd Order Detected in :" + inputName
                            print(self.event)
                            vulnUtils.add_event(name='second_order', url=url, payload=payload.getPayload(),
                                                requestB64=error_result[self.requestb64_index])



    def handle_error_based(self, non_vulnerable_inputnames, page_entity, form_attributes=None, link_attributes=None,
                           vulnUtils=None):
        url = page_entity.getURL()
        final_non_vulnerable_input_names = []
        for inputname in non_vulnerable_inputnames:
            vulnerable = False
            for payload in vulnUtils.getErrorBasedPayloads():
                print("there are payloads")
                # TODO: turn error_based_payloads into a list of tuples instead of splitting it every iteration
                splitted_payload = payload.getPayload().split(';;')

                if form_attributes:
                    method = form_attributes[self.method_index]
                    data = self.get_form_data_with_payload(inputname=inputname,
                                                           inputnames=form_attributes[self.inputnames_index],
                                                           inputnonames=form_attributes[self.inputnonames_index],
                                                           payload_list=splitted_payload)
                else:  # links
                    method = "get"
                    data = self.get_link_data_with_payload(inputname=inputname, inputnames=link_attributes,
                                                           payload_list=splitted_payload)

                regular_result = vulnUtils.get_url_open_results(method, data[self.regular_result_index], url)
                error_result = vulnUtils.get_url_open_results(method, data[self.error_result_index], url)
                regular_imitating_result = vulnUtils.get_url_open_results(method,
                                                                          data[self.regular_imitating_result_index],
                                                                          url)
                vulnUtils.compareHashes(url, page_entity.getPageHash())

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

    def handle_time_based(self, non_vulnerable_inputnames, page_entity, form_attributes=None, link_attributes=None,
                          vulnUtils=None):
        url = page_entity.getURL()
        final_non_vulnerable_input_names = []
        for inputname in non_vulnerable_inputnames:
            vulnerable = False
            for payload in vulnUtils.getTimeBasedPayloads():
                print("there are payloads in timebased")
                payload_string = payload.getPayload().split(';;')[1]
                time = float(payload.getPayload().split(';;')[0])

                if form_attributes:
                    method = form_attributes[self.method_index]
                    data = self.get_form_data_with_payload(inputname=inputname,
                                                           inputnames=form_attributes[self.inputnames_index],
                                                           inputnonames=form_attributes[self.inputnonames_index],
                                                           payload_list=[payload_string])
                else:  # links
                    method = "get"
                    data = self.get_link_data_with_payload(inputname=inputname, inputnames=link_attributes,
                                                           payload_list=[payload_string])

                result = vulnUtils.get_url_open_results(method=method, data=data[0], url=url)

                if self.validate_time_based(result=result, time=time, vulnUtils=vulnUtils, url=url):
                    self.event = "SQLI Detected in :" + inputname
                    print(self.event)
                    vulnUtils.add_event(name=payload.getType(), url=url, payload=payload_string,
                                        requestB64=result[self.requestb64_index])
                    vulnerable = True
                    break
                else:
                    print (inputname + " not vulnerable to payload " + payload_string)  # non_vulnerable_inputnames.append(inputname)
            if not vulnerable:
                final_non_vulnerable_input_names.append(inputname)
        return final_non_vulnerable_input_names

    def get_form_data_with_payload(self, inputname, inputnames, inputnonames, payload_list):
        return [ParseForms(inputname, inputnames, payload, inputnonames) for payload in payload_list]

    def get_link_input_names(self, link):
        inputnames = {}
        if len(urlparse(link).query):
            for parameter in urlparse(link).query.split('&'):
                if len(parameter.split('=')) >= 2:
                    inputnames[parameter.split('=')[0]] = parameter.split('=')[1]
                elif len(parameter.split('=')) == 1:
                    inputnames[parameter.split('=')[0]] = ''
        return inputnames

    def get_link_data_with_payload(self, inputname, inputnames, payload_list):
        data = []
        for payload in payload_list:
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

    def validate_time_based(self, result, time, vulnUtils, url):
        if time <= result[self.time_index]:
            return True
        else:
            #get the content of the regular page
            regular_page_response = vulnUtils.get_url_open_results("get", "", url)
            diff = self.get_diff_response_content(result[self.response_index],
                                                  regular_page_response[self.response_index],
                                                  result[self.response_index])
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
