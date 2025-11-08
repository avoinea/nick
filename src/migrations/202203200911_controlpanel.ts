import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('controlpanel', (table: Knex.TableBuilder) => {
    table.string('id').primary();
    table.string('title');
    table.string('group');
    table.json('schema').notNullable();
    table.json('data').notNullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable('controlpanel');
};
