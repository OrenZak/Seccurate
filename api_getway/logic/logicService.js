const https = require('https')
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
        let crawlerConfigBoundary = CrawlerConfigScanBoundary(interval, maxConcurrency, maxDepth, timeout);
        let vulnerabilityConfigBoundary = VulnerabilityConfigScanBoundary(dbName, scanType);
        // INIT crawler micro service scan configuration
        let options = {
            hostname: globals.CRAWLER_MICROSERVICE.split(':')[0],
            port: globals.CRAWLER_MICROSERVICE.split(':')[1],
            path: '/start_config',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': scanConfigBoundary.serialize().length
            }
        };
        let reqToCrawler = https.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);

            res.on('data', (d) => {
                console.log(d);
            })
        });
        reqToCrawler.write(crawlerConfigBoundary.serialize());
        reqToCrawler.end();
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