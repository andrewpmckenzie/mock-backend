"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("../lib/store");
var App_1 = require("./App");
exports.ConnectedApp = store_1.connect(App_1.App, function (state) { return ({
    handlers: store_1.getHandlers(state),
    requests: store_1.getRequestsWithoutRespondFunctions(state),
}); }, function () { return ({}); });
//# sourceMappingURL=ConnectedApp.js.map