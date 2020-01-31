const UserBoundary = require('./../layout/boundaries/userBoundary');

let assert = require('assert');
let json = {"username":"user","password":"password1","role":"ADMIN"};
let username = "user";
let password = "password1";
let role = "ADMIN";
let boundary = new UserBoundary(username, password, role);


describe('Test serialize', function () {
    it('Should serialzie to {"username":"user","password":"password1","role":"ADMIN"}', function () {
        let serialize = boundary.serialize();
        assert.equal(boundary.username, serialize.username);
        assert.equal(boundary.password, serialize.password);
        assert.equal(boundary.role, serialize.role);

    });
});

describe('Test deserialize', function () {
    it('Should create UserBoundary with correct parameters', function () {
        let usersBoundary = UserBoundary.deserialize(json);
        assert.equal(usersBoundary.username, username);
        assert.equal(usersBoundary.password, password);
        assert.equal(usersBoundary.role, role);
    });
});