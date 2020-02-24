import json
import VulnerabilityDescriptionCRUD
from VulnerabilityDescriptionObject import VulnerabilityDescriptionEntity
import RXSSCrud
import SQLICrud
from PayloadObjects import *
from ResponseObject import ResponseEntity


if __name__ == "__main__":
    VulnerabilityDescriptionCRUD.createTable("test")
    RXSSCrud.createTable("test")
    SQLICrud.createSQLITable("test")
    with open("DBData.json", "r") as readFile:
        data = json.load(readFile)
    for vuln in data['Vulnerability Descriptions']:
        vulnObject = VulnerabilityDescriptionEntity(name=str(vuln['name']), severity=str(vuln['severity']),
                                                    description=str(vuln['description']),
                                                    recommendations=str(vuln['recommendations']))
        VulnerabilityDescriptionCRUD.createVulnerabilityDescription(vulnObject, "test")
    for payload in data["SQLI Payloads"]:
        payloadObject = SQLIPayloadEntity(payload=str(payload['payload']), type=str(payload['type']))
        SQLICrud.createPayload(payloadObject, "test")
    for payload in data["Responses"]:
        response = ResponseEntity(response=str(payload['response']))
        SQLICrud.createResponse(response, "test")
    for payload in data["RXSS Payloads"]:
        rxss = RXSSPayloadEntity(payload=str(payload['payload']), expectedResult=str(payload['expectedResult']))
        RXSSCrud.createPayload(rxss, "test")


