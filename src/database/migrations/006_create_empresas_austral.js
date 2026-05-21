/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('empresas_austral', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nombre', 150).notNullable().unique();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('deactivated_at', { useTz: true }).nullable();
    table.uuid('deactivated_by').nullable().references('id').inTable('users');

    table.index('created_by');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('empresas_austral');
};
