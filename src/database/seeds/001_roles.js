/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  await knex('roles').del();

  await knex('roles').insert([
    {
      name: 'ADMIN',
      description: 'Administrador del sistema con acceso total',
    },
    {
      name: 'USER',
      description: 'Usuario estándar del sistema',
    },
  ]);
};
