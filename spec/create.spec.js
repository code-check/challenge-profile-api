"use strict";

var
    assert = require("chai").assert,
    spec = require("api-first-spec"),
    config = require("./config/config.json"),
    fixtures = new (require("sql-fixtures"))(config.database),
    crypto = require('crypto'),

var API = spec.define({
    "endpoint": "api/users",
    "method": "POST",
    "request": {
        "contentType": spec.ContentType.JSON,
        "params": {
            "username": "string",
            "password": "string",
            "email": "string",
            "birthday": "date"
        },
        "rules": {
            "username": {
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
        "contentType": spec.ContentType.JSON,
        "data": {
            "code": "int",
            "username": "string",
            "result": "boolean",
            "reason": "string"
        },
        "rules": {
            "code": {
                "required": true
            },
            "username": {
                "required": true
            },
            "result": {
                "required": true
            },
            "reason": {
                "required": function (data) {
                    return !data.result;
                }
            }
        }
    }
});

describe("create", function () {
    var host = spec.host(config.host);

    it("invalid email", function (done) {
        host.api(API).params({
            "username": "Test",
            "password" = crypto.SHA1("123abc!");
            "email": "invalid",
            "birthday": "2000-04-17"
        }).success(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            assert.equal(data.username, "Test");
            done();
        });
    });

    it("invalid Birthday", function (done) {
        host.api(API).params({
            "username": "Ted",
            "password" = crypto.SHA1("password!");
            "email": "user7@test.com",
            "birthday": "2030-04-17"
        }).success(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            assert.equal(data.username, "Bruce Wayne");
            done();
        });
    });

    it("user already present", function (done) {
        host.api(API).params({
            "username": "Bruce Wayne",
            "password" = crypto.SHA1("password");
            "email": "user5@test.com",
            "birthday": "2000-04-17"
        }).success(function (data, res) {
            assert.equal(data.code, 409);
            assert.equal(data.result, false);
            assert.equal(data.username, "Bruce Wayne");
            done();
        });
    });

    it("success", function (done) {
        host.api(API).params({
            "username": "Peter Parker",
            "password" = crypto.SHA1("123abc!");
            "email": "test@test.com",
            "birthday": "2000-04-17"
        }).success(function (data, res) {
            assert.equal(data.code, 200);
            assert.equal(data.result, true);
            assert.equal(data.username, "Peter Parker");
            done();
        });
    });

});

module.exports = API;