var path = require('path');
var { config } = require('./config');

const knexSettings = {
  client: 'better-sqlite3',
  connection: config.connection,
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, './src/migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.resolve(__dirname, './src/seeds'),
  },
};

module.exports = {
  development: knexSettings,
  production: knexSettings,
};
