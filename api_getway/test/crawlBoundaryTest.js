const CrawlBoundaryBoundary = require('../layout/boundaries/startCrawlBoundary');

var assert = require('assert');
var loginInfo = {form: {login: "bee", password: "bug", security: "0", form: "submit"}, formAction: "login.php"};
var jsonCrawl = '{"url": "http://example/bWAPP/login.php","loginInfo": {"form": {"login": "bee","password": "bug","security": 0,"form": "submit"},"formAction": "login.php"}}';
var boundary = new CrawlBoundaryBoundary("http://example/bWAPP/login.php", loginInfo);

describe('Test deserialize', function () {
    it('Should createCrawlBoundary with correct parameters', function () {
        var crawlBoundary = CrawlBoundaryBoundary.deserialize(jsonCrawl);
        assert.equal(crawlBoundary.url, "http://example/bWAPP/login.php");
        assert.equal(crawlBoundary.loginInfo.formAction, loginInfo.formAction);
        assert.equal(crawlBoundary.loginInfo.form.login, loginInfo.form.login);
        assert.equal(crawlBoundary.loginInfo.form.password, loginInfo.form.password);
        assert.equal(crawlBoundary.loginInfo.form.security, loginInfo.form.security);
        assert.equal(crawlBoundary.loginInfo.form.form, loginInfo.form.form);
    });
});

describe('Test serialize', function () {
    it('Should serialize to jsonCrawl String', function () {
        var serialize = boundary.serialize();
        assert.equal(boundary.url, JSON.parse(serialize).url);
        assert.equal(boundary.loginInfo.formAction, JSON.parse(serialize).loginInfo.formAction);
        assert.equal(boundary.loginInfo.form.login, JSON.parse(serialize).loginInfo.form.login);
        assert.equal(boundary.loginInfo.form.password, JSON.parse(serialize).loginInfo.form.password);
        assert.equal(boundary.loginInfo.form.security, JSON.parse(serialize).loginInfo.form.security);
        assert.equal(boundary.loginInfo.form.form, JSON.parse(serialize).loginInfo.form.form);
    });
});