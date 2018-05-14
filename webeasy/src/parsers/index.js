"use strict";
exports.__esModule = true;
var UrlToPattern = /** @class */ (function () {
    function UrlToPattern() {
    }
    UrlToPattern.convert = function (map) {
        var pattern = {
            regexp: null,
            fields: []
        };
        var pieces = map.split("/");
        pieces.forEach(function (p) {
            arrayPattern += "/";
            if (/:([a-zA-Z0-9]+)/.test(p)) {
                var field = p.replace(":", "");
                pattern.fields.push(field);
            }
        });
        var arrayPattern = "^" + map.replace(/:([a-zA-Z0-9]+)/g, "([a-zA-Z0-9]+)") + "(((\\/$|\\?|\\/\\?).*)?)$";
        pattern.regexp = new RegExp(arrayPattern);
        return pattern;
    };
    return UrlToPattern;
}());
exports.UrlToPattern = UrlToPattern;
var Parser = /** @class */ (function () {
    function Parser() {
        this.url = "";
        this.params = null;
        this.fields = null;
        this.pattern = null;
        this.url = "";
        this.params = null;
        this.fields = null;
        this.pattern = null;
    }
    Parser.prototype.parse = function (url, pattern) {
        var _this = this;
        this.url = url;
        if (pattern) {
            this.pattern = pattern;
        }
        else {
            console.warn("The pattern should be /<domain>/<?:id>, for instance: /users/1. ? is optional.");
            this.params = {};
            var cont = 1;
            var strPattern = "^";
            url.replace(/\?.*$/, "").split("/").forEach(function (value, index) {
                if (index > 0) {
                    strPattern += "/";
                    if (index % 2 === 0) {
                        _this.params["field" + cont] = value;
                        cont++;
                        strPattern += "([a-zA-Z0-9]+)";
                    }
                    else {
                        strPattern += value;
                    }
                }
            });
            strPattern = strPattern + "(((\\/$|\\?|\\/\\?).*)?)$";
            this.pattern = new RegExp(strPattern);
        }
        return this;
    };
    Parser.prototype.parameters = function () {
        if (!this.params) {
            this.params = {};
            var cont = 1;
            var matches = this.url.match(this.pattern.regexp);
            if (matches) {
                for (var i = 0; i < this.pattern.fields.length; i++) {
                    this.params[this.pattern.fields[0]] = matches[cont];
                    cont++;
                }
            }
        }
        return this.params;
    };
    Parser.prototype.queryString = function () {
        var _this = this;
        if (!this.fields) {
            this.fields = {};
            var q = this.url.split("?");
            if (q.length > 1) {
                var keyValue = q[1].split("&");
                keyValue.forEach(function (k) {
                    var fieldsValues = k.split("=");
                    if (fieldsValues.length > 0) {
                        for (var i = 0; i < fieldsValues.length; i = i + 2) {
                            _this.fields[fieldsValues[i]] = fieldsValues[i + 1];
                        }
                    }
                });
            }
        }
        return this.fields;
    };
    return Parser;
}());
exports.Parser = Parser;
