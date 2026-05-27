const db = require('../../config/database');
const SolicitudRetornoModel = require('./solicitudRetorno.model');

class SolicitudRetornoRepository {
  constructor(database = db) {
    this.db = database;
    this.table = SolicitudRetornoModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as sr`)
      .select(
        'sr.id',
        'sr.solicitud_id',
        'sr.metodo_devolucion',
        'sr.cuenta_empresa_austral_id',
        'cea.nombre_cuenta as cuenta_empresa_austral_nombre',
        'cea.banco as cuenta_empresa_austral_banco',
        'sr.cuenta_retorno',
        'sr.clave_retorno',
        'sr.tarjeta_retorno',
        'sr.fecha_retorno',
        'sr.monto_retorno',
      )
      .leftJoin('cuentas_empresa_austral as cea', 'sr.cuenta_empresa_austral_id', 'cea.id');
  }

  findAll({ solicitudId = null } = {}) {
    const query = this.baseSelect().orderBy('sr.fecha_retorno', 'desc');
    if (solicitudId) query.where('sr.solicitud_id', solicitudId);
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('sr.id', id).first();
  }

  findBySolicitudId(solicitudId, trx = null) {
    return this.baseSelect(trx).where('sr.solicitud_id', solicitudId).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(SolicitudRetornoModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.where({ id }).update(data).returning(SolicitudRetornoModel.columns);
  }
}

module.exports = SolicitudRetornoRepository;
