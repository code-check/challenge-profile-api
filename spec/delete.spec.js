"use strict";

var
    assert = require("chai").assert,
    spec = require("api-first-spec"),
    config = require("./config/config.json"),
    fixtures = new (require("sql-fixtures"))(config.database);

var API = spec.define({
    "endpoint": "/api/users/[id]",
    "method": "DELETE",
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

describe("delete", function () {
    var host = spec.host(config.host);

    it("invalid Id", function (done) {
        host.api(API).params({
            "id": 10
        }).success(function (data, res) {
            assert.equal(data.code, 400);
            assert.equal(data.result, false);
            done();
        });
    });

    it("success on valid Id", function (done) {
        host.api(API).params({
            "id": 1
        }).success(function (data, res) {
            assert.equal(data.code, 200);
            assert.equal(data.result, true);
            assert.equal(data.username, "John Smith");
            done();
        });
    });

});

module.exports = API;