/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  await knex('cat_estados').del();

  await knex('cat_estados').insert([
    {
      codigo: 'PENDIENTE',
      nombre: 'Pendiente',
      descripcion: 'Estado pendiente de revisión o acción',
      entidad: 'GENERAL',
      orden: 1,
      color: '#FFA500',
    },
    {
      codigo: 'APROBADO',
      nombre: 'Aprobado',
      descripcion: 'Estado aprobado',
      entidad: 'GENERAL',
      orden: 2,
      color: '#28A745',
    },
    {
      codigo: 'RECHAZADO',
      nombre: 'Rechazado',
      descripcion: 'Estado rechazado',
      entidad: 'GENERAL',
      orden: 3,
      color: '#DC3545',
    },
    {
      codigo: 'PAGADO',
      nombre: 'Pagado',
      descripcion: 'Estado pagado',
      entidad: 'GENERAL',
      orden: 4,
      color: '#007BFF',
    },
    {
      codigo: 'CANCELADO',
      nombre: 'Cancelado',
      descripcion: 'Estado cancelado',
      entidad: 'GENERAL',
      orden: 5,
      color: '#6C757D',
    },
  ]);
};
