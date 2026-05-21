const db = require('../../config/database');
const EmpresaInternaModel = require('./empresaInterna.model');

class EmpresaInternaRepository {
  constructor(database = db) {
    this.db = database;
    this.table = EmpresaInternaModel.TABLE_NAME;
  }

  findAll({ activeOnly = null } = {}) {
    const query = this.db(this.table)
      .select(EmpresaInternaModel.columns)
      .orderBy('nombre', 'asc');

    if (activeOnly === true) {
      query.where({ is_active: true });
    } else if (activeOnly === false) {
      query.where({ is_active: false });
    }

    return query;
  }

  findById(id) {
    return this.db(this.table).where({ id }).first();
  }

  findByNombre(nombre) {
    return this.db(this.table).where({ nombre }).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(EmpresaInternaModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(EmpresaInternaModel.columns);
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
      .returning(EmpresaInternaModel.columns);
  }
}

module.exports = EmpresaInternaRepository;
