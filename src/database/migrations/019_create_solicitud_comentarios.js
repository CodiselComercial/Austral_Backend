/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('solicitud_comentarios', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('solicitud_id')
      .notNullable()
      .references('id')
      .inTable('solicitudes')
      .onDelete('CASCADE');
    table.uuid('escrito_por').notNullable().references('id').inTable('users');
    table.string('rol', 20).notNullable();
    table.text('comentario').notNullable();
    table.timestamp('fecha_comentario', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.index('solicitud_id');
    table.index('escrito_por');
    table.index('rol');
    table.index('fecha_comentario');
    table.index(['solicitud_id', 'fecha_comentario']);
    table.index(['rol', 'fecha_comentario']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('solicitud_comentarios');
};
