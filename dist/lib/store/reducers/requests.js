"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestsReducer = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 'ADD_REQUEST':
            return state.concat([action.respondableRequest]);
        default:
            return state;
    }
};
//# sourceMappingURL=requests.js.map