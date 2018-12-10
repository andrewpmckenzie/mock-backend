"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var handlers_1 = require("./handlers");
var requests_1 = require("./requests");
exports.mokdReducer = redux_1.combineReducers({ handlers: handlers_1.handlersReducer, requests: requests_1.requestsReducer });
//# sourceMappingURL=index.js.map