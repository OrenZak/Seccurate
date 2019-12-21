let express = require("express");
let router = express.Router();
let LogicService = require('../logic/logicService');
let logicService = new LogicService();
let ScanTargetBoundary = require('../layout/boundaries/scanTargetBoundary');
let UpdateScanTargetBoundary = require('../layout/boundaries/updateTargetBoundary');
let StartCrawlBoundary = require('../layout/boundaries/startCrawlBoundary');
let GetScansResponseBoundary = require('../layout/boundaries/getScansResponseBoundary');
let DeleteScanBoundary = require('../layout/boundaries/deleteBoundary');
let GetResultsResponseBoundary = require('../layout/boundaries/getResultsResponseBoundary');

router.use(express.json());
router.use(express.urlencoded({extended: false}));

const PATHS = {
    HOME: "/",
    START_SCAN: "/start_scan",
    CONFIG_TARGET: "/config_target",
    GET_SCANS: "/scans",
    LOGIN: "/login",
    REGISTER: "/register",
    GET_RESULTS: "/results",
    ADD_PAYLOADS: "/add_payload",
    CONFIG_SCAN: "/config_scan"
};

router.get(PATHS.HOME, function (req, res, next) {
    res.status(200).send('<h1>Welcome to Seccurate API Gateway</h1>');
});

router.get(PATHS.GET_SCANS, function (req, res, next) {
    logicService.getScans(req.query.page, req.query.size, (scans) => {
        scansResponseBoundary = new GetScansResponseBoundary(scans);
        res.status(200).send(scansResponseBoundary.serialize());
    });

});

router.post(PATHS.START_SCAN, async function (req, res, next) {
    crawlBoundary = StartCrawlBoundary.deserialize(req.body);
    logicService.startCrawl(crawlBoundary.id);
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.CONFIG_TARGET, async function (req, res, next) {
    scanConfigBoundary = ScanTargetBoundary.deserialize(req.body);
    var result = await logicService.scanConfig(scanConfigBoundary.config.interval, scanConfigBoundary.config.maxConcurrency, scanConfigBoundary.config.maxDepth, scanConfigBoundary.config.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save, scanConfigBoundary.description, scanConfigBoundary.savedScanName);
    res.status(200).send(result);
});

router.put(PATHS.CONFIG_TARGET, async function (req, res, next) {
    scanConfigBoundary = UpdateScanTargetBoundary.deserialize(req.body);
    var result = await logicService.updateScanConfig(scanConfigBoundary.config.interval, scanConfigBoundary.config.maxConcurrency, scanConfigBoundary.config.maxDepth, scanConfigBoundary.config.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save, scanConfigBoundary.description, scanConfigBoundary.scanID, scanConfigBoundary.savedScanName);
    res.status(200).send(result);
});

router.delete(PATHS.CONFIG_TARGET, async function (req, res, next) {
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

router.get(PATHS.GET_RESULTS, function (req, res, next) {
    //getResultsRequestBoundary = GetResultsRequestBoundary.deserialize(req.query);
    logicService.getResults(req.query.scanName, (results) => {
        let resultsArray = [];
        results.forEach(element => {
            elem = JSON.parse(element);
            resultsArray.push({
                description: elem._VulnerabilityBoundary__description,
                name: elem._VulnerabilityBoundary__name,
                payload: elem._VulnerabilityBoundary__payload,
                recommendation: elem._VulnerabilityBoundary__recommendations,
                requestB64: elem._VulnerabilityBoundary__requestB64,
                severity: elem._VulnerabilityBoundary__severity,
                url: elem._VulnerabilityBoundary__url,
                vulnID: elem._VulnerabilityBoundary__vulnID
            })
        });
        res.status(200).send(resultsArray);
    });
});

router.get(PATHS.CONFIG_SCAN, async function (req, res, next) {
    scanConfigBoundary = ScanTargetBoundary.deserialize(req.body);
    var result = await logicService.scanConfig(scanConfigBoundary.config.interval, scanConfigBoundary.config.maxConcurrency, scanConfigBoundary.config.maxDepth, scanConfigBoundary.config.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save, scanConfigBoundary.description, scanConfigBoundary.savedScanName);
    res.status(200).send(result);
});

router.post(PATHS.CONFIG_SCAN, async function (req, res, next) {
    scanConfigBoundary = ScanTargetBoundary.deserialize(req.body);
    var result = await logicService.scanConfig(scanConfigBoundary.config.interval, scanConfigBoundary.config.maxConcurrency, scanConfigBoundary.config.maxDepth, scanConfigBoundary.config.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save, scanConfigBoundary.description, scanConfigBoundary.savedScanName);
    res.status(200).send(result);
});

router.put(PATHS.CONFIG_SCAN, async function (req, res, next) {
    scanConfigBoundary = UpdateScanTargetBoundary.deserialize(req.body);
    var result = await logicService.updateScanConfig(scanConfigBoundary.config.interval, scanConfigBoundary.config.maxConcurrency, scanConfigBoundary.config.maxDepth, scanConfigBoundary.config.timeout, scanConfigBoundary.scanType, scanConfigBoundary.url, scanConfigBoundary.loginInfo, scanConfigBoundary.name, scanConfigBoundary.save, scanConfigBoundary.description, scanConfigBoundary.scanID, scanConfigBoundary.savedScanName);
    res.status(200).send(result);
});

router.delete(PATHS.CONFIG_SCAN, async function (req, res, next) {
    deleteBoundary = DeleteScanBoundary.deserialize(req.body);
    var result = await logicService.deleteScan(deleteBoundary.ID);
    res.status(200).send(result);
});

function setServer(httpServer) {
    logicService.startSocketListen(httpServer);

}


// Default error handling
router.use('*', function (req, res, next) {
    res.status(500).send({status: 500, message: 'bad path', type: 'internal'});
});

module.exports = {router, setServer};
