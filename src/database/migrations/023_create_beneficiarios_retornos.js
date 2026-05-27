/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('beneficiarios_retornos', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('solicitud_id')
      .notNullable()
      .references('id')
      .inTable('solicitudes')
      .onDelete('CASCADE');
    table.uuid('beneficiario_id').nullable().references('id').inTable('beneficiarios');
    table.string('nombre_beneficiario', 150).nullable();
    table.string('apellido_p_beneficiario', 150).nullable();
    table.string('apellido_m_beneficiario', 150).nullable();
    table.decimal('monto_beneficiario', 12, 2).notNullable();
    table
      .uuid('cuenta_bancaria_beneficiario_id')
      .nullable()
      .references('id')
      .inTable('cuentas_bancarias_beneficiarios');
    table.string('metodo_pago', 20).notNullable();
    table.decimal('monto_pagado', 12, 2).nullable();
    table.text('comprobante_url').nullable();
    table.timestamp('fecha_pago', { useTz: true }).nullable();
    table
      .integer('estado_pago_id')
      .notNullable()
      .defaultTo(1)
      .references('id')
      .inTable('cat_estados');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.index('solicitud_id');
    table.index('beneficiario_id');
    table.index('cuenta_bancaria_beneficiario_id');
    table.index('metodo_pago');
    table.index('estado_pago_id');
    table.index('fecha_pago');
    table.index(['solicitud_id', 'beneficiario_id']);
    table.index(['estado_pago_id', 'fecha_pago']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('beneficiarios_retornos');
};
