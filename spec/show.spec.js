"use strict";

var
    assert = require("chai").assert,
    spec = require("api-first-spec"),
    config = require("./config/config.json");

var API = spec.define({
    "endpoint": "/api/users/[id]",
    "method": "GET",
    "request": {
        "contentType": spec.ContentType.URLENCODED,
    },
    "response": {
        "strict": true,
        "contentType": spec.ContentType.JSON,
        "data": {
            "code": "int",
            "name": "string",
            "result": "boolean"
        },
        "rules": {
            "code": {
                "required": true
            },
            "name": {
                "required": true
            },
            "result": {
                "required": true
            }
        }
    }
});

describe("show", function () {
    var host = spec.host(config.host);

    it("invalid id", function (done) {
        host.api(API).params({
            "id": 10
        }).notFound(function (data, res) {
            assert.equal(data.code, 404);
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
            assert.equal(data.name, "Bruce Wayne");
            done();
        });
    });

});

module.exports = API;