import mysql from 'mysql2/promise';

export type QueryResults = {
  results: any[];
  fields?: mysql.FieldPacket[];
};

export type RawSqlString = { toSqlString: () => string };
