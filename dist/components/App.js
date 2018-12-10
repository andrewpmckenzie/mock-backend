"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.App = function (_a) {
    var requests = _a.requests;
    return (React.createElement("ul", null, requests.map(function (r) { return (React.createElement("div", { key: r.id }, r.request.url)); })));
};
//# sourceMappingURL=App.js.map