const CrawlerScanConfigBoundary = require('../logic/boundaries/crawlerConfigScanBoundary');

let assert = require('assert');
let name = "haha";
let save = true;
let loginInfo = {form: {login: "bee", password: "bug", security: "0", form: "submit"}, formAction: "login.php"};
let url = "http://example/bWAPP/login.php";
let config = {interval: 1000,maxConcurrency: 3,maxDepth: 5,timeout: 10000};
let jsonScanConfig = {
    config:{interval: 1000,maxConcurrency: 3,maxDepth: 5,timeout: 10000},
    scanType: 2,
    url: url,
    loginInfo: loginInfo,
    name: name,
    save: save
};

let boundary = new CrawlerScanConfigBoundary(config, 2, url, loginInfo);

describe('Test deserialize', function () {
    it('Should create CrawlerScanConfigBoundary with correct parameters', function () {
        let scanBoundary = CrawlerScanConfigBoundary.deserialize(jsonScanConfig);
        assert.equal(scanBoundary.config.interval, config.interval);
        assert.equal(scanBoundary.config.maxConcurrency, config.maxConcurrency);
        assert.equal(scanBoundary.config.maxDepth, config.maxDepth);
        assert.equal(scanBoundary.config.timeout, config.timeout);
        assert.equal(scanBoundary.scanType, 2);
        assert.equal(scanBoundary.loginInfo.formAction, loginInfo.formAction);
        assert.equal(scanBoundary.loginInfo.form.login, loginInfo.form.login);
        assert.equal(scanBoundary.loginInfo.form.password, loginInfo.form.password);
        assert.equal(scanBoundary.loginInfo.form.security, loginInfo.form.security);
        assert.equal(scanBoundary.loginInfo.form.form, loginInfo.form.form);
        assert.equal(scanBoundary.loginInfo.form.security, loginInfo.form.security);
        assert.equal(scanBoundary.loginInfo.form.form, loginInfo.form.form);
    });
});

describe('Test serialize', function () {
    it('Should serialzie to {interval: 1000, maxConcurrency: 3, maxDepth: 5, timeout: 10000, scanType: 2, url: url, loginInfo: loginInfo}', function () {
        let serialize = boundary.serialize();
        assert.equal(boundary.config.interval, serialize.config.interval);
        assert.equal(boundary.config.maxConcurrency, serialize.config.maxConcurrency);
        assert.equal(boundary.config.maxDepth, serialize.config.maxDepth);
        assert.equal(boundary.config.timeout, serialize.config.timeout);
        assert.equal(boundary.scanType, serialize.scanType);
        assert.equal(boundary.loginInfo.formAction, serialize.loginInfo.formAction);
        assert.equal(boundary.loginInfo.form.login, serialize.loginInfo.form.login);
        assert.equal(boundary.loginInfo.form.password, serialize.loginInfo.form.password);
        assert.equal(boundary.loginInfo.form.security, serialize.loginInfo.form.security);
        assert.equal(boundary.loginInfo.form.form, serialize.loginInfo.form.form);
    });
});