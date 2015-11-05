"use strict";

var
    assert = require("chai").assert,
    spec = require("api-first-spec"),
    config = require("./config/config.json"),
    fixtures = new (require("sql-fixtures"))(config.database);

var API = spec.define({
    "endpoint": "/api/users/[id]",
    "method": "GET",
    "request": {
        "contentType": spec.ContentType.JSON,
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
                "required": false
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

describe("show", function () {
    var host = spec.host(config.host);

    it("invalid id", function (done) {
        host.api(API).params({
            "id": 10
        }).success(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            done();
        });
    });

    it("success on valid id", function (done) {
        host.api(API).params({
            "id": 5
        }).success(function (data, res) {
            assert.equal(data.code, 200);
            assert.equal(data.result, true);
            assert.equal(data.username, "Bruce Wayne");
            done();
        });
    });

});

module.exports = API;