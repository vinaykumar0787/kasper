"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateMySQLErrors = void 0;
const assert_1 = __importDefault(require("assert"));
const database_duplicate_error_1 = require("../types/errors/database_duplicate_error");
const database_reference_error_1 = require("../types/errors/database_reference_error");
function translateMySQLErrors(target) {
    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
        if (descriptor.value instanceof Function) {
            const originalMethod = descriptor.value;
            descriptor.value = function (...args) {
                const returnValue = originalMethod.apply(this, args);
                (0, assert_1.default)(returnValue instanceof Promise, 'MySQL function is expected to return a promise');
                return returnValue.catch((err) => {
                    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                        throw new database_reference_error_1.DatabaseReferenceError(err);
                    }
                    else if (err.code === 'ER_DUP_ENTRY') {
                        throw new database_duplicate_error_1.DatabaseDuplicateError(err);
                    }
                    throw err;
                });
            };
            Object.defineProperty(target.prototype, propertyName, descriptor);
        }
    }
}
exports.translateMySQLErrors = translateMySQLErrors;
//# sourceMappingURL=error_decorator.js.map