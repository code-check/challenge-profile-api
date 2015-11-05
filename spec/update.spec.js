"use strict";

var
    assert = require("chai").assert,
    spec = require("api-first-spec"),
    config = require("./config/config.json"),
    fixtures = new (require("sql-fixtures"))(config.database),
    crypto = require('crypto');

var API = spec.define({
    "endpoint": "api/users/[id]",
    "method": "PUT",
    "request": {
        "contentType": spec.ContentType.JSON,
        "params": {
            "username": "string",
            "password": "string",
            "birthday": "date"  
        },
        "rules": {
            "username": {
                "required": true
            },
            "password": {
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
            "password": "string",
            "birthday": "date",
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
            "password": {
                "required": true
            },
            "birthday": {
                "required": true,
                "format": "YYYY-MM-DD"
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

describe("update", function () {
    var host = spec.host(config.host);

    it("id not present", function (done) {
        host.api(API).params({
            "id": 32,
            "username": "John Smith"
        }).success(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            done();
        });
    });

    it("update username", function (done) {
        host.api(API).params({
            "id": 2,
            "username": "Bruce"
        }).success(function (data, res) {
            assert.equal(data.code, 200);
            assert.equal(data.result, true);
            assert.equal(data.username, "Bruce");
            assert.equal(data.password, sha1("password"));
            assert.equal(data.birthday, "1989-04-17");
            done();
        });
    });

    it("update username, password, birthday", function (done) {
        host.api(API).params({
            "id": 6,
            "username": "Clark",
            "password": crypto.SHA1("testpassword"),
            "birthday": "1990-04-17"
        }).success(function (data, res) {
            assert.equal(data.code, 200);
            assert.equal(data.result, true);
            assert.equal(data.username, "Clark");
            assert.equal(data.password, crypto.SHA1("testpassword"));
            assert.equal(data.birthday, "1990-04-17");
            done();
        });
    });

    it("no field passed", function (done) {
        host.api(API).params({
            "id": 6
        }).success(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            done();
        });
    });

});

module.exports = API;