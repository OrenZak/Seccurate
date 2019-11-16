const ScanConfigBoundary = require('../layout/boundaries/scanConfigBoundary');

let assert = require('assert');
let name = "haha";
let save = true;
let loginInfo = {form: {login: "bee", password: "bug", security: "0", form: "submit"}, formAction: "login.php"};
let url = "http://example/bWAPP/login.php";
let jsonScanConfig = {
    interval: 1000,
    maxConcurrency: 3,
    maxDepth: 5,
    timeout: 10000,
    scanType: 2,
    url: url,
    loginInfo: loginInfo,
    name: name,
    save: save
};

let boundary = new ScanConfigBoundary(1000, 3, 5, 10000, 2, url, loginInfo, name, save);

describe('Test deserialize', function () {
    it('Should create ScanConfigBoundary with correct parameters', function () {
        let scanBoundary = ScanConfigBoundary.deserialize(jsonScanConfig);
        assert.equal(scanBoundary.interval, 1000);
        assert.equal(scanBoundary.maxConcurrency, 3);
        assert.equal(scanBoundary.maxDepth, 5);
        assert.equal(scanBoundary.timeout, 10000);
        assert.equal(scanBoundary.scanType, 2);
        assert.equal(scanBoundary.loginInfo.formAction, loginInfo.formAction);
        assert.equal(scanBoundary.loginInfo.form.login, loginInfo.form.login);
        assert.equal(scanBoundary.loginInfo.form.password, loginInfo.form.password);
        assert.equal(scanBoundary.loginInfo.form.security, loginInfo.form.security);
        assert.equal(scanBoundary.loginInfo.form.form, loginInfo.form.form);
        assert.equal(scanBoundary.loginInfo.form.security, loginInfo.form.security);
        assert.equal(scanBoundary.loginInfo.form.form, loginInfo.form.form);
        assert.equal(scanBoundary.name, name);
        assert.equal(scanBoundary.save, save);
    });
});

describe('Test serialize', function () {
    it('Should serialzie to {interval: 1000, maxConcurrency: 3, maxDepth: 5, timeout: 10000, scanType: 2, url: url, loginInfo: loginInfo, name: name, save: save}', function () {
        var serialize = boundary.serialize();
        assert.equal(boundary.interval, JSON.parse(serialize).interval);
        assert.equal(boundary.maxConcurrency, JSON.parse(serialize).maxConcurrency);
        assert.equal(boundary.maxDepth, JSON.parse(serialize).maxDepth);
        assert.equal(boundary.timeout, JSON.parse(serialize).timeout);
        assert.equal(boundary.scanType, JSON.parse(serialize).scanType);
        assert.equal(boundary.loginInfo.formAction, JSON.parse(serialize).loginInfo.formAction);
        assert.equal(boundary.loginInfo.form.login, JSON.parse(serialize).loginInfo.form.login);
        assert.equal(boundary.loginInfo.form.password, JSON.parse(serialize).loginInfo.form.password);
        assert.equal(boundary.loginInfo.form.security, JSON.parse(serialize).loginInfo.form.security);
        assert.equal(boundary.loginInfo.form.form, JSON.parse(serialize).loginInfo.form.form);
        assert.equal(boundary.name, JSON.parse(serialize).name);
        assert.equal(boundary.save, JSON.parse(serialize).save);
    });
});