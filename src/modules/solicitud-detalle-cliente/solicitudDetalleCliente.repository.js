const db = require('../../config/database');
const SolicitudDetalleClienteModel = require('./solicitudDetalleCliente.model');

class SolicitudDetalleClienteRepository {
  constructor(database = db) {
    this.db = database;
    this.table = SolicitudDetalleClienteModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as sdc`).select(
      'sdc.id',
      'sdc.solicitud_id',
      'sdc.empresa_cliente',
      'sdc.nombre_contacto',
      'sdc.apellido_p_contacto',
      'sdc.apellido_m_contacto',
      'sdc.telefono',
      'sdc.email',
      'sdc.created_at',
      'sdc.updated_at',
    );
  }

  findAll({ solicitudId = null } = {}) {
    const query = this.baseSelect().orderBy('sdc.created_at', 'desc');
    if (solicitudId) query.where('sdc.solicitud_id', solicitudId);
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('sdc.id', id).first();
  }

  findBySolicitudId(solicitudId, trx = null) {
    return this.baseSelect(trx).where('sdc.solicitud_id', solicitudId).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(SolicitudDetalleClienteModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(SolicitudDetalleClienteModel.columns);
  }
}

module.exports = SolicitudDetalleClienteRepository;
