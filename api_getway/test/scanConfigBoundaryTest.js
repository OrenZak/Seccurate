const ScanConfigBoundary = require('../layout/boundaries/scanConfigBoundary');

var assert = require('assert');
var jsonScanConfig = '{"interval": 1000,"maxConcurrency": 3,"maxDepth": 5,"timeout": 10000,"scanType":2}';
var boundary = new ScanConfigBoundary(1000, 3, 5, 10000, 2);

describe('Test deserialize', function () {
    it('Should create ScanConfigBoundary with correct parameters', function () {
        var scanBoundary = ScanConfigBoundary.deserialize(jsonScanConfig);
        assert.equal(scanBoundary.interval, 1000);
        assert.equal(scanBoundary.maxConcurrency, 3);
        assert.equal(scanBoundary.maxDepth, 5);
        assert.equal(scanBoundary.timeout, 10000);
        assert.equal(scanBoundary.scanType, 2);
    });
});

describe('Test serialize', function () {
    it('Should serialzie to {"interval": 1000,"maxConcurrency": 3,"maxDepth": 5,"timeout": 10000},"type":2}', function () {
        var serialize = boundary.serialize();
        assert.equal(boundary.interval, JSON.parse(serialize).interval);
        assert.equal(boundary.maxConcurrency, JSON.parse(serialize).maxConcurrency);
        assert.equal(boundary.maxDepth, JSON.parse(serialize).maxDepth);
        assert.equal(boundary.timeout, JSON.parse(serialize).timeout);
        assert.equal(boundary.scanType, JSON.parse(serialize).scanType);
    });
});