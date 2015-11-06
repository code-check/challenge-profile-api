"use strict";

var
    assert = require("chai").assert,
    spec = require("api-first-spec"),
    config = require("./config/config.json");

var API = spec.define({
    "endpoint": "/api/users/[id]",
    "method": "DELETE",
    "request": {
        "contentType": spec.ContentType.URLENCODED,
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

describe("delete", function () {
    var host = spec.host(config.host);

    it("invalid Id", function (done) {
        host.api(API).params({
            "id": 10
        }).notFound(function (data, res) {
            assert.equal(data.code, 404);
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
            done();
        });
    });

});

module.exports = API;