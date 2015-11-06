"use strict";

var
    assert = require("chai").assert,
    spec = require("api-first-spec"),
    config = require("./config/config.json"),
    crypto = require('crypto-js');

var API = spec.define({
    "endpoint": "/api/users/[id]",
    "method": "PUT",
    "request": {
        "contentType": spec.ContentType.URLENCODED,
        "params": {
            "name": "string",
            "password": "string",
            "birthday": "date"  
        },
        "rules": {
            "name": {
                "required": false
            },
            "password": {
                "required": false
            },
            "birthday": {
                "required": false,
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

describe("update", function () {
    var host = spec.host(config.host);

    it("id not present", function (done) {
        host.api(API).params({
            "id": 32,
            "name": "John Smith"
        }).notFound(function (data, res) {
            assert.equal(data.code, 404);
            assert.equal(data.result, false);
            done();
        });
    });

    it("update username", function (done) {
        host.api(API).params({
            "id": 2,
            "name": "Bruce"
        }).success(function (data, res) {
            assert.equal(data.code, 200);
            assert.equal(data.result, true);
            done();
        });
    });

    it("update username, password, birthday", function (done) {
        host.api(API).params({
            "id": 6,
            "name": "Clark",
            "password": crypto.SHA1("test"),
            "birthday": "1990-04-17"
        }).success(function (data, res) {
            assert.equal(data.code, 200);
            assert.equal(data.result, true);
            done();
        });
    });

    it("should fail with wrong birthday", function (done) {
        host.api(API).params({
            "id": 6,
            "name": "Clark",
            "password": crypto.SHA1("test"),
            "birthday": "2990-04-17"
        }).badRequest(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            done();
        });
    });

    it("no field passed", function (done) {
        host.api(API).params({
            "id": 6
        }).success(function (data, res) {
            assert.equal(data.code, 200);
            assert.equal(data.result, true);
            done();
        });
    });

});

module.exports = API;