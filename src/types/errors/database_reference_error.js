"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseReferenceError = void 0;
const error_codes_1 = __importDefault(require("../../error_codes"));
const app_error_1 = require("./app_error");
class DatabaseReferenceError extends app_error_1.AppError {
    constructor(innerError) {
        super(error_codes_1.default.CONFLICT, 409, 'Database reference error (probably you specified an entity ID that does not exist).', innerError);
    }
}
exports.DatabaseReferenceError = DatabaseReferenceError;
//# sourceMappingURL=database_reference_error.js.map