const db = require('../../config/database');
const SolicitudDepositoModel = require('./solicitudDeposito.model');

class SolicitudDepositoRepository {
  constructor(database = db) {
    this.db = database;
    this.table = SolicitudDepositoModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as sd`)
      .select(
        'sd.id',
        'sd.solicitud_id',
        'sd.cuenta_empresa_austral_id',
        'cea.nombre_cuenta as cuenta_empresa_austral_nombre',
        'cea.banco as cuenta_empresa_austral_banco',
        'sd.cuenta_deposito',
        'sd.monto_depositado',
        'sd.fecha_deposito',
        'sd.referencia_deposito',
        'sd.ficha_url',
        'sd.comentarios',
      )
      .leftJoin('cuentas_empresa_austral as cea', 'sd.cuenta_empresa_austral_id', 'cea.id');
  }

  findAll({ solicitudId = null } = {}) {
    const query = this.baseSelect().orderBy('sd.fecha_deposito', 'desc');
    if (solicitudId) query.where('sd.solicitud_id', solicitudId);
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('sd.id', id).first();
  }

  findBySolicitudId(solicitudId, trx = null) {
    return this.baseSelect(trx).where('sd.solicitud_id', solicitudId).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(SolicitudDepositoModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.where({ id }).update(data).returning(SolicitudDepositoModel.columns);
  }
}

module.exports = SolicitudDepositoRepository;
