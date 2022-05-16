import { ITransactionContext } from '../types/database_interfaces/transaction_context';
import { IUserDatabase } from '../types/database_interfaces/user';
import { KasperUser } from '../types/user/user';
import { doInTransaction, doQuery, knexQueryBuilder } from './db_core';
import { translateMySQLErrors } from './error_decorator';
import assert from 'assert';
import { KasperUserUpdate } from '../types/user/user_update';
import { removeUndefined } from './db_util';

@translateMySQLErrors
export class UserDatabase implements IUserDatabase {
    async getUserById(id: number, context?: ITransactionContext): Promise<KasperUser | undefined> {
        const query = knexQueryBuilder()
      .select('*')
      .from(`KasperUsers`)
      .whereRaw(`id=?`)
      .toString();

        const result = await doQuery(query, [id], context);
        return result.results[0];
    }

    async getAllUsers(): Promise<KasperUser[] | undefined> {
        const query = knexQueryBuilder()
        .select('*')
        .from(`KasperUsers`)
        .orderByRaw(`userRank`)
        .toString();

        const result = await doQuery(query);
        return result.results;
    }

    async getMaxRank(): Promise<number> {
        const query = `select Max(userRank) AS UserRank from KasperUsers`;

        const result = await doQuery(query);
        return result.results[0].UserRank;
    }

    createUser(userPost: KasperUser): Promise<KasperUser | undefined> {

        return doInTransaction(async (transactionContext) => {
        const newRank = (await this.getMaxRank()) + 1;
        const query = knexQueryBuilder()
            .insert({
                'name': userPost.name,
                'UserRank': newRank,
                'createdDate': new Date()
            })
            .into(`KasperUsers`)
            .toString();

        await doQuery(query, [], transactionContext);

        const userId = (
            await doQuery('SELECT LAST_INSERT_ID() AS id;', [], transactionContext)
        ).results[0].id;

        const newUser = await this.getUserById(
            userId,
            transactionContext,
        );
        assert(newUser, 'User was not created successfully');

        return newUser;
        });
  }

  async updateUser(update: KasperUserUpdate): Promise<KasperUser> {
        return doInTransaction(async (transactionContext) => {
             const userUpdateFields = removeUndefined({
                name: update.name,
                userRank: update.userRank,
            });

            if (Object.keys(userUpdateFields).length > 0) {
                await doQuery(
                'UPDATE kasperUsers SET ? WHERE id = ?;',
                [userUpdateFields, update.user.id],
                transactionContext,
                );
            }

            const user = await this.getUserById(
                update.user.id,
                transactionContext,
            );
            assert(user, 'User does not exist');

            return user;
        });
  }

  async deleteUser(id: number): Promise<void> {
    await doQuery('DELETE FROM kasperUsers WHERE id = ?;', [id]);
  }
}