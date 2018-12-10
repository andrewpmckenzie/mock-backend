"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
function connect(component, stateToProps, dispatchToProps) {
    if (stateToProps === void 0) { stateToProps = function () { return ({}); }; }
    if (dispatchToProps === void 0) { dispatchToProps = function () { return ({}); }; }
    return react_redux_1.connect(stateToProps, dispatchToProps)(component);
}
exports.connect = connect;
//# sourceMappingURL=connect.js.map