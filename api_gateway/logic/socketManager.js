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
    NEXT_PAGE: "next_page",
    SECOND_ORDER_COMPLETED: "second_order_completed"
};

const EVENTS = {
    START_CRAWL: "crawl",
    CONFIG_DATABASE: "config_database",
    GET_RESULTS: "get_results",
    UPDATE_PAYLOADS: "update_payloads",
    SCAN_PAGE: "scan_page",
    CRAWLER_COMPLETED: "crawler_completed",
    START_SECOND_ORDER_SCAN: "start_second_order_scan",
    SCAN_COMPLETE: "scan_completed"
};


let io = undefined;
let pageQueue = [];
let scanType;
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
    scanType = vulnerabilityConfigBoundary.scanType;
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

function start(server, scanDoneCallback) {
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
            page = new pageEntity(crawlerPageboundary.URL);
            p_crud = new pageCRUD('test', scanID);
            p_crud.insertValue(page);

            //pass page to vuln service
            let vulnerabilityPageBoundary = new VulnerabilityPageBoundary(crawlerPageboundary.url);
            if (pageQueue.length == 0 && !isVulnerabilityScanning) {
                scanPage(vulnerabilityPageBoundary);
                isVulnerabilityScanning = true
            } else {
                pageQueue.push(vulnerabilityPageBoundary);
            }
        });
        socket.on(ACTIONS.NEXT_PAGE, async function (results) {
            if (pageQueue.length > 0) {
                let vulnerabilityPageBoundary = pageQueue.shift();
                isVulnerabilityScanning = true;
                scanPage(vulnerabilityPageBoundary);
            } else {
                if(isCrawlerScanning) {
                    isVulnerabilityScanning = false;
                }
                else {
                    if(scanType === 'RXSS') {
                        io.emit(EVENTS.SCAN_COMPLETE);
                        scanDoneCallback();
                    } else {
                        io.emit(EVENTS.START_SECOND_ORDER_SCAN)
                    }
                }
            }
        });
        socket.on(ACTIONS.SECOND_ORDER_COMPLETED, async function () {
            io.emit(EVENTS.SCAN_COMPLETE);
            scanDoneCallback();
        });
        socket.on(ACTIONS.CRAWLER_DONE, async function (results) {
            console.log("CRAWLER_DONE");
            io.emit(EVENTS.CRAWLER_COMPLETED);
            isCrawlerScanning = false;
            if(!isCrawlerScanning && !isVulnerabilityScanning && pageQueue.length == 0) {
                if(scanType === 'RXSS') {
                    io.emit(EVENTS.SCAN_COMPLETE);
                    scanDoneCallback();
                } else {
                    io.emit(EVENTS.START_SECOND_ORDER_SCAN)
                }
            }
        });
    });
}


module.exports = {
    start, configDatabase, startCrawl, updatePayloads, getResults
};
