let express = require("express");
let router = express.Router();
let LogicService = require('../logic/logicService');
let logicService = new LogicService();
let ScanConfigBoundary = require('../layout/boundaries/scanConfigBoundary');
let UpdateScanConfigBoundary = require('../layout/boundaries/updateScanConfigBoundary');
let StartCrawlBoundary = require('../layout/boundaries/startCrawlBoundary');
let DeleteScanBoundary = require('../layout/boundaries/deleteScanBoundary');
let GetResultsRequestBoundary = require('../layout/boundaries/getResultsRequestBoundary');

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
    crawlBoundary = StartCrawlBoundary.deserialize(req.body);
    logicService.startCrawl(crawlBoundary.id);
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.CONFIG_SCAN, async function (req, res, next) {
    scanConfigBoundary = ScanConfigBoundary.deserialize(req.body);
    var result = await logicService.scanConfig(scanConfigBoundary.config.interval, scanConfigBoundary.config.maxConcurrency, scanConfigBoundary.config.maxDepth, scanConfigBoundary.config.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save, scanConfigBoundary.description);
    res.status(200).send(result);
});

router.put(PATHS.CONFIG_SCAN, async function (req, res, next) {
    scanConfigBoundary = UpdateScanConfigBoundary.deserialize(req.body);
    var result = await logicService.updateScanConfig(scanConfigBoundary.config.interval, scanConfigBoundary.config.maxConcurrency, scanConfigBoundary.config.maxDepth, scanConfigBoundary.config.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save, scanConfigBoundary.description,scanConfigBoundary.scanID);
    res.status(200).send(result);
});

router.delete(PATHS.CONFIG_SCAN, async function (req, res, next) {
    deleteBoundary = DeleteScanBoundary.deserialize(req.body);
    var result = await logicService.deleteScan(deleteBoundary.ID);
    res.status(200).send(result);
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
    scanResults = logicService.getResults(getResultsRequestBoundary.scanName);
    // TODO this needs to be parse
    res.status(200).send(scanResults);
});

function setServer(httpServer) {
    logicService.startSocketListen(httpServer);

}


// Default error handling
router.use('*', function (req, res, next) {
    res.status(500).send({status: 500, message: 'bad path', type: 'internal'});
});

module.exports = {router, setServer};
