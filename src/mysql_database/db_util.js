"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefined = void 0;
function removeUndefined(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
}
exports.removeUndefined = removeUndefined;
//# sourceMappingURL=db_util.js.map