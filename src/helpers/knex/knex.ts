/**
 * Knex setup.
 * @module knex
 */

import knexPkg, { Knex } from 'knex';

const { config } = require(`${process.cwd()}/config`);

// Initialize knex with proper types
export const knex = knexPkg({
  client: 'better-sqlite3',
  connection: config.connection,
  useNullAsDefault: true,
  pool: {
    min: 0,
    max: 10,
    acquireTimeoutMillis: 30000,
    afterCreate: (conn: any, cb: any) => {
      // Enable WAL mode for better concurrency
      conn.pragma('journal_mode = WAL');
      // Set a busy timeout
      conn.pragma('busy_timeout = 30000');
      cb(null, conn);
    }
  },
});

// Debug
knex.on('query', (query: Knex.QueryBuilder) => {
  // console.log(query);
});

/**
 * Get database version
 * @method getDatabaseVersion
 * @param {Transaction} trx Transaction object
 * @returns {Promise<string>} Database version.
 */
export async function getDatabaseVersion(
  trx: Knex.Transaction,
): Promise<string> {
  const result = await knex.raw('SELECT sqlite_version() as version').transacting(trx);
  return result[0].version;
}

/**
 * @deprecated Use getDatabaseVersion instead
 */
export const getPostgresVersion = getDatabaseVersion;
