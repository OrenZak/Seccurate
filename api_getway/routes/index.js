var express = require("express");
var router = express.Router();


const PATHS = {
    HOME: "/",
    START: "/start",
    CONFIG_SCAN: "/config_scan",
    LOGIN: "/login",
    REGISTER: "/register",
    GET_RESULTS: "/results",
};

router.get(PATHS.HOME, function (req, res, next) {
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.START, function (req, res, next) {
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.CONFIG_SCAN, function (req, res, next) {
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.LOGIN, function (req, res, next) {
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.REGISTER, function (req, res, next) {
    res.status(200).send('<h1>Hello world</h1>');
});

router.post(PATHS.GET_RESULTS, function (req, res, next) {
    res.status(200).send('<h1>Hello world</h1>');
});


// Default error handling
router.use('*', function (req, res, next) {
    res.status(500).send({status: 500, message: 'bad path', type: 'internal'});
});

module.exports = router;
