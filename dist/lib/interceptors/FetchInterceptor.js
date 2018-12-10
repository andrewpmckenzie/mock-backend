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
var fetch_mock_1 = require("fetch-mock");
var AbstractInterceptor_1 = require("./AbstractInterceptor");
var FetchInterceptor = /** @class */ (function (_super) {
    __extends(FetchInterceptor, _super);
    function FetchInterceptor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isRunning = false;
        return _this;
    }
    FetchInterceptor.prototype.start = function () {
        var _this = this;
        if (this.isRunning) {
            return;
        }
        fetch_mock_1.mock('*', function (url, _a) {
            var method = _a.method, body = _a.body, headers = _a.headers;
            return new Promise(function (resolve) {
                var normalizedBody = typeof body === 'string' ? body : JSON.stringify(body);
                // TODO: extract fetch headers
                var normalizedHeaders = {};
                var request = _this.createRequest(url, normalizedBody, method, normalizedHeaders);
                var respond = function (_a) {
                    var status = _a.status, body = _a.body, headers = _a.headers;
                    var mockResponse = { status: status, body: body, headers: headers };
                    resolve(mockResponse);
                };
                _this.receivedRequestSubject.next({ request: request, respond: respond });
            });
        });
        this.isRunning = true;
    };
    FetchInterceptor.prototype.stop = function () {
        if (!this.isRunning) {
            return;
        }
        fetch_mock_1.restore();
        this.isRunning = false;
    };
    return FetchInterceptor;
}(AbstractInterceptor_1.AbstractInterceptor));
exports.FetchInterceptor = FetchInterceptor;
//# sourceMappingURL=FetchInterceptor.js.map