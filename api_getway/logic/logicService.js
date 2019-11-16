const https = require('https');
const request = require('request');
const globals = require('../common/globals');
var socketManager = require('./socketManager');
var CrawlerConfigScanBoundary = require('./boundaries/crawlerConfigScanBoundary');
var VulnerabilityConfigScanBoundary = require('./boundaries/vulnerabilityConfigBoundary');
var VulnerabilityGetResultsRequestBoundary = require('./boundaries/vulnerabilityGetResultsRequestBoundary');

class LogicService {
    constructor(server) {
        console.log('created');

    }

    startSocketListen(server) {
        socketManager.start(server);
    }

    async scanConfig(interval, maxConcurrency, maxDepth, timeout, scanType) {
        // TODO save new raw info in the db
        let dbName = "";
        let crawlerConfigBoundary = new CrawlerConfigScanBoundary(interval, maxConcurrency, maxDepth, timeout);
        let vulnerabilityConfigBoundary = new VulnerabilityConfigScanBoundary(dbName, scanType);
        // INIT crawler micro service scan configuration
        request.post(`${globals.CRAWLER_MICROSERVICE}/scan_config`, crawlerConfigBoundary.serialize(), function (err, httpResponse, body) {
            //console.log(`statusCode: ${httpResponse.status}`);
            console.log(err, body, httpResponse);
        });
        // INIT vulnerability micro service scan configuration
        socketManager.configDatabase(vulnerabilityConfigBoundary);

    }

    async startCrawl(crawlBoundary) {
        socketManager.startCrawl(crawlBoundary)
        // TODO - do we need to save it somehow ? talk with guy
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