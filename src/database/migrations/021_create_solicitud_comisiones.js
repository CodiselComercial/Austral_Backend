/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('solicitud_comisiones', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('solicitud_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('solicitudes')
      .onDelete('CASCADE');
    table.decimal('comision_asociado', 5, 2).notNullable().defaultTo(0);
    table.decimal('comision_cliente', 5, 2).notNullable().defaultTo(0);
    table.decimal('monto_comision_asociado', 12, 2).nullable();
    table.decimal('monto_comision_cliente', 12, 2).nullable();
    table.boolean('pagado_asociado').notNullable().defaultTo(false);
    table.boolean('pagado_cliente').notNullable().defaultTo(false);

    table.index('pagado_asociado');
    table.index('pagado_cliente');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('solicitud_comisiones');
};
