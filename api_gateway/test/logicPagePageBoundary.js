const CrawlerPageBoundary = require('./../logic/boundaries/crawlerPageBoundary');

let assert = require('assert');
let jsonScanConfig = {url: "http://google.com",pageHash: 311321,type: "Cookie",value: "SESSIONID=123"};
let type = "Cookie";
let sessionValue = "SESSIONID=123";
let pageHash = 311321;
let url = "http://google.com";
let boundary = new CrawlerPageBoundary(url, pageHash, type, sessionValue);

describe('Test deserialize', function () {
    it('Should create CrawlerPageBoundary with correct parameters', function () {
        let pageBoundary = CrawlerPageBoundary.deserialize(jsonScanConfig);
        assert.equal(pageBoundary.url, url);
        assert.equal(pageBoundary.pageHash, pageHash);
        assert.equal(pageBoundary.type, type);
        assert.equal(pageBoundary.value, sessionValue);
    });
});

describe('Test serialize', function () {
    it('Should serialzie to {"url": "http://google.com","pageHash": 311321,"type": "Cookie","value": "SESSIONID=123"}', function () {
        let serialize = boundary.serialize();
        assert.equal(boundary.url, serialize.url);
        assert.equal(boundary.pageHash, serialize.pageHash);
        assert.equal(boundary.type, serialize.type);
        assert.equal(boundary.value, serialize.value);
    });
});