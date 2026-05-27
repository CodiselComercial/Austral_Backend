/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('pagos_beneficiarios', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('solicitud_id')
      .notNullable()
      .references('id')
      .inTable('solicitudes')
      .onDelete('CASCADE');
    table.uuid('beneficiario_id').notNullable().references('id').inTable('beneficiarios');
    table
      .uuid('cuenta_empresa_austral_id')
      .notNullable()
      .references('id')
      .inTable('cuentas_empresa_austral');
    table.decimal('monto_pagado', 12, 2).notNullable();
    table.text('comprobante_url').nullable();
    table.timestamp('fecha_pago', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.uuid('pagado_por').notNullable().references('id').inTable('users');
    table
      .integer('estado_id')
      .notNullable()
      .defaultTo(1)
      .references('id')
      .inTable('cat_estados');

    table.unique(['solicitud_id', 'beneficiario_id']);
    table.index('solicitud_id');
    table.index('beneficiario_id');
    table.index('cuenta_empresa_austral_id');
    table.index('estado_id');
    table.index('fecha_pago');
    table.index('pagado_por');
    table.index(['estado_id', 'fecha_pago']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('pagos_beneficiarios');
};
