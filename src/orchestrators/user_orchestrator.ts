import { IUserDatabase } from "../types/database_interfaces/user";
import { KasperUser } from "../types/user/user";
import { KasperUserUpdate } from "../types/user/user_update";

export class UserOrchestrator {
  private database: IUserDatabase;

  constructor(database: IUserDatabase) {
    this.database = database;
  }

  async getUserById(id: number) {
    const user = await this.database.getUserById(id);
    return user;
  }

  async getAllUsers() {
    const user = await this.database.getAllUsers();
    return user;
  }

  async createUser(
    creation: KasperUser,
  ) {
    // Authorizations to be applied here

    const newUser = await this.database.createUser(creation);
    return newUser;
  }

  async updateUser(update: KasperUserUpdate) {
    const updatedUser = await this.database.updateUser(update);
    return updatedUser;
  }

  async deleteUser(id: number) {
    await this.database.deleteUser(id);
  }
}