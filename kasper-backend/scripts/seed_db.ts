import * as database from '../src/mysql_database/db_core';

function wait(ms: number) {
  return new Promise((fulfill) => {
    setTimeout(fulfill, ms);
  });
}

async function go() {
  try {
    await database.seed();
  } catch (err) {
    // Maybe the database is still coming up.
    // Try again in 5 seconds.
    await wait(5000);
    await database.seed();
  }
}

go().then(() => {
  return database.close();
}).catch((err) => {
  console.warn(err);
  process.exit(1);
});
