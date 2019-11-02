events = require("events");

const ACTIONS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    PAGE_FETCHED: "page_fetched",
    CRAWLER_DONE: "crawler_done",
    SCAN_RESULTS: "scan_results"


};

const EVENTS = {
    START_CRAWL: "crawl",
    CONFIG_DATABASE: "config_database",
    GET_RESULTS: "get_results",
    UPDATE_PAYLOADS: "update_payloads"
};

function startCrawl(urlBoundary) {
    io.emit(EVENTS.START_CRAWL, urlBoundary.serialize());
}

function configDatabase(configDbBoundary) {
    io.emit(EVENTS.CONFIG_DATABASE, configDbBoundary.serialize());
}

function getResults() {
    io.emit(EVENTS.GET_RESULTS);
}

function updatePayloads(payloadBoundary) {
    io.emit(EVENTS.UPDATE_PAYLOADS, payloadBoundary);

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
        });
        socket.on(ACTIONS.PAGE_FETCHED, async function () {
            console.log("crawler done his job");
        });
        socket.on(ACTIONS.SCAN_RESULTS, async function (scanResultsBoundary) {
            console.log("received scan results");
        });
    });
}


module.exports = {
    start, configDatabase, startCrawl, updatePayloads, getResults
};
