"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var AbstractInterceptor = /** @class */ (function () {
    function AbstractInterceptor() {
        this.receivedRequestSubject = new rxjs_1.Subject();
        this.receivedRequest = this.receivedRequestSubject.asObservable();
    }
    AbstractInterceptor.prototype.createRequest = function (url, body, method, headers) {
        if (body === void 0) { body = ''; }
        if (method === void 0) { method = ''; }
        if (headers === void 0) { headers = {}; }
        return {
            body: body,
            bodyJson: this.maybeParseBody(body),
            headers: __assign({}, (headers || {})),
            method: this.parseMethod(method),
            url: url,
            urlParts: this.parseUrl(url),
        };
    };
    AbstractInterceptor.prototype.parseUrl = function (url) {
        var a = document.createElement('a');
        a.href = url;
        var query = new Map();
        a.search.split('&').forEach(function (segment) {
            var _a = segment.split('='), k = _a[0], v = _a[1];
            var key = decodeURIComponent(k);
            var value = decodeURIComponent(v || '');
            var existingValue = query.get(key);
            var newValue = existingValue ? (typeof existingValue === 'string' ? [existingValue] : existingValue).concat([value]) :
                value;
            query.set(key, newValue);
        });
        return {
            host: a.hostname,
            path: a.pathname,
            port: a.port,
            query: query,
        };
    };
    AbstractInterceptor.prototype.parseMethod = function (method) {
        switch (method) {
            case 'GET':
            case 'POST':
                return method;
            default:
                throw new Error("Unexpectsd method: " + method);
        }
    };
    AbstractInterceptor.prototype.maybeParseBody = function (body) {
        try {
            return JSON.parse(body);
        }
        catch (e) {
            return null;
        }
    };
    return AbstractInterceptor;
}());
exports.AbstractInterceptor = AbstractInterceptor;
//# sourceMappingURL=AbstractInterceptor.js.map