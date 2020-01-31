const GetResultsRequestBoundary = require('layout/boundaries/getResultsResponseBoundary');

let assert = require('assert');
let json = '{"scanName":"scan"}';
let scanName = "scan";
let boundary = new GetResultsRequestBoundary(scanName);


describe('Test serialize', function () {
    it('Should serialzie to {"scanName":"scan"}', function () {
        let serialize = boundary.serialize();
        assert.equal(boundary.scanName, JSON.parse(serialize).scanName);
    });
});