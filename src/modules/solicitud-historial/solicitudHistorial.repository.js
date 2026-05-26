const db = require('../../config/database');
const SolicitudHistorialModel = require('./solicitudHistorial.model');

class SolicitudHistorialRepository {
  constructor(database = db) {
    this.db = database;
    this.table = SolicitudHistorialModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as sh`)
      .select(
        'sh.id',
        'sh.solicitud_id',
        'sh.estado_anterior_id',
        'ea.codigo as estado_anterior_codigo',
        'ea.nombre as estado_anterior_nombre',
        'sh.estado_nuevo_id',
        'en.codigo as estado_nuevo_codigo',
        'en.nombre as estado_nuevo_nombre',
        'sh.cambiado_por',
        'u.username as cambiado_por_username',
        'sh.cambiado_en',
        'sh.motivo',
        'sh.ip_address',
        'sh.user_agent',
      )
      .leftJoin('cat_estados as ea', 'sh.estado_anterior_id', 'ea.id')
      .leftJoin('cat_estados as en', 'sh.estado_nuevo_id', 'en.id')
      .leftJoin('users as u', 'sh.cambiado_por', 'u.id');
  }

  findAll({ solicitudId = null } = {}) {
    const query = this.baseSelect().orderBy('sh.cambiado_en', 'desc');
    if (solicitudId) query.where('sh.solicitud_id', solicitudId);
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('sh.id', id).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(SolicitudHistorialModel.columns);
  }
}

module.exports = SolicitudHistorialRepository;
