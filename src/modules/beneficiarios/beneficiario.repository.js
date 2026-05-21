const db = require('../../config/database');
const BeneficiarioModel = require('./beneficiario.model');

class BeneficiarioRepository {
  constructor(database = db) {
    this.db = database;
    this.table = BeneficiarioModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as b`)
      .select(
        'b.id',
        'b.nombre',
        'b.apellido_p',
        'b.apellido_m',
        'b.user_id',
        'u.username',
        'u.email as user_email',
        'b.created_at',
        'b.updated_at',
        'b.is_active',
        'b.deactivated_at',
        'b.deactivated_by',
      )
      .leftJoin('users as u', 'b.user_id', 'u.id');
  }

  findAll({ activeOnly = null } = {}) {
    const query = this.baseSelect().orderBy('b.nombre', 'asc');

    if (activeOnly === true) {
      query.where('b.is_active', true);
    } else if (activeOnly === false) {
      query.where('b.is_active', false);
    }

    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('b.id', id).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(BeneficiarioModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(BeneficiarioModel.columns);
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
      .returning(BeneficiarioModel.columns);
  }
}

module.exports = BeneficiarioRepository;
