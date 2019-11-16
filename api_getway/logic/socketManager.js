events = require("events");
var CrawlerPageBoundary = require('./boundaries/crawlerPageBoundary');
var VulnerabilityPageBoundary = require('./boundaries/vulnerabilityPageBoundary');


const ACTIONS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    PAGE_FETCHED: "page_fetched",
    CRAWLER_DONE: "crawler_done",
    SCAN_RESULTS: "scan_page"


};

const EVENTS = {
    START_CRAWL: "crawl",
    CONFIG_DATABASE: "config_database",
    GET_RESULTS: "get_results",
    UPDATE_PAYLOADS: "update_payloads",
    SCAN_PAGE: "scan_page"
};

let io = undefined;

function startCrawl(crawlBoundary) {
    io.emit(EVENTS.START_CRAWL, crawlBoundary.serialize());
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
            console.log("received page");
            //TODO should we save the page in a db
            crawlerPageboundary = CrawlerPageBoundary.deserialize(pageBoundary);
            vulnerabilityPageBoundary = new VulnerabilityPageBoundary(crawlerPageboundary.url, crawlerPageboundary.pageHash, crawlerPageboundary.type, crawlerPageboundary.value);
            scanPage(vulnerabilityPageBoundary);
        });
        socket.on(ACTIONS.SCAN_RESULTS, async function (results) {
            console.log("received scan results");
            var parsedResults = [];
            results.forEach(element => {
                parsedResults.push(element);
            });
            //TODO send the array somehow
        });
    });
}


module.exports = {
    start, configDatabase, startCrawl, updatePayloads, getResults
};
