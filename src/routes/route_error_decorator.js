"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchRouteErrors = void 0;
function catchRouteErrors(target, _propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = async function (req, res, next, ...rest) {
        try {
            return await method.apply(target, [req, res, next, ...rest]);
        }
        catch (err) {
            next(err);
        }
    };
}
exports.catchRouteErrors = catchRouteErrors;
//# sourceMappingURL=route_error_decorator.js.map