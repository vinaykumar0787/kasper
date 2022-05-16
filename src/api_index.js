"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const pino_http_1 = __importDefault(require("pino-http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const constants_1 = __importDefault(require("./constants"));
const uncaught_error_1 = require("./middleware/uncaught_error");
const wildcard_404_1 = require("./routes/misc/wildcard_404");
const source_map_support_1 = __importDefault(require("source-map-support"));
const exit_signal_handler_1 = require("./exit_signal_handler");
const kasper_api_1 = require("./routes/kasper_api");
source_map_support_1.default.install();
const port = process.env.PORT || 3001;
const api = (0, express_1.default)();
exports.api = api;
/* Core middleware */
api.use((0, helmet_1.default)());
api.use((0, pino_http_1.default)({ enabled: constants_1.default.IS_PRODUCTION }));
api.use((0, cookie_parser_1.default)());
api.use(express_1.default.json({ limit: '50mb' }));
/* Project Vendor Connector */
api.get('/kasper/users', kasper_api_1.getUsers);
api.post('/kasper/users', kasper_api_1.postUser);
api.patch('/kasper/users/:userId', kasper_api_1.attachUser, kasper_api_1.patchUser);
api.delete('/kasper/users/:userId', kasper_api_1.attachUser, kasper_api_1.deleteUser);
/* Wildcard route */
api.get('*', wildcard_404_1.wildcard404);
/* Top level error handler */
api.use(uncaught_error_1.uncaughtError);
api.server = api.listen(port, () => {
    console.log('Started');
});
(0, exit_signal_handler_1.initExitSignalHandler)(api);
//# sourceMappingURL=api_index.js.map