import {UrlToPattern, Parser} from '../src/parsers';
import {assert,expect,should} from 'chai';

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
]
var urls = [
    "/users",
    "/users/1",
    "/users?q=test1",
    "/users/1?q=test1",
    "/users/1?q=test1",
    "/users?filter=name&sort=-name",
    "/users/1/phone/2?filter=name&sort=-name"
];

describe("Parse URL",()=>{
    var pattern = [];
    it("transform into pattern",()=>{
        mapping.forEach((m)=>{
            var p = UrlToPattern.convert(m);
            pattern.push(p);
        });
        assert.equal(/^\/users\/([a-zA-Z0-9]+)(((\/$|\?|\/\?).*)?)$/.toString(),pattern[0].regexp.toString());
        assert.ok(pattern[0].regexp.test(validations[0]));
        assert.ok(pattern[0].regexp.test(validations[1]));
        assert.ok(pattern[0].regexp.test(validations[2]));
        expect(["id"]).to.have.members(pattern[0].fields);
        assert.equal(/^\/users\/([a-zA-Z0-9]+)\/phone\/([a-zA-Z0-9]+)(((\/$|\?|\/\?).*)?)$/.toString(),pattern[1].regexp.toString());
        assert.ok(pattern[1].regexp.test(validations[3]));
        assert.ok(pattern[1].regexp.test(validations[4]));
        assert.ok(pattern[1].regexp.test(validations[5]));
        expect(["id","number"]).to.have.members(pattern[1].fields);
    });
    it("Parser url into parameter",()=>{
        expect({}).to.deep.equal(new Parser().parse(urls[0],pattern[0]).parameters());
        expect({}).to.deep.equal(new Parser().parse(urls[0],pattern[0]).queryString());
        expect({id:'1'}).to.deep.equal(new Parser().parse(urls[1],pattern[0]).parameters());
        expect({}).to.deep.equal(new Parser().parse(urls[1],pattern[0]).queryString());
        expect({}).to.deep.equal(new Parser().parse(urls[5],pattern[2]).parameters());
        expect({filter:'name',sort:'-name'}).to.deep.equal(new Parser().parse(urls[5],pattern[2]).queryString());
        expect({id:'1'}).to.deep.equal(new Parser().parse(urls[3],pattern[0]).parameters());
        expect({q:'test1'}).to.deep.equal(new Parser().parse(urls[3],pattern[0]).queryString());

    });
});