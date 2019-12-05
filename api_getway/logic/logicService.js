import {VULNERABILITY_MICROSERVICE_REST} from "../common/globals";

const https = require('https');
const request = require('request');
const globals = require('../common/globals');
var socketManager = require('./socketManager');
var CrawlerConfigScanBoundary = require('./boundaries/crawlerConfigScanBoundary');
var VulnerabilityConfigScanBoundary = require('./boundaries/vulnerabilityConfigBoundary');
var VulnerabilityGetResultsRequestBoundary = require('./boundaries/vulnerabilityGetResultsRequestBoundary');
var ConfigurationHistoryDao = require('../dao/scanConfigurationCRUD');
var SavedConfigurarionDao = require('../dao/savedScanConfigurationCRUD')
var ScansDao = require('../dao/scansCRUD');
var ConfigEntity = require('../data/ConfigurationEntity');
var SavedConfigEntity = require('../data/SavedConfigurationEntity')
var ScanEntity = require('../data/scanEntity');

class LogicService {
    constructor(server) {
        this.configurationHistoryDao = new ConfigurationHistoryDao("test");
        console.log('created');

    }

    startSocketListen(server) {
        socketManager.start(server);
    }

    async scanConfig(interval, maxConcurrency, maxDepth, timeout, scanType, url, loginInfo, name, save, description) {
        let dbName = 'test';
        let configEntity = new ConfigEntity(null, maxDepth, timeout, interval, maxConcurrency, scanType, JSON.stringify(loginInfo), url);
        let configHistoryValue = this.configurationHistoryDao.insertValue(configEntity);
        if (save) {
            let savedConfigDao = new SavedConfigurarionDao(dbName);
            let savedConfigEntity = new SavedConfigEntity(null, maxDepth, timeout, interval, maxConcurrency);
            savedConfigDao.insertValue(savedConfigEntity);
        }
        let scansDao = new ScansDao(dbName);
        let scanEntity = new ScanEntity(name, Date.now(), configHistoryValue.getID(), description);
        scansDao.insertValue(scanEntity);
        return configHistoryValue.getID();
    }

    async startCrawl(id) {
        this.configurationHistoryDao.getValue(id, (err, value) => {
            if (err) {
                console.log(err);
            } else {
                let config = {
                    interval: value[0]["interval_crawler"],
                    maxConcurrency: value[0]["maxConcurrency"],
                    maxDepth: value[0]["maxDepth"],
                    timeout: value[0]["timeout"]
                };
                let crawlerConfigBoundary = new CrawlerConfigScanBoundary(config, value[0]["vulnsScanned"], value[0]["loginPage"], JSON.parse(value[0]["credentials"]));
                let vulnerabilityConfigBoundary = new VulnerabilityConfigScanBoundary(value[0]["id"], value[0]["vulnsScanned"]);
                socketManager.startCrawl(crawlerConfigBoundary);
                // INIT vulnerability micro service scan configuration
                socketManager.configDatabase(vulnerabilityConfigBoundary);
            }
        });
    }

    async getResults(scanName) {
        let vulnerabilityGetResultsRequestBoundary = VulnerabilityGetResultsRequestBoundary(scanName);
        request.post(VULNERABILITY_MICROSERVICE_REST, {
            json: {
                scanName: vulnerabilityGetResultsRequestBoundary.ScanName
            }
        }, (error, res, body) => {
            if (error) {
                console.error(error);
                return error;
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body);
            return body;
        });
    }

    async addPayload(data) {
        var payloadBoundary = "";
        socketManager.updatePayloads(payloadBoundary);

    }

    async login() {

    }

    async register() {

    }

}

module.exports = LogicService;