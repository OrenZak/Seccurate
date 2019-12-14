events = require("events");
var CrawlerPageBoundary = require('./boundaries/crawlerPageBoundary');
var VulnerabilityPageBoundary = require('./boundaries/vulnerabilityPageBoundary');
var pageCRUD = require('../dao/PageCRUD');
var pageEntity = require('../data/PageEntity');


const ACTIONS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    PAGE_FETCHED: "page_fetched",
    CRAWLER_DONE: "crawler_done",
    SCAN_RESULTS: "scan_page",
    SCAN_PAGE_DONE: "scan_page_done"


};

const EVENTS = {
    START_CRAWL: "crawl",
    CONFIG_DATABASE: "config_database",
    GET_RESULTS: "get_results",
    UPDATE_PAYLOADS: "update_payloads",
    SCAN_PAGE: "scan_page"
};


let io = undefined;
let pageQueue = [];
let isCrawlerScanning = false;
let isVulnerabilityScanning = false;
let scanID;

function startCrawl(crawlBoundary, id) {
    scanID = id;
    io.emit(EVENTS.START_CRAWL, crawlBoundary.serialize());
    isCrawlerScanning = true;
    pageQueue = [];
    isVulnerabilityScanning = false;
}

function configDatabase(vulnerabilityConfigBoundary) {
    io.emit(EVENTS.CONFIG_DATABASE, vulnerabilityConfigBoundary.serialize());
}

function getResults(vulnerabilityGetResultsRequestBoundary) {
    io.emit(EVENTS.GET_RESULTS, vulnerabilityGetResultsRequestBoundary);
}

function updatePayloads(payloadBoundary) {
    io.emit(EVENTS.UPDATE_PAYLOADS, payloadBoundary);

}

function scanPage(pageBoundary) {
    io.emit(EVENTS.SCAN_PAGE, pageBoundary.serialize());
}

function start(server) {
    io = require("socket.io")(server);
    io.on(ACTIONS.CONNECTION, async function (socket, next, a) {
        console.log(`SocketIO - connection`);
        socket.on(ACTIONS.DISCONNECT, async function () {
            console.log("socket disconnected");
        });
        socket.on(ACTIONS.PAGE_FETCHED, async function (pageBoundary) {
            console.log("Fetched page ", pageBoundary.url);
            let crawlerPageboundary = CrawlerPageBoundary.deserialize(pageBoundary);
            
            //save url discovered using pageCrud
            page = new pageEntity(crawlerPageboundary.URL)
            p_crud = new pageCRUD('test', scanID)
            p_crud.insertValue(page);
            
            //pass page to vuln service
            let vulnerabilityPageBoundary = new VulnerabilityPageBoundary(crawlerPageboundary.url, crawlerPageboundary.pageHash, crawlerPageboundary.type, crawlerPageboundary.value);
            if (pageQueue.length == 0 && !isVulnerabilityScanning) {
                scanPage(vulnerabilityPageBoundary);
                isVulnerabilityScanning = true
            } else {
                pageQueue.push(vulnerabilityPageBoundary);
            }
        });
        socket.on(ACTIONS.SCAN_RESULTS, async function (results) {
            console.log("received scan results");
            var parsedResults = [];
            results.forEach(element => {
                parsedResults.push(element);
            });
            //TODO send the array somehow
        });
        socket.on(ACTIONS.SCAN_PAGE_DONE, async function (results) {
            if (pageQueue.length > 0) {
                let vulnerabilityPageBoundary = pageQueue.shift();
                isVulnerabilityScanning = true;
                scanPage(vulnerabilityPageBoundary);
            } else {
                isVulnerabilityScanning = false;
            }
        });
        socket.on(ACTIONS.CRAWLER_DONE, async function (results) {
            isCrawlerScanning = false;
        });
    });
}


module.exports = {
    start, configDatabase, startCrawl, updatePayloads, getResults
};
