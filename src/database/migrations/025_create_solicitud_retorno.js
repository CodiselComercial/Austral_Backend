/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('solicitud_retorno', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('solicitud_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('solicitudes')
      .onDelete('CASCADE');
    table.string('metodo_devolucion', 20).notNullable();
    table
      .uuid('cuenta_empresa_austral_id')
      .nullable()
      .references('id')
      .inTable('cuentas_empresa_austral');
    table.string('cuenta_retorno', 50).nullable();
    table.string('clave_retorno', 50).nullable();
    table.string('tarjeta_retorno', 50).nullable();
    table.timestamp('fecha_retorno', { useTz: true }).nullable();
    table.decimal('monto_retorno', 12, 2).nullable();

    table.index('metodo_devolucion');
    table.index('cuenta_empresa_austral_id');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('solicitud_retorno');
};
