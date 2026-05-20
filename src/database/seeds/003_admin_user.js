const bcrypt = require('bcrypt');

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  const adminRole = await knex('roles').where({ name: 'ADMIN' }).first();
  if (!adminRole) {
    return;
  }

  const existingAdmin = await knex('users').where({ username: 'admin' }).first();
  if (existingAdmin) {
    return;
  }

  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const passwordHash = await bcrypt.hash(password, 12);

  const [adminUser] = await knex('users')
    .insert({
      username: 'admin',
      email: 'admin@austral.com',
      password_hash: passwordHash,
      is_active: true,
    })
    .returning(['id']);

  await knex('user_roles').insert({
    user_id: adminUser.id,
    role_id: adminRole.id,
  });
};
