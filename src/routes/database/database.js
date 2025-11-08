/**
 * Database route.
 * @module routes/database/database
 */

import du from 'du';

import { Model } from '../../models';
import { formatSize, getRootUrl } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);
const knexfile = require(`${process.cwd()}/knexfile`);

export default [
  {
    op: 'get',
    view: '/@database',
    permission: 'Manage Site',
    client: 'getDatabase',
    handler: async (req, trx) => {
      const fs = require('fs');
      const knex = Model.knex();

      // Get db size for SQLite
      let dbSize = 0;
      try {
        const stats = fs.statSync(config.connection.filename);
        dbSize = stats.size;
      } catch (e) {
        // Database file might not exist yet
      }

      // Return database information
      return {
        json: {
          '@id': `${getRootUrl(req)}/@database`,
          db_name: config.connection.filename,
          db_size: formatSize(dbSize),
          blob_size: formatSize(await du(config.blobsDir)),
        },
      };
    },
  },
];
