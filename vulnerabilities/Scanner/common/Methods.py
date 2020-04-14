import urllib
import copy


# this function gets forms list and the relevant url
# the function return all input types and parameters from the form
def GetFormInputFields(url, form):
    inputnames = {}
    inputnonames = []
    # print form.attrs['action']
    # self.urlform = urljoin(url, form.attrs['action'])
    try:
        method = form.attrs['method']
    except:
        method = "GET"
    ####### Handle input element #######
    inputs = form.findAll(name='input')
    for input in inputs:
        if input.has_attr('name'):
            if input.has_attr('value'):
                # print type(str(input.attrs['value']))
                inputnames[input.attrs['name']] = input.attrs['value']
            # print urllib.quote(input.attrs['value'], safe='')
            elif input.has_attr('list'):
                datalist = form.find('datalist', {'id': input['list']})
                if datalist:
                    option = datalist.find('option')
                    if option.has_attr('value'):
                        inputnames[input.attrs['name']] = option.attrs['value']
                    else:
                        inputnames[input.attrs['name']] = ""
                else:
                    inputnames[input.attrs['name']] = ""
            else:
                inputnames[input.attrs['name']] = ""
        elif input.has_attr('value'):
            inputnonames.append(input.attrs['value'])
    ######## Handle select element #########
    selects = form.findAll(name='select')
    for select in selects:
        if select.has_attr('name'):
            options = select.findAll(name='option')
            if len(options) > 0:
                if options[0].has_attr('value'):
                    inputnames[select.attrs['name']] = options[0].attrs['value']
                else:
                    inputnames[select.attrs['name']] = ""

    # for option in options:
    # print option.attrs['value']
    ######## Handle Textarea element #########
    textareas = form.findAll(name='textarea')
    for textarea in textareas:
        if textarea.has_attr('name'):
            inputnames[textarea.attrs['name']] = textarea.text
    ####### Handle button element #######
    buttons = form.findAll(name='button')
    for button in buttons:
        if button.has_attr('name'):
            if button.has_attr('value'):
                inputnames[button.attrs['name']] = button.attrs['value']
    return (method, inputnames, inputnonames)


# this function gets relevant data and return the body of the relevant request from the form
def ParseForms(inputname, inputnames, payload, inputnonames):
    deepCopyInputNames = copy.deepcopy(inputnames)
    deepCopyInputNames[inputname] = payload
    for name in deepCopyInputNames:
        if name == inputname:
            continue
        if not deepCopyInputNames[name]:
            deepCopyInputNames[name] = "1"
    a = []
    for k in deepCopyInputNames:
        a.append(k + '=' + deepCopyInputNames[k])
    data = '&'.join(a)
    #data = urllib.urlencode(deepCopyInputNames)
    removefirstchar = len(data) == 0
    for inputnoname in inputnonames:
        data = data + "&" + inputnoname
    if removefirstchar:
        data = data[1::]
    return data


def ParseFormsSQLI(inputname, inputnames, payload, inputnonames):
    originalvalue = inputnames[inputname]
    inputnames[inputname] = payload
    data = urllib.urlencode(inputnames)
    removefirstchar = len(data) == 0
    for inputnoname in inputnonames:
        data = data + "&" + inputnoname
    if removefirstchar:
        data = data[1::]
    # print "[*] Url: " + self.urlform
    # print "[*] Data: " + data.encode('utf-8') + "\n\n"
    # exit()
    inputnames[inputname] = originalvalue
    return data


##this function gets a list of urls and create a list of Page Entities
def parseURLs(self, url_list):
    return
