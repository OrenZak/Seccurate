const CrawlBoundaryBoundary = require('../layout/boundaries/startCrawlBoundary');

let assert = require('assert');
let id = 1;
let jsonCrawl = {"id":1};
let boundary = new CrawlBoundaryBoundary(id);

describe('Test deserialize', function () {
    it('Should createCrawlBoundary with correct parameters', function () {
        let crawlBoundary = CrawlBoundaryBoundary.deserialize(jsonCrawl);
        assert.equal(crawlBoundary.id, id);

    });
});

describe('Test serialize', function () {
    it('Should serialize to jsonCrawl String', function () {
        var serialize = boundary.serialize();
        assert.equal(boundary.id, JSON.parse(serialize).id);
        // assert.equal(boundary.loginInfo.formAction, JSON.parse(serialize).loginInfo.formAction);
        // assert.equal(boundary.loginInfo.form.login, JSON.parse(serialize).loginInfo.form.login);
        // assert.equal(boundary.loginInfo.form.password, JSON.parse(serialize).loginInfo.form.password);
        // assert.equal(boundary.loginInfo.form.security, JSON.parse(serialize).loginInfo.form.security);
        // assert.equal(boundary.loginInfo.form.form, JSON.parse(serialize).loginInfo.form.form);
    });
});