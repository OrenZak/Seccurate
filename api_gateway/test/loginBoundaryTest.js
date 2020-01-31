const LoginBoundary = require('./../layout/boundaries/loginBoundary');

let assert = require('assert');
let json = {"username":"zur","password":"password1"};
let username = "zur";
let password = "password1";
let boundary = new LoginBoundary(username, password);


describe('Test serialize', function () {
    it('Should serialzie to {"username":"user","password":"password1"}', function () {
        let serialize = boundary.serialize();
        assert.equal(boundary.username, serialize.username);
        assert.equal(boundary.password, serialize.password);
    });
});

describe('Test deserialize', function () {
    it('Should create LoginBoundary with correct parameters', function () {
        let loginBoundary = LoginBoundary.deserialize(json);
        assert.equal(loginBoundary.username, username);
        assert.equal(loginBoundary.password, password);
    });
});