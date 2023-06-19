import knex from 'knex';

const knexConfig = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

export const createDatabase = async (name) => {
  try {
    await knexConfig.raw(`CREATE DATABASE "${name}";`);
    return true;
  } catch (error) {
    console.error(`Error :`, error);
    return false;
  }
};

export const dropDatabase = async (name) => {
  try {
    await knexConfig.raw(`DROP DATABASE "${name}";`);
    return true;
  } catch (error) {
    console.error(`Error :`, error);
    return false;
  }
};

export const isReservedWord = async (dbName) => {
  const result = await knexConfig.raw(
    'SELECT EXISTS (SELECT 1 FROM pg_catalog.pg_get_keywords() WHERE word = ?)',
    [dbName]
  );
  return result.rows[0].exists;
};

export const checkDatabaseExists = async (dbName) => {
  const result = await knexConfig.raw(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`
  );
  return result.rowCount > 0;
};
