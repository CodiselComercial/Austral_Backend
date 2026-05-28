const db = require('../../config/database');
const PagoTenienteHistorialModel = require('./pagoTenienteHistorial.model');

class PagoTenienteHistorialRepository {
  constructor(database = db) {
    this.db = database;
    this.table = PagoTenienteHistorialModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as pth`)
      .select(
        'pth.id',
        'pth.pago_teniente_id',
        'pth.estado_anterior_id',
        'ea.codigo as estado_anterior_codigo',
        'ea.nombre as estado_anterior_nombre',
        'pth.estado_nuevo_id',
        'en.codigo as estado_nuevo_codigo',
        'en.nombre as estado_nuevo_nombre',
        'pth.evento',
        'pth.codigo_proporcionado',
        'pth.es_correcto',
        'pth.cambiado_por',
        'u.username as cambiado_por_username',
        'pth.cambiado_en',
        'pth.ip_origen',
        'pth.user_agent',
        'pth.detalles',
      )
      .leftJoin('cat_estados as ea', 'pth.estado_anterior_id', 'ea.id')
      .leftJoin('cat_estados as en', 'pth.estado_nuevo_id', 'en.id')
      .leftJoin('users as u', 'pth.cambiado_por', 'u.id');
  }

  findAll({ pagoTenienteId = null, evento = null } = {}) {
    const query = this.baseSelect().orderBy('pth.cambiado_en', 'desc');
    if (pagoTenienteId) query.where('pth.pago_teniente_id', pagoTenienteId);
    if (evento) query.where('pth.evento', evento);
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('pth.id', id).first();
  }

  findLastValidacionExitosa(pagoTenienteId, sinceDate, trx = null) {
    const conn = trx || this.db;
    let query = conn(this.table)
      .where({
        pago_teniente_id: pagoTenienteId,
        evento: 'VALIDACION_CODIGO',
        es_correcto: true,
      })
      .orderBy('cambiado_en', 'desc');

    if (sinceDate) {
      query = query.where('cambiado_en', '>=', sinceDate);
    }

    return query.first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(PagoTenienteHistorialModel.columns);
  }
}

module.exports = PagoTenienteHistorialRepository;
