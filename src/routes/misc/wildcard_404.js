"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wildcard404 = void 0;
const error_codes_1 = __importDefault(require("../../error_codes"));
function wildcard404(_req, res) {
    res.status(404).json({
        message: 'Nothing here.',
        code: error_codes_1.default.NOT_FOUND,
    });
}
exports.wildcard404 = wildcard404;
//# sourceMappingURL=wildcard_404.js.map