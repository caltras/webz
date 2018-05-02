var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();

var mapping = [
    "/users/${id}",
    "/users/${id}/phone/${number}",
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
    "/users?filter=name&sort=-name"
];
class UrlToPattern{
}
UrlToPattern.convert = (map)=>{
    var pattern = {
        regexp:null,
        fields:[],
    };
    var pieces=map.split("/");

    pieces.forEach((p)=>{
        arrayPattern+="/";
        if(/\$\{([a-zA-Z0-9]+)\}/.test(p)){
            var field = p.replace("${","").replace("}","");
            pattern.fields.push(field);
        }
    });
    var arrayPattern = "^"+map.replace(/\$\{([a-zA-Z0-9]+)\}/g,"([a-zA-Z0-9]+)")+"((/|\\\\?.*|/\\\\?.*|\\\\?)?)$";
    pattern.regexp = new RegExp(arrayPattern);
    return pattern;
}
class Parser{
    constructor(){
        this.url="";
        this.params = null;
        this.fields = null;
        this.pattern=null;
    }
    parse(url,pattern){
        this.url = url;
        this.pattern = pattern;
        return this;
    }
    parameters(){
        if(!this.params){
            this.params = {};
            var cont=1;
            var matches = this.url.match(this.pattern.regexp);
            if(matches){
                for(var i=0;i<this.pattern.fields.length;i++){
                    this.params[this.pattern.fields[0]] = matches[cont];
                    cont++;
                }
            }
            
        }
        return this.params;
    }
    queryString(){
        if(!this.fields){
            this.fields ={};
            var q=this.url.split("?");
            if(q.length>1){
                var keyValue = q[1].split("&");
                keyValue.forEach((k)=>{
                    var fieldsValues = k.split("=");
                    if(fieldsValues.length>0){
                        for(var i=0;i<fieldsValues.length;i=i+2){
                            this.fields[fieldsValues[i]] = fieldsValues[i+1];
                        }
                    }
                })
                
            }
        }
        return this.fields;
    }
}
describe("Parse URL",()=>{
    var pattern = [];
    it("transform into pattern",()=>{
        mapping.forEach((m)=>{
            var p = UrlToPattern.convert(m);
            pattern.push(p);
        });
        assert.equal(/^\/users\/([a-zA-Z0-9]+)((\/|\\?.*|\/\\?.*|\\?)?)$/.toString(),pattern[0].regexp.toString());
        assert.ok(pattern[0].regexp.test(validations[0]));
        assert.ok(pattern[0].regexp.test(validations[1]));
        assert.ok(pattern[0].regexp.test(validations[2]));
        expect(["id"]).to.have.members(pattern[0].fields);
        assert.equal(/^\/users\/([a-zA-Z0-9]+)\/phone\/([a-zA-Z0-9]+)((\/|\\?.*|\/\\?.*|\\?)?)$/.toString(),pattern[1].regexp.toString());
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