/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('cuentas_empresa_austral', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('nombre_cuenta', 150).notNullable();
    table
      .uuid('empresa_austral_id')
      .notNullable()
      .references('id')
      .inTable('empresas_austral');
    table.string('banco', 100).notNullable();
    table.string('numero_clabe', 50).notNullable().unique();
    table.string('clave_interbancaria', 50).notNullable().unique();
    table.string('tarjeta', 50).nullable().unique();
    table.decimal('saldo_actual', 14, 2).notNullable().defaultTo(0);
    table.decimal('saldo_disponible', 14, 2).notNullable().defaultTo(0);
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('deactivated_at', { useTz: true }).nullable();
    table.uuid('deactivated_by').nullable().references('id').inTable('users');

    table.index('nombre_cuenta');
    table.index('empresa_austral_id');
    table.index('saldo_actual');
    table.index(['empresa_austral_id', 'is_active']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('cuentas_empresa_austral');
};
