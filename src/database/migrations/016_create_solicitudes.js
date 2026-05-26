/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('solicitudes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('cliente_id').nullable().references('id').inTable('clientes');
    table.uuid('empresa_austral_id').nullable().references('id').inTable('empresas_austral');
    table.uuid('asociado_id').nullable().references('id').inTable('asociados');
    table.uuid('beneficiario_id').nullable().references('id').inTable('beneficiarios');
    table
      .integer('estado_id')
      .notNullable()
      .defaultTo(1)
      .references('id')
      .inTable('cat_estados');
    table.string('etapa_actual', 50).notNullable().defaultTo('registro');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.uuid('updated_by').nullable().references('id').inTable('users');
    table.timestamp('deactivated_at', { useTz: true }).nullable();
    table.uuid('deactivated_by').nullable().references('id').inTable('users');

    table.index('cliente_id');
    table.index('empresa_austral_id');
    table.index('asociado_id');
    table.index('beneficiario_id');
    table.index('estado_id');
    table.index('created_by');
    table.index(['estado_id', 'created_at']);
    table.index(['asociado_id', 'estado_id']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('solicitudes');
};
