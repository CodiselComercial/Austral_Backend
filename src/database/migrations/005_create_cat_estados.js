/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('cat_estados', (table) => {
    table.increments('id').primary();
    table.string('codigo', 50).notNullable().unique();
    table.string('nombre', 100).notNullable();
    table.text('descripcion').nullable();
    table.string('entidad', 50).notNullable();
    table.integer('orden').notNullable().defaultTo(0);
    table.string('color', 7).nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.index('entidad');
    table.index(['entidad', 'codigo']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('cat_estados');
};
