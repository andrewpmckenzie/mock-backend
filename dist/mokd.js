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
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var ConnectedApp_1 = require("./components/ConnectedApp");
var FetchInterceptor_1 = require("./lib/interceptors/FetchInterceptor");
var XHRInterceptor_1 = require("./lib/interceptors/XHRInterceptor");
var store_1 = require("./lib/store");
var Mokd = /** @class */ (function () {
    function Mokd(handlers, interceptors, fixtureElId) {
        if (handlers === void 0) { handlers = []; }
        if (interceptors === void 0) { interceptors = [new XHRInterceptor_1.XHRInterceptor(), new FetchInterceptor_1.FetchInterceptor()]; }
        if (fixtureElId === void 0) { fixtureElId = 'mokd'; }
        this.interceptors = interceptors;
        this.fixtureElId = fixtureElId;
        this.requestIdCounter = 0;
        store_1.mokdStore.dispatch(store_1.addHandlers(handlers));
    }
    Mokd.create = function (handlers) {
        return new Mokd(handlers).init();
    };
    Mokd.prototype.init = function () {
        var _this = this;
        if (document.readyState === 'complete') {
            this.render();
        }
        else {
            window.addEventListener('load', function () { return _this.render(); });
        }
        this.interceptors.forEach(function (interceptor) {
            interceptor.receivedRequest.subscribe(function (respondableRequest) {
                var requestWithMetadata = __assign({ id: _this.requestIdCounter++, received: new Date() }, respondableRequest);
                store_1.mokdStore.dispatch(store_1.addRequest(requestWithMetadata));
            });
            interceptor.start();
        });
        return this;
    };
    Mokd.prototype.render = function () {
        this.appendFixtureElement();
        ReactDOM.render(this.renderApp(), document.getElementById(this.fixtureElId));
    };
    Mokd.prototype.appendFixtureElement = function () {
        var fixtureEl = document.createElement('div');
        fixtureEl.id = this.fixtureElId;
        document.body.appendChild(fixtureEl);
    };
    Mokd.prototype.renderApp = function () {
        return (React.createElement(react_redux_1.Provider, { store: store_1.mokdStore },
            React.createElement(ConnectedApp_1.ConnectedApp, null)));
    };
    return Mokd;
}());
exports.Mokd = Mokd;
//# sourceMappingURL=Mokd.js.map