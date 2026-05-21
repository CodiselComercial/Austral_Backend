/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('asociados', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nombre', 150).notNullable();
    table.string('apellido_p', 150).notNullable();
    table.string('apellido_m', 150).nullable();
    table.string('celular', 20).notNullable().unique();
    table.string('correo', 150).notNullable().unique();
    table.decimal('comision', 5, 2).notNullable();
    table.uuid('user_id').notNullable().unique().references('id').inTable('users');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('deactivated_at', { useTz: true }).nullable();
    table.uuid('deactivated_by').nullable().references('id').inTable('users');

    table.index('nombre');
    table.index('apellido_p');
    table.index('comision');
    table.index(['nombre', 'apellido_p', 'apellido_m']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('asociados');
};
