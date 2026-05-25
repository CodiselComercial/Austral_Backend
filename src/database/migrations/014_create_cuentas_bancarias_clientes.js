/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('cuentas_bancarias_clientes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('cliente_id').notNullable().references('id').inTable('clientes');
    table.uuid('asociado_id').nullable().references('id').inTable('asociados');
    table.string('alias', 100).notNullable().defaultTo('Cuenta Principal');
    table.string('numero_cuenta', 50).notNullable().unique();
    table.decimal('saldo_disponible', 12, 2).notNullable().defaultTo(0);
    table.decimal('saldo_bloqueado', 12, 2).notNullable().defaultTo(0);
    table.decimal('limite_credito', 12, 2).notNullable().defaultTo(0);
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('deactivated_at', { useTz: true }).nullable();
    table.uuid('deactivated_by').nullable().references('id').inTable('users');

    table.index('cliente_id');
    table.index('asociado_id');
    table.index('is_active');
    table.index('saldo_disponible');
    table.index(['cliente_id', 'is_active']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('cuentas_bancarias_clientes');
};
