"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doInTransaction = exports.close = exports.drop = exports.seed = exports.doQuery = exports.knexRaw = exports.knexQueryBuilder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promise_1 = __importDefault(require("mysql2/promise"));
const knex_1 = __importDefault(require("knex"));
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME || 'kasperdb';
const MYSQL_USERNAME = process.env.MYSQL_USERNAME || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'mysql';
const MYSQL_PORT = Number.parseInt(process.env.MYSQL_PORT || '3306');
const knex = (0, knex_1.default)({ client: 'mysql2' });
let pool;
class MySQLTransactionContext {
    constructor(connection) {
        this.rollback = false;
        this.connection = connection;
    }
    markForRollback() {
        this.rollback = true;
    }
}
function connectionOptions(includeDatabaseName) {
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
        pool = promise_1.default.createPool(connectionOptions(true));
    }
}
function getConnection() {
    ensurePool();
    return pool.getConnection();
}
function contextTypeGuard(context) {
    if (context === undefined) {
        return undefined;
    }
    if (context.connection.constructor.name === 'PromisePoolConnection') {
        return context;
    }
    if (context.connection.constructor.name === 'PromiseConnection') {
        return context;
    }
    throw new Error('Connection is not of the expected type. You mixing databases?');
}
function knexQueryBuilder() {
    return knex.queryBuilder();
}
exports.knexQueryBuilder = knexQueryBuilder;
exports.knexRaw = knex.raw.bind(knex);
async function doQuery(queryStr, params, context) {
    const mysqlContext = contextTypeGuard(context);
    if (!context) {
        ensurePool();
    }
    const results = await (mysqlContext?.connection || pool).query(queryStr, params);
    const resultsArray = Array.isArray(results[0]) ? results[0] : [results[0]];
    return { results: resultsArray };
}
exports.doQuery = doQuery;
async function seed() {
    const connection = await promise_1.default.createConnection(connectionOptions(false));
    const context = new MySQLTransactionContext(connection);
    const seedCommands = (await fs_1.default.promises.readFile(path_1.default.join(__dirname, 'mysql_seed_t.sql'), 'utf8'))
        .replace(/DB_NAME_P/g, MYSQL_DB_NAME);
    await doQuery(seedCommands, [], context);
    await connection.end();
}
exports.seed = seed;
async function drop() {
    if (!MYSQL_DB_NAME.endsWith('Test')) {
        throw new Error('Cannot drop DB. DB name does not end with Test.');
    }
    const connection = await promise_1.default.createConnection(connectionOptions(false));
    const context = new MySQLTransactionContext(connection);
    await doQuery(`DROP DATABASE IF EXISTS ${MYSQL_DB_NAME};`, undefined, context);
    await connection.end();
}
exports.drop = drop;
function close() {
    if (!pool) {
        return Promise.resolve();
    }
    return pool.end();
}
exports.close = close;
async function doInTransaction(func, context) {
    let mysqlContext = contextTypeGuard(context);
    let newPoolConnection = undefined;
    if (!mysqlContext) {
        newPoolConnection = await getConnection();
        mysqlContext = new MySQLTransactionContext(newPoolConnection);
        await doQuery('SET TRANSACTION ISOLATION LEVEL READ COMMITTED;', [], mysqlContext);
        await newPoolConnection.beginTransaction();
    }
    try {
        const result = await func(mysqlContext);
        if (newPoolConnection) {
            if (mysqlContext.rollback) {
                await newPoolConnection.rollback();
            }
            else {
                await newPoolConnection.commit();
            }
        }
        return result;
    }
    catch (err) {
        if (newPoolConnection) {
            await newPoolConnection.rollback();
        }
        throw err;
    }
    finally {
        if (newPoolConnection) {
            newPoolConnection.release();
        }
    }
}
exports.doInTransaction = doInTransaction;
//# sourceMappingURL=db_core.js.map