import fs from 'fs';
import path from 'path';
import mysql, { PoolConnection } from 'mysql2/promise';
import { QueryResults } from './db_types';
import Knex from 'knex';

import { ITransactionContext } from '../types/database_interfaces/transaction_context';

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME || 'kasperdb';
const MYSQL_USERNAME = process.env.MYSQL_USERNAME || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'mysql';
const MYSQL_PORT = Number.parseInt(process.env.MYSQL_PORT || '3306');

const knex = Knex({ client: 'mysql2' });

let pool: mysql.Pool;

class MySQLTransactionContext implements ITransactionContext {
  connection: mysql.PoolConnection | mysql.Connection;
  rollback: boolean = false;

  constructor(connection: mysql.PoolConnection | mysql.Connection) {
    this.connection = connection;
  }

  markForRollback(): void {
    this.rollback = true;
  }
}

function connectionOptions(includeDatabaseName: boolean) {
  return {
    host: MYSQL_HOST,
    database: includeDatabaseName ? MYSQL_DB_NAME : undefined,
    user: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    port: MYSQL_PORT,
    charset: 'utf8mb4',
    multipleStatements: true,
    timezone: 'Z',
  };
}

function ensurePool() {
  if (!pool) {
    pool = mysql.createPool(connectionOptions(true));
  }
}

function getConnection(): Promise<PoolConnection> {
  ensurePool();
  return pool.getConnection();
}

function contextTypeGuard(
  context?: ITransactionContext,
): undefined | MySQLTransactionContext {
  if (context === undefined) {
    return undefined;
  }

  if (
    (context.connection as any).constructor.name === 'PromisePoolConnection'
  ) {
    return context as MySQLTransactionContext;
  }

  if ((context.connection as any).constructor.name === 'PromiseConnection') {
    return context as MySQLTransactionContext;
  }

  throw new Error(
    'Connection is not of the expected type. You mixing databases?',
  );
}

export function knexQueryBuilder() {
  return knex.queryBuilder();
}

export const knexRaw = knex.raw.bind(knex);

export async function doQuery(
  queryStr: string,
  params?: any[],
  context?: ITransactionContext,
): Promise<QueryResults> {
  const mysqlContext = contextTypeGuard(context);

  if (!context) {
    ensurePool();
  }

  const results = await (mysqlContext?.connection || pool).query(
    queryStr,
    params,
  );

  const resultsArray = Array.isArray(results[0]) ? results[0] : [results[0]];

  return { results: resultsArray };
}

export async function seed() {
  const connection = await mysql.createConnection(connectionOptions(false));
  const context = new MySQLTransactionContext(connection);

  const seedCommands = (
    await fs.promises.readFile(path.join(__dirname, 'mysql_seed_t.sql'), 'utf8')
  )
    .replace(/DB_NAME_P/g, MYSQL_DB_NAME);

  await doQuery(seedCommands, [], context);
  await connection.end();
}

export async function drop() {
  if (!MYSQL_DB_NAME.endsWith('Test')) {
    throw new Error('Cannot drop DB. DB name does not end with Test.');
  }

  const connection = await mysql.createConnection(connectionOptions(false));
  const context = new MySQLTransactionContext(connection);

  await doQuery(
    `DROP DATABASE IF EXISTS ${MYSQL_DB_NAME};`,
    undefined,
    context,
  );

  await connection.end();
}

export function close() {
  if (!pool) {
    return Promise.resolve();
  }

  return pool.end();
}

export async function doInTransaction<TReturnType>(
  func: (context: ITransactionContext) => Promise<TReturnType>,
  context?: ITransactionContext,
) {
  let mysqlContext = contextTypeGuard(context);
  let newPoolConnection: mysql.PoolConnection | undefined = undefined;

  if (!mysqlContext) {
    newPoolConnection = await getConnection();
    mysqlContext = new MySQLTransactionContext(newPoolConnection);

    await doQuery(
      'SET TRANSACTION ISOLATION LEVEL READ COMMITTED;',
      [],
      mysqlContext,
    );

    await newPoolConnection.beginTransaction();
  }

  try {
    const result = await func(mysqlContext);

    if (newPoolConnection) {
      if (mysqlContext.rollback) {
        await newPoolConnection.rollback();
      } else {
        await newPoolConnection.commit();
      }
    }

    return result;
  } catch (err) {
    if (newPoolConnection) {
      await newPoolConnection.rollback();
    }

    throw err;
  } finally {
    if (newPoolConnection) {
      newPoolConnection.release();
    }
  }
}
