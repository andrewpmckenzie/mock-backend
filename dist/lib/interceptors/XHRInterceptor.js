"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sinon = require("sinon");
var AbstractInterceptor_1 = require("./AbstractInterceptor");
var XHRInterceptor = /** @class */ (function (_super) {
    __extends(XHRInterceptor, _super);
    function XHRInterceptor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.xhr = null;
        return _this;
    }
    XHRInterceptor.prototype.start = function () {
        if (this.xhr) {
            return;
        }
        this.xhr = sinon.useFakeXMLHttpRequest();
        this.xhr.onCreate = this.handleFakeXHR.bind(this);
    };
    XHRInterceptor.prototype.stop = function () {
        if (!this.xhr) {
            return;
        }
        this.xhr.restore();
        this.xhr = null;
    };
    XHRInterceptor.prototype.handleFakeXHR = function (xhr) {
        var _this = this;
        var handler = function () {
            if (xhr.readyState !== XMLHttpRequest.OPENED) {
                return;
            }
            else {
                xhr.removeEventListener('readystatechange', handler);
            }
            var request = _this.createRequest(xhr.url, xhr.requestBody, xhr.method, xhr.requestHeaders);
            var respond = function (response) {
                var _a = response.status, status = _a === void 0 ? 200 : _a, _b = response.headers, headers = _b === void 0 ? {} : _b, _c = response.body, body = _c === void 0 ? '' : _c;
                xhr.respond(status, headers, typeof body === 'string' ? body : JSON.stringify(body));
            };
            window.setTimeout(function () {
                _this.receivedRequestSubject.next({ request: request, respond: respond });
            });
        };
        xhr.addEventListener('readystatechange', handler);
    };
    return XHRInterceptor;
}(AbstractInterceptor_1.AbstractInterceptor));
exports.XHRInterceptor = XHRInterceptor;
//# sourceMappingURL=XHRInterceptor.js.map