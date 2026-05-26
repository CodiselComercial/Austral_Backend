/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('solicitud_historial', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('solicitud_id')
      .notNullable()
      .references('id')
      .inTable('solicitudes')
      .onDelete('CASCADE');
    table.integer('estado_anterior_id').nullable().references('id').inTable('cat_estados');
    table.integer('estado_nuevo_id').notNullable().references('id').inTable('cat_estados');
    table.uuid('cambiado_por').notNullable().references('id').inTable('users');
    table.timestamp('cambiado_en', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.text('motivo').nullable();
    table.string('ip_address', 45).nullable();
    table.text('user_agent').nullable();

    table.index('solicitud_id');
    table.index('estado_nuevo_id');
    table.index('cambiado_en');
    table.index(['solicitud_id', 'cambiado_en']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('solicitud_historial');
};
