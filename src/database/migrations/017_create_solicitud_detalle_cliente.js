/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('solicitud_detalle_cliente', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('solicitud_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('solicitudes')
      .onDelete('CASCADE');
    table.string('empresa_cliente', 150).nullable();
    table.string('nombre_contacto', 150).nullable();
    table.string('apellido_p_contacto', 150).nullable();
    table.string('apellido_m_contacto', 150).nullable();
    table.string('telefono', 20).nullable();
    table.string('email', 150).nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('solicitud_detalle_cliente');
};
