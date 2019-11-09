const CrawlerScanConfigBoundary = require('../logic/boundaries/crawlerConfigScanBoundary');

var assert = require('assert');
var jsonScanConfig = '{"interval": 1000,"maxConcurrency": 3,"maxDepth": 5,"timeout": 10000}';
var boundary = new CrawlerScanConfigBoundary(1000, 3, 5, 10000);

describe('Test deserialize', function () {
    it('Should create ScanConfigBoundary with correct parameters', function () {
        var crawlerBoundary = CrawlerScanConfigBoundary.deserialize(jsonScanConfig);
        assert.equal(crawlerBoundary.interval, 1000);
        assert.equal(crawlerBoundary.maxConcurrency, 3);
        assert.equal(crawlerBoundary.maxDepth, 5);
        assert.equal(crawlerBoundary.timeout, 10000);
    });
});

describe('Test serialize', function () {
    it('Should serialzie to {"interval": 1000,"maxConcurrency": 3,"maxDepth": 5,"timeout": 10000}}', function () {
        var serialize = boundary.serialize();
        assert.equal(boundary.interval, JSON.parse(serialize).interval);
        assert.equal(boundary.maxConcurrency, JSON.parse(serialize).maxConcurrency);
        assert.equal(boundary.maxDepth, JSON.parse(serialize).maxDepth);
        assert.equal(boundary.timeout, JSON.parse(serialize).timeout);
    });
});