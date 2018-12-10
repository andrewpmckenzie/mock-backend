"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlersReducer = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 'ADD_HANDLER':
            return state.concat([action.handler]);
        case 'ADD_HANDLERS':
            return state.concat(action.handlers);
        default:
            return state;
    }
};
//# sourceMappingURL=handlers.js.map