var express = require("express");
var router = express.Router();
var LogicService = require('../logic/logicService');
var logicService = new LogicService();
var ScanConfigBoundary = require('../layout/boundaries/scanConfigBoundary');
var StartCrawlBoundary = require('../layout/boundaries/startCrawlBoundary');
var GetResultsRequestBoundary = require('../layout/boundaries/getResultsRequestBoundary');

router.use(express.json());
router.use(express.urlencoded({extended: false}));

const PATHS = {
    HOME: "/",
    START_SCAN: "/start_scan",
    CONFIG_SCAN: "/config_scan",
    LOGIN: "/login",
    REGISTER: "/register",
    GET_RESULTS: "/results",
    ADD_PAYLOADS: "/add_payload",
};

router.get(PATHS.HOME, function (req, res, next) {
    res.status(200).send('<h1>Welcome to Seccurate API Gateway</h1>');
});

router.post(PATHS.START_SCAN, async function (req, res, next) {
    crawlBoundary = StartCrawlBoundary.deserialize(req.query);
    logicService.startCrawl(crawlBoundary);
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.CONFIG_SCAN, async function (req, res, next) {
    scanConfigBoundary = ScanConfigBoundary.deserialize(req.body);
    var result = await logicService.scanConfig(scanConfigBoundary.interval, scanConfigBoundary.maxConcurrency, scanConfigBoundary.maxDepth, scanConfigBoundary.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save);
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.LOGIN, function (req, res, next) {
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.REGISTER, function (req, res, next) {
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.ADD_PAYLOADS, function (req, res, next) {
    logicService.addPayload(req.query);
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.GET_RESULTS, function (req, res, next) {
    getResultsRequestBoundary = GetResultsRequestBoundary.deserialize(req.query);
    logicService.getResults(getResultsRequestBoundary.scanName);
    res.status(200).send('<h1>Hello world</h1>');
});

function setServer(httpServer) {
    logicService.startSocketListen(httpServer);

}


// Default error handling
router.use('*', function (req, res, next) {
    res.status(500).send({status: 500, message: 'bad path', type: 'internal'});
});

module.exports = {router, setServer};
