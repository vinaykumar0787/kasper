"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uncaughtError = void 0;
const uuid_1 = require("uuid");
const error_codes_1 = __importDefault(require("../error_codes"));
const app_error_1 = require("../types/errors/app_error");
async function uncaughtError(err, req, res, _next) {
    if (err instanceof app_error_1.AppError) {
        return res.status(err.httpCode).json({
            message: err.message,
            code: err.appCode,
        });
    }
    else {
        return res.status(400).json({
            message: err.message,
            code: error_codes_1.default.BAD_REQUEST,
        });
    }
    const errorId = (0, uuid_1.v4)();
    req.log.error({ err, errorId });
    res.status(500).json({
        code: error_codes_1.default.INTERNAL,
        message: `An internal error has occurred. It has been logged. Please retry.`,
        errorId,
    });
    if (process.env.NODE_ENV !== 'test') {
        console.warn(err);
    }
    return;
}
exports.uncaughtError = uncaughtError;
//# sourceMappingURL=uncaught_error.js.map