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
exports.UserDatabase = void 0;
const db_core_1 = require("./db_core");
const error_decorator_1 = require("./error_decorator");
const assert_1 = __importDefault(require("assert"));
const db_util_1 = require("./db_util");
let UserDatabase = class UserDatabase {
    async getUserById(id, context) {
        const query = (0, db_core_1.knexQueryBuilder)()
            .select('*')
            .from(`KasperUsers`)
            .whereRaw(`id=?`)
            .toString();
        const result = await (0, db_core_1.doQuery)(query, [id], context);
        return result.results[0];
    }
    async getAllUsers() {
        const query = (0, db_core_1.knexQueryBuilder)()
            .select('*')
            .from(`KasperUsers`)
            .orderByRaw(`userRank`)
            .toString();
        const result = await (0, db_core_1.doQuery)(query);
        return result.results;
    }
    async getMaxRank() {
        const query = `select Max(userRank) AS UserRank from KasperUsers`;
        const result = await (0, db_core_1.doQuery)(query);
        return result.results[0].UserRank;
    }
    createUser(userPost) {
        return (0, db_core_1.doInTransaction)(async (transactionContext) => {
            const newRank = (await this.getMaxRank()) + 1;
            const query = (0, db_core_1.knexQueryBuilder)()
                .insert({
                'name': userPost.name,
                'UserRank': newRank,
                'createdDate': new Date()
            })
                .into(`KasperUsers`)
                .toString();
            await (0, db_core_1.doQuery)(query, [], transactionContext);
            const userId = (await (0, db_core_1.doQuery)('SELECT LAST_INSERT_ID() AS id;', [], transactionContext)).results[0].id;
            const newUser = await this.getUserById(userId, transactionContext);
            (0, assert_1.default)(newUser, 'User was not created successfully');
            return newUser;
        });
    }
    async updateUser(update) {
        return (0, db_core_1.doInTransaction)(async (transactionContext) => {
            const userUpdateFields = (0, db_util_1.removeUndefined)({
                name: update.name,
                userRank: update.userRank,
            });
            if (Object.keys(userUpdateFields).length > 0) {
                await (0, db_core_1.doQuery)('UPDATE kasperUsers SET ? WHERE id = ?;', [userUpdateFields, update.user.id], transactionContext);
            }
            const user = await this.getUserById(update.user.id, transactionContext);
            (0, assert_1.default)(user, 'User does not exist');
            return user;
        });
    }
    async deleteUser(id) {
        await (0, db_core_1.doQuery)('DELETE FROM kasperUsers WHERE id = ?;', [id]);
    }
};
UserDatabase = __decorate([
    error_decorator_1.translateMySQLErrors
], UserDatabase);
exports.UserDatabase = UserDatabase;
//# sourceMappingURL=user_database.js.map