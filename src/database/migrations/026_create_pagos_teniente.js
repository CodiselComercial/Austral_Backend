/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('pagos_teniente', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('pago_beneficiario_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('pagos_beneficiarios');
    table.uuid('beneficiario_id').notNullable().references('id').inTable('beneficiarios');
    table
      .uuid('solicitud_id')
      .notNullable()
      .references('id')
      .inTable('solicitudes')
      .onDelete('CASCADE');
    table.string('codigo_verificacion', 10).notNullable();
    table.integer('intentos_fallidos').notNullable().defaultTo(0);
    table.integer('max_intentos').notNullable().defaultTo(3);
    table.timestamp('bloqueado_hasta', { useTz: true }).nullable();
    table.timestamp('ultimo_intento_fallido', { useTz: true }).nullable();
    table.uuid('entregado_por').notNullable().references('id').inTable('users');
    table.string('receptor_tipo', 20).notNullable().defaultTo('beneficiario');
    table.string('receptor_nombre', 150).nullable();
    table.string('identificacion_receptor', 50).nullable();
    table.text('receptor_firma_url').nullable();
    table.text('foto_comprobante_url').nullable();
    table.decimal('latitud', 10, 8).nullable();
    table.decimal('longitud', 11, 8).nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.uuid('updated_by').nullable().references('id').inTable('users');
    table
      .integer('estado_id')
      .notNullable()
      .defaultTo(1)
      .references('id')
      .inTable('cat_estados');
    table.timestamp('deactivated_at', { useTz: true }).nullable();
    table.uuid('deactivated_by').nullable().references('id').inTable('users');
    table.text('observaciones').nullable();

    table.index('solicitud_id');
    table.index('beneficiario_id');
    table.index('entregado_por');
    table.index('estado_id');
    table.index('codigo_verificacion');
    table.index('created_by');
    table.index(['estado_id', 'created_at']);
    table.index(['solicitud_id', 'estado_id']);
    table.index(['beneficiario_id', 'estado_id']);
    table.index('bloqueado_hasta');
    table.index('receptor_tipo');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('pagos_teniente');
};
