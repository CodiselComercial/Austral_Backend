const db = require('../../config/database');
const AsociadoModel = require('./asociado.model');

class AsociadoRepository {
  constructor(database = db) {
    this.db = database;
    this.table = AsociadoModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as a`)
      .select(
        'a.id',
        'a.nombre',
        'a.apellido_p',
        'a.apellido_m',
        'a.celular',
        'a.correo',
        'a.comision',
        'a.user_id',
        'u.username',
        'u.email as user_email',
        'a.created_at',
        'a.updated_at',
        'a.is_active',
        'a.deactivated_at',
        'a.deactivated_by',
      )
      .leftJoin('users as u', 'a.user_id', 'u.id');
  }

  findAll({ activeOnly = null } = {}) {
    const query = this.baseSelect().orderBy('a.nombre', 'asc');

    if (activeOnly === true) {
      query.where('a.is_active', true);
    } else if (activeOnly === false) {
      query.where('a.is_active', false);
    }

    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('a.id', id).first();
  }

  findByCelular(celular, excludeId = null) {
    const query = this.db(this.table).where({ celular });
    if (excludeId) query.whereNot({ id: excludeId });
    return query.first();
  }

  findByCorreo(correo, excludeId = null) {
    const query = this.db(this.table).where({ correo });
    if (excludeId) query.whereNot({ id: excludeId });
    return query.first();
  }

  findByUserId(userId) {
    return this.db(this.table).where({ user_id: userId }).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(AsociadoModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(AsociadoModel.columns);
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
      .returning(AsociadoModel.columns);
  }
}

module.exports = AsociadoRepository;
