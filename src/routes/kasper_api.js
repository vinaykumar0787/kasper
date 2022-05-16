"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUsers = exports.attachUser = exports.patchUser = exports.postUser = void 0;
const assert_1 = __importDefault(require("assert"));
const route_error_decorator_1 = require("./route_error_decorator");
const error_codes_1 = __importDefault(require("../error_codes"));
const user_database_1 = require("../mysql_database/user_database");
const user_orchestrator_1 = require("../orchestrators/user_orchestrator");
const user_1 = require("../types/user/user");
const user_update_1 = require("../types/user/user_update");
const database = new user_database_1.UserDatabase();
const orchestrator = new user_orchestrator_1.UserOrchestrator(database);
class UserRoutes {
    /// <summary>
    ///   Method to Attach User to Request for further processing in request pipeline chain
    /// </summary>
    static async attachUser(req, res, next) {
        const appReq = req;
        const userId = Number.parseInt(req.params.userId);
        (0, assert_1.default)(!Number.isNaN(userId));
        const otherUser = await orchestrator.getUserById(userId);
        if (otherUser) {
            appReq.user = otherUser;
            return next();
        }
        else {
            return res.status(404).json({
                message: 'User not found.',
                code: error_codes_1.default.NOT_FOUND,
            });
        }
    }
    /// <summary>
    ///   Method to Get all Users in ordered format by rank
    /// </summary>
    static async getUsers(_req, res) {
        const users = await orchestrator.getAllUsers();
        return res.status(200).json(users);
    }
    /// <summary>
    ///   Method to Delete a specific user
    /// </summary>
    static async deleteUser(req, res) {
        const appReq = req;
        const user = appReq.user;
        (0, assert_1.default)(user, 'User is not attached to the request');
        await orchestrator.deleteUser(user.id);
        res.status(204).json({});
    }
    /// <summary>
    ///   Method to Patch User's name and rank
    /// </summary>
    static async patchUser(req, res) {
        const appReq = req;
        const user = appReq.user;
        (0, assert_1.default)(user, 'User is not attached to the request');
        const userUpdate = new user_update_1.KasperUserUpdate(req.body, user);
        const updatedUser = await orchestrator.updateUser(userUpdate);
        return res.status(200).json(updatedUser);
    }
    /// <summary>
    ///   Method to create a new User
    /// </summary>
    static async postUser(req, res) {
        const userCreate = new user_1.KasperUser(req.body);
        const newUser = await orchestrator.createUser(userCreate);
        return res.status(201).json(newUser);
    }
}
__decorate([
    route_error_decorator_1.catchRouteErrors
], UserRoutes, "attachUser", null);
__decorate([
    route_error_decorator_1.catchRouteErrors
], UserRoutes, "getUsers", null);
__decorate([
    route_error_decorator_1.catchRouteErrors
], UserRoutes, "deleteUser", null);
__decorate([
    route_error_decorator_1.catchRouteErrors
], UserRoutes, "patchUser", null);
__decorate([
    route_error_decorator_1.catchRouteErrors
], UserRoutes, "postUser", null);
exports.postUser = UserRoutes.postUser;
exports.patchUser = UserRoutes.patchUser;
exports.attachUser = UserRoutes.attachUser;
exports.getUsers = UserRoutes.getUsers;
exports.deleteUser = UserRoutes.deleteUser;
//# sourceMappingURL=kasper_api.js.map