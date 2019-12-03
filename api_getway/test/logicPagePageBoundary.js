const CrawlerPageBoundary = require('../logic/boundaries/crawlerPageBoundary');

var assert = require('assert');
var jsonScanConfig = {url: "http://google.com",pageHash: 311321,type: "Cookie",value: "SESSIONID=123"};
var type = "Cookie";
var sessionValue = "SESSIONID=123";
var pageHash = 311321;
var url = "http://google.com";
var boundary = new CrawlerPageBoundary(url, pageHash, type, sessionValue);

describe('Test deserialize', function () {
    it('Should create CrawlerPageBoundary with correct parameters', function () {
        var pageBoundary = CrawlerPageBoundary.deserialize(jsonScanConfig);
        assert.equal(pageBoundary.url, url);
        assert.equal(pageBoundary.pageHash, pageHash);
        assert.equal(pageBoundary.type, type);
        assert.equal(pageBoundary.value, sessionValue);
    });
});

describe('Test serialize', function () {
    it('Should serialzie to {"url": "http://google.com","pageHash": 311321,"type": "Cookie","value": "SESSIONID=123"}', function () {
        var serialize = boundary.serialize();
        assert.equal(boundary.url, serialize.url);
        assert.equal(boundary.pageHash, serialize.pageHash);
        assert.equal(boundary.type, serialize.type);
        assert.equal(boundary.value, serialize.value);
    });
});