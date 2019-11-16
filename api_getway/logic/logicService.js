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

    async scanConfig(interval, maxConcurrency, maxDepth, timeout, scanType, url, loginInfo, name, save) {
        let configEntity = new ConfigEntity (null, maxDepth, timeout, interval, maxConcurrency, scanType, loginInfo, url);
        let configHistoryValue = this.configurationHistoryDao.insertValue(configEntity);
        if (save) {
            let savedConfigDao = new SavedConfigurarionDao(dbName);
            let savedConfigEntity = new SavedConfigEntity(null, maxDepth, timeout, interval, maxConcurrency);
            savedConfigDao.insertValue(savedConfigEntity);
        }
        let scansDao = new ScansDao(dbName);
        let scanEntity = new ScanEntity(name, Date.now(), configHistoryValue.getID());
        scansDao.insertValue(scanEntity);
        return configHistoryValue.getID();
    }

    async startCrawl(id) {
        this.configurationHistoryDao.getValue(id, (err, value) => {
            if (err) {
                console.log(err);
            }
            else {
                let crawlerConfigBoundary = new CrawlerConfigScanBoundary(value.getInterval(), value.getMaxConcurrency(), value.getMaxDepth(), value.getTimeout(), value.getVulnsScanned(), value.getLoginPage(), value.getCredentials());
                let vulnerabilityConfigBoundary = new VulnerabilityConfigScanBoundary(value.getID(), value.getVulnsScanned());
                socketManager.startCrawl(crawlerConfigBoundary);
                // INIT vulnerability micro service scan configuration
                socketManager.configDatabase(vulnerabilityConfigBoundary);
            }
        });
    }

    async getResults(scanName) {
        var vulnerabilityGetResultsRequestBoundary = VulnerabilityGetResultsRequestBoundary(scanName);
        socketManager.getResults(vulnerabilityGetResultsRequestBoundary);
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