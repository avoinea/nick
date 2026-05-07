/**
 * Form migration.
 * @module migration/form
 */

// Type imports
import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('form', (table: Knex.TableBuilder) => {
    table.uuid('uuid').primary();
    table
      .uuid('document')
      .notNullable()
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.uuid('block');
    table.jsonb('data').notNullable();
    table.dateTime('created');
    table.boolean('confirm');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable('form');
};
