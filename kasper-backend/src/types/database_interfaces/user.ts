import { KasperUser } from '../user/user';
import { KasperUserUpdate } from '../user/user_update';

export interface IUserDatabase {

  getUserById(id: number): Promise<KasperUser | undefined>;
  getAllUsers(): Promise<KasperUser[] | undefined>;
  createUser(userPost: KasperUser): Promise<KasperUser | undefined>;
  updateUser(update: KasperUserUpdate): Promise<KasperUser>;
  deleteUser(id: number): Promise<void>;
}