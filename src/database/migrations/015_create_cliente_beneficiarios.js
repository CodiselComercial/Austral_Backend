/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('cliente_beneficiarios', (table) => {
    table.increments('id').primary();
    table.uuid('cliente_id').notNullable().references('id').inTable('clientes');
    table.uuid('beneficiario_id').notNullable().references('id').inTable('beneficiarios');
    table.timestamp('assigned_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.unique(['cliente_id', 'beneficiario_id']);
    table.index('cliente_id');
    table.index('beneficiario_id');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('cliente_beneficiarios');
};
