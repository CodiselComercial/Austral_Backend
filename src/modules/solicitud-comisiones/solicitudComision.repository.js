const db = require('../../config/database');
const SolicitudComisionModel = require('./solicitudComision.model');

class SolicitudComisionRepository {
  constructor(database = db) {
    this.db = database;
    this.table = SolicitudComisionModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as sc`).select(
      'sc.id',
      'sc.solicitud_id',
      'sc.comision_asociado',
      'sc.comision_cliente',
      'sc.monto_comision_asociado',
      'sc.monto_comision_cliente',
      'sc.pagado_asociado',
      'sc.pagado_cliente',
    );
  }

  findAll({ solicitudId = null } = {}) {
    const query = this.baseSelect().orderBy('sc.solicitud_id', 'desc');
    if (solicitudId) query.where('sc.solicitud_id', solicitudId);
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('sc.id', id).first();
  }

  findBySolicitudId(solicitudId, trx = null) {
    return this.baseSelect(trx).where('sc.solicitud_id', solicitudId).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(SolicitudComisionModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.where({ id }).update(data).returning(SolicitudComisionModel.columns);
  }
}

module.exports = SolicitudComisionRepository;
