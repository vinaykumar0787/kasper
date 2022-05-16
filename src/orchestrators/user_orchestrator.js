"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrchestrator = void 0;
class UserOrchestrator {
    constructor(database) {
        this.database = database;
    }
    async getUserById(id) {
        const user = await this.database.getUserById(id);
        return user;
    }
    async getAllUsers() {
        const user = await this.database.getAllUsers();
        return user;
    }
    async createUser(creation) {
        // Authorizations to be applied here
        const newUser = await this.database.createUser(creation);
        return newUser;
    }
    async updateUser(update) {
        const updatedUser = await this.database.updateUser(update);
        return updatedUser;
    }
    async deleteUser(id) {
        await this.database.deleteUser(id);
    }
}
exports.UserOrchestrator = UserOrchestrator;
//# sourceMappingURL=user_orchestrator.js.map