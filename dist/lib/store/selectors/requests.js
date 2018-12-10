"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var reselect_1 = require("reselect");
var getRequests = function (state) { return state.requests; };
// we exclude the response functions to make it clear that they shouldn't be
// executed directly (instead, use the RespondToRequest action).
exports.getRequestsWithoutRespondFunctions = reselect_1.createSelector(getRequests, function (requests) { return requests.map(function (_a) {
    var respond = _a.respond, rest = __rest(_a, ["respond"]);
    return rest;
}); });
exports.getRespondFunctions = reselect_1.createSelector(getRequests, function (requests) { return requests.map(function (_a) {
    var respond = _a.respond, id = _a.id;
    return ({ respond: respond, id: id });
}); });
//# sourceMappingURL=requests.js.map