/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('cuentas_bancarias_beneficiarios', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('beneficiario_id')
      .notNullable()
      .references('id')
      .inTable('beneficiarios')
      .onDelete('CASCADE');
    table.string('banco', 150).notNullable();
    table.string('cuenta', 50).notNullable();
    table.string('clabe', 50).notNullable();
    table.string('tarjeta', 50).nullable();
    table.boolean('es_principal').notNullable().defaultTo(false);
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.boolean('is_active').notNullable().defaultTo(true);

    table.index('beneficiario_id');
    table.index('cuenta');
    table.index('clabe');
    table.index(['beneficiario_id', 'es_principal']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('cuentas_bancarias_beneficiarios');
};
