const URLBoundary = require('../layout/urlBoundary');

var assert = require('assert');
var jsonURL = '{"url":"https://test.com"}';
describe('Test deserialize', function () {
    it('Should create URLBoundary with the correct URL', function () {
        var urlBoundary = URLBoundary.deserialize(jsonURL);
        assert.equal(urlBoundary.url, "https://test.com");
    });
});