"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addHandler(handler) {
    return { type: 'ADD_HANDLER', handler: handler };
}
exports.addHandler = addHandler;
function addHandlers(handlers) {
    return { type: 'ADD_HANDLERS', handlers: handlers };
}
exports.addHandlers = addHandlers;
//# sourceMappingURL=handler.js.map