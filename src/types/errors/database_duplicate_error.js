"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseDuplicateError = void 0;
const error_codes_1 = __importDefault(require("../../error_codes"));
const app_error_1 = require("./app_error");
class DatabaseDuplicateError extends app_error_1.AppError {
    constructor(innerError) {
        super(error_codes_1.default.CONFLICT, 409, 'There was a conflict with another entity that has the same attributes.', innerError);
    }
}
exports.DatabaseDuplicateError = DatabaseDuplicateError;
//# sourceMappingURL=database_duplicate_error.js.map