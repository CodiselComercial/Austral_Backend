/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('clientes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('empresa', 150).notNullable();
    table.string('nombre_contacto', 150).notNullable();
    table.string('apellido_p_contacto', 150).notNullable();
    table.string('apellido_m_contacto', 150).nullable();
    table.string('telefono1', 20).notNullable();
    table.string('telefono2', 20).nullable();
    table.string('correo1', 150).notNullable();
    table.string('correo2', 150).nullable();
    table.string('calle', 150).notNullable();
    table.string('num_exterior', 20).notNullable();
    table.string('num_interior', 20).nullable();
    table.string('colonia', 150).nullable();
    table.string('municipio', 150).nullable();
    table.string('ciudad', 150).notNullable();
    table.string('estado', 150).notNullable();
    table.string('pais', 100).notNullable().defaultTo('México');
    table.string('codigo_postal', 10).notNullable();
    table.string('rfc', 13).nullable();
    table.decimal('comision', 5, 2).notNullable().defaultTo(0);
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('deactivated_at', { useTz: true }).nullable();
    table.uuid('deactivated_by').nullable().references('id').inTable('users');

    table.index('empresa');
    table.index('ciudad');
    table.index('estado');
    table.index(['empresa', 'ciudad']);
    table.index('correo1');
    table.index('telefono1');
    table.index('rfc');
    table.index('municipio');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('clientes');
};
