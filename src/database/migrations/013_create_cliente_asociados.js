/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('cliente_asociados', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('cliente_id').notNullable().references('id').inTable('clientes');
    table.uuid('asociado_id').notNullable().references('id').inTable('asociados');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('deactivated_at', { useTz: true }).nullable();
    table.uuid('deactivated_by').nullable().references('id').inTable('users');

    table.unique(['cliente_id', 'asociado_id']);
    table.index('cliente_id');
    table.index('asociado_id');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('cliente_asociados');
};
