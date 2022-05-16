"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initExitSignalHandler = void 0;
const death_1 = __importDefault(require("death"));
const database = __importStar(require("./mysql_database/db_core"));
function closeApi(api) {
    return new Promise((fulfill, reject) => {
        if (!api.server) {
            return fulfill();
        }
        api.server.close((err) => {
            if (err) {
                return reject(err);
            }
            return fulfill();
        });
    });
}
function initExitSignalHandler(api) {
    (0, death_1.default)(() => {
        Promise.all([database.close(), closeApi(api)])
            .catch((err) => {
            console.warn(err);
            process.exit(1);
        })
            .then(() => {
            process.exit(0);
        });
    });
}
exports.initExitSignalHandler = initExitSignalHandler;
//# sourceMappingURL=exit_signal_handler.js.map