"use strict";

var
    assert = require("chai").assert,
    spec = require("api-first-spec"),
    config = require("./config/config.json"),
    crypto = require('crypto-js');

var API = spec.define({
    "endpoint": "/api/users",
    "method": "POST",
    "request": {
        "contentType": spec.ContentType.URLENCODED,
        "params": {
            "name": "string",
            "password": "string",
            "email": "string",
            "birthday": "date"
        },
        "rules": {
            "name": {
                "required": true
            },
            "password": {
                "required": true
            },
            "email": {
                "email": true,
                "required": true
            },
            "birthday": {
                "required": true,
                "format": "YYYY-MM-DD"
            }
        }
    },
    "response": {
        "strict": true,
        "contentType": spec.ContentType.JSON,
        "data": {
            "code": "int",
            "result": "boolean"
        },
        "rules": {
            "code": {
                "required": true
            },
            "result": {
                "required": true
            }
        }
    }
});

describe("create", function () {
    var host = spec.host(config.host);

    it("invalid email", function (done) {
        console.log("In create invalid email");
        host.api(API).params({
            "name": "Test",
            "password": crypto.SHA1("123abc!"),
            "email": "invalid",
            "birthday": "2000-04-17"
        }).badRequest(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            done();
        });
    });

    it("invalid Birthday", function (done) {
        host.api(API).params({
            "name": "Ted",
            "password": crypto.SHA1("password!"),
            "email": "user7@test.com",
            "birthday": "2030-04-17"
        }).badRequest(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            done();
        });
    });

    it("user already present", function (done) {
        host.api(API).params({
            "name": "Bruce Wayne",
            "password": crypto.SHA1("password"),
            "email": "user5@test.com",
            "birthday": "2000-04-17"
        }).badRequest(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            done();
        });
    });

    it("success", function (done) {
        host.api(API).params({
            "name": "Peter Parker",
            "password": crypto.SHA1("123abc!"),
            "email": "test@test.com",
            "birthday": "2000-04-17"
        }).success(function (data, res) {
            assert.equal(data.code, 200);
            assert.equal(data.result, true);
            done();
        });
    });

});

module.exports = API;