const db = require('../../config/database');
const BeneficiarioRetornoModel = require('./beneficiarioRetorno.model');

class BeneficiarioRetornoRepository {
  constructor(database = db) {
    this.db = database;
    this.table = BeneficiarioRetornoModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as br`)
      .select(
        'br.id',
        'br.solicitud_id',
        'br.beneficiario_id',
        'b.nombre as beneficiario_nombre',
        'b.apellido_p as beneficiario_apellido_p',
        'b.apellido_m as beneficiario_apellido_m',
        'br.nombre_beneficiario',
        'br.apellido_p_beneficiario',
        'br.apellido_m_beneficiario',
        'br.monto_beneficiario',
        'br.cuenta_bancaria_beneficiario_id',
        'cbb.banco as cuenta_bancaria_banco',
        'cbb.cuenta as cuenta_bancaria_cuenta',
        'cbb.clabe as cuenta_bancaria_clabe',
        'br.metodo_pago',
        'br.monto_pagado',
        'br.comprobante_url',
        'br.fecha_pago',
        'br.estado_pago_id',
        'ce.codigo as estado_pago_codigo',
        'ce.nombre as estado_pago_nombre',
        'br.created_at',
        'br.updated_at',
      )
      .leftJoin('beneficiarios as b', 'br.beneficiario_id', 'b.id')
      .leftJoin('cuentas_bancarias_beneficiarios as cbb', 'br.cuenta_bancaria_beneficiario_id', 'cbb.id')
      .leftJoin('cat_estados as ce', 'br.estado_pago_id', 'ce.id');
  }

  findAll({ solicitudId = null, beneficiarioId = null } = {}) {
    const query = this.baseSelect().orderBy('br.created_at', 'desc');
    if (solicitudId) query.where('br.solicitud_id', solicitudId);
    if (beneficiarioId) query.where('br.beneficiario_id', beneficiarioId);
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('br.id', id).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(BeneficiarioRetornoModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(BeneficiarioRetornoModel.columns);
  }
}

module.exports = BeneficiarioRetornoRepository;
