import { isReservedWord } from './knex.config';

export const checkLengthOfDatabaseName = (dbName) => {
  const maxLength = 63; // Maximum length limit for database names
  if (dbName.length > maxLength) {
    return true;
  }
  return false;
};

export const checkForReservedWordOfDatabase = async (dbName) => {
  //Checks name holds any reserved keywords of database
  if (await isReservedWord(dbName)) {
    return true;
  }
  return false;
};
