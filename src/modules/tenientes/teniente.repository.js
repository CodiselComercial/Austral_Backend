const db = require('../../config/database');
const TenienteModel = require('./teniente.model');

class TenienteRepository {
  constructor(database = db) {
    this.db = database;
    this.table = TenienteModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as t`)
      .select(
        't.id',
        't.nombre',
        't.telefono',
        't.user_id',
        'u.username',
        'u.email as user_email',
        't.created_at',
        't.updated_at',
        't.created_by',
        't.is_active',
        't.deactivated_at',
        't.deactivated_by',
      )
      .leftJoin('users as u', 't.user_id', 'u.id');
  }

  findAll({ activeOnly = null } = {}) {
    const query = this.baseSelect().orderBy('t.nombre', 'asc');

    if (activeOnly === true) {
      query.where('t.is_active', true);
    } else if (activeOnly === false) {
      query.where('t.is_active', false);
    }

    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('t.id', id).first();
  }

  findByTelefono(telefono, excludeId = null) {
    const query = this.db(this.table).where({ telefono });
    if (excludeId) query.whereNot({ id: excludeId });
    return query.first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(TenienteModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(TenienteModel.columns);
  }

  deactivate(id, deactivatedBy, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id, is_active: true })
      .update({
        is_active: false,
        deactivated_at: this.db.fn.now(),
        deactivated_by: deactivatedBy,
        updated_at: this.db.fn.now(),
      })
      .returning(TenienteModel.columns);
  }
}

module.exports = TenienteRepository;
