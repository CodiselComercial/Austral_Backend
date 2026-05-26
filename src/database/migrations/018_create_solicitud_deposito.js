/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('solicitud_deposito', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('solicitud_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('solicitudes')
      .onDelete('CASCADE');
    table
      .uuid('cuenta_empresa_austral_id')
      .notNullable()
      .references('id')
      .inTable('cuentas_empresa_austral');
    table.string('cuenta_deposito', 50).nullable();
    table.decimal('monto_depositado', 12, 2).notNullable();
    table.timestamp('fecha_deposito', { useTz: true }).notNullable();
    table.string('referencia_deposito', 100).nullable();
    table.text('ficha_url').nullable();
    table.text('comentarios').nullable();

    table.index('cuenta_empresa_austral_id');
    table.index('fecha_deposito');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('solicitud_deposito');
};
