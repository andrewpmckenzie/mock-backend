"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var reducers_1 = require("./reducers");
__export(require("./actions"));
__export(require("./connect"));
__export(require("./selectors"));
exports.mokdStore = redux_1.createStore(reducers_1.mokdReducer);
//# sourceMappingURL=index.js.map