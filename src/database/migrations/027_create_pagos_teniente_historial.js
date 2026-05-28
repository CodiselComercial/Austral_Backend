/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('pagos_teniente_historial', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('pago_teniente_id')
      .notNullable()
      .references('id')
      .inTable('pagos_teniente')
      .onDelete('CASCADE');
    table.integer('estado_anterior_id').nullable().references('id').inTable('cat_estados');
    table.integer('estado_nuevo_id').notNullable().references('id').inTable('cat_estados');
    table.string('evento', 50).nullable();
    table.string('codigo_proporcionado', 10).nullable();
    table.boolean('es_correcto').nullable();
    table.uuid('cambiado_por').notNullable().references('id').inTable('users');
    table.timestamp('cambiado_en', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.string('ip_origen', 45).nullable();
    table.text('user_agent').nullable();
    table.jsonb('detalles').nullable();

    table.index('pago_teniente_id');
    table.index('estado_nuevo_id');
    table.index('cambiado_en');
    table.index('evento');
    table.index(['pago_teniente_id', 'cambiado_en']);
    table.index('cambiado_por');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('pagos_teniente_historial');
};
