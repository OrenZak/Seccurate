# import json
# import httplib
# import urllib
#
# #body =("<html><body><h1>Sorry it's not Friday yet</h1> </body></html>")
# payload = {"login": "bee", "password": "bug", "security_level": 0, "form": "submit" }
# hdr = {'User-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 \(KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34'}#{"content-type": "application/json"}
#
# conn = httplib.HTTPConnection('localhost')
# conn.request('POST', '/bWAPP/login.php', urllib.urlencode(payload), hdr)
# #print(conn.request('POST', '/bWAPP/login.php', json.dumps(payload), hdr))
# response = conn.getresponse()
# data = response.read()
# print(response.getheaders())
# print(response.status)
# print(data)

import mechanize
import urllib
import urllib2
#
# method = "POST"
# handler = urllib2.HTTPHandler()
# opener = urllib2.build_opener(handler)
# data = urllib.urlencode({"login": "bee", "password": "bug", "security_level": 0, "form": "submit" })
# request = urllib2.Request(url="http://localhost/bWAPP/login.php", data=data)
# # add any other information you want
# #request.add_header("Content-Type",'application/json')
# # overload the get method function with a small anonymous function...
# request.get_method = lambda: method
# # try it; don't forget to catch the result
# try:
#     connection = opener.open(request)
# except urllib2.HTTPError,e:
#     connection = e
#
# # check. Substitute with appropriate HTTP code.
# #if connection.code == 200:
# data = connection.read()
# print(connection.getcode())
# print(data)
# #else:
#     # handle the error case. connection.read() will still contain data
#     # if any was returned, but it probably won't be of any use
#
#
#
#
# url = "http://127.0.0.1/bWAPP"
# values = {"login": "bee", "password": "bug", "security_level": 0, "form": "submit" }
# data = urllib.urlencode(values)
# headers = {'User-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 \(KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34'}
# req = urllib2.Request(url, data, headers)
# #print(req.get_data())
# response = urllib2.urlopen(req)
# the_page = response.read()
# print(the_page)


creds = {"login": "bee", "password": "bug", "security_level": 0, "form": "submit" }
br = mechanize.Browser()
cookie_jar = mechanize.CookieJar()
br.set_cookiejar(cookie_jar)

# Browser options - have to understand what each of them means
br.set_handle_equiv(True)
br.set_handle_gzip(True)
br.set_handle_redirect(True)
br.set_handle_referer(True)
br.set_handle_robots(False)
br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(),
                           max_time=1)  # Follows refresh 0 but not hangs on refresh > 1
# Want debugging messages?
# br.set_debug_http(True)
# br.set_debug_redirects(True)
# br.set_debug_responses(True)

# User-Agent
br.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/534.34 \(KHTML, like Gecko) Chrome/53.0.2785.113 Safari/534.34')]

br.open("http://localhost/bWAPP/login.php")
br.select_form(nr=0)
a = br.form.controls
for control in a:
    if control.readonly==False:
        print (control.name)
i = 0
found = False
while not found:
    try:
        br.select_form(nr=i)
        for control in br.form.controls:
            if control.name in creds.keys():
                if control.readonly==False:
                    br.form[control.name] = creds[control.name]
            else:
                raise mechanize.FormNotFoundError
        #for attribute in self.__credentialsEntity.getLoginInfo()["form"]:
            #self.br.form[attribute] = self.__credentialsEntity.getLoginInfo()["form"][attribute]
        response=br.submit()
        #print(self.br.request)
        found=True
        print(response.read())
        print ('success')
    except mechanize.FormNotFoundError:
        i += 1
        print ("trying next form")
    except:
        print ("no such form")
        raise Exception("Couldn't find form in login page. Please verify that the supplied login info is correct")
