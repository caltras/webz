"use strict";
exports.__esModule = true;
var parsers_1 = require("../src/parsers");
var chai_1 = require("chai");
var mapping = [
    "/users/:id",
    "/users/:id/phone/:number",
    "/users",
];
var validations = [
    "/users/1",
    "/users/1/",
    "/users/1?q=test",
    "/users/1/phone/123456789",
    "/users/1/phone/123456789/",
    "/users/1/phone/987654321?filter=name",
    "/users?filter=name&sort=-name"
];
var urls = [
    "/users",
    "/users/1",
    "/users?q=test1",
    "/users/1?q=test1",
    "/users/1?q=test1",
    "/users?filter=name&sort=-name",
    "/users/1/phone/2?filter=name&sort=-name"
];
describe("Parse URL", function () {
    var pattern = [];
    it("transform into pattern", function () {
        mapping.forEach(function (m) {
            var p = parsers_1.UrlToPattern.convert(m);
            pattern.push(p);
        });
        chai_1.assert.equal(/^\/users\/([a-zA-Z0-9]+)(((\/$|\?|\/\?).*)?)$/.toString(), pattern[0].regexp.toString());
        chai_1.assert.ok(pattern[0].regexp.test(validations[0]));
        chai_1.assert.ok(pattern[0].regexp.test(validations[1]));
        chai_1.assert.ok(pattern[0].regexp.test(validations[2]));
        chai_1.expect(["id"]).to.have.members(pattern[0].fields);
        chai_1.assert.equal(/^\/users\/([a-zA-Z0-9]+)\/phone\/([a-zA-Z0-9]+)(((\/$|\?|\/\?).*)?)$/.toString(), pattern[1].regexp.toString());
        chai_1.assert.ok(pattern[1].regexp.test(validations[3]));
        chai_1.assert.ok(pattern[1].regexp.test(validations[4]));
        chai_1.assert.ok(pattern[1].regexp.test(validations[5]));
        chai_1.expect(["id", "number"]).to.have.members(pattern[1].fields);
    });
    it("Parser url into parameter", function () {
        chai_1.expect({}).to.deep.equal(new parsers_1.Parser().parse(urls[0], pattern[0]).parameters());
        chai_1.expect({}).to.deep.equal(new parsers_1.Parser().parse(urls[0], pattern[0]).queryString());
        chai_1.expect({ id: '1' }).to.deep.equal(new parsers_1.Parser().parse(urls[1], pattern[0]).parameters());
        chai_1.expect({}).to.deep.equal(new parsers_1.Parser().parse(urls[1], pattern[0]).queryString());
        chai_1.expect({}).to.deep.equal(new parsers_1.Parser().parse(urls[5], pattern[2]).parameters());
        chai_1.expect({ filter: 'name', sort: '-name' }).to.deep.equal(new parsers_1.Parser().parse(urls[5], pattern[2]).queryString());
        chai_1.expect({ id: '1' }).to.deep.equal(new parsers_1.Parser().parse(urls[3], pattern[0]).parameters());
        chai_1.expect({ q: 'test1' }).to.deep.equal(new parsers_1.Parser().parse(urls[3], pattern[0]).queryString());
    });
});
