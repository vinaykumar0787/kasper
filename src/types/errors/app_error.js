"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(appCode, httpCode, message, innerError) {
        super(message);
        this.appCode = appCode;
        this.httpCode = httpCode;
        this.message = message;
        this.innerError = innerError;
        this.appCode = appCode;
        this.httpCode = httpCode;
        this.message = message;
        this.innerError = innerError;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app_error.js.map