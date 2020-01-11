const GetResultsRequestBoundary = require('../layout/boundaries/getResultsResponseBoundary');

var assert = require('assert');
var json = '{"scanName":"scan"}';
var scanName = "scan";
var boundary = new GetResultsRequestBoundary(scanName);


describe('Test serialize', function () {
    it('Should serialzie to {"scanName":"scan"}', function () {
        var serialize = boundary.serialize();
        assert.equal(boundary.scanName, JSON.parse(serialize).scanName);
    });
});