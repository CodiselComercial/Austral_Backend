/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  const roles = [
    { name: 'ASOCIADO', description: 'Asociado comercial del sistema' },
    { name: 'TENIENTE', description: 'Teniente operativo del sistema' },
    { name: 'BENEFICIARIO', description: 'Beneficiario de pagos y retornos' },
  ];

  for (const role of roles) {
    const existing = await knex('roles').where({ name: role.name }).first();
    if (!existing) {
      await knex('roles').insert(role);
    }
  }
};
