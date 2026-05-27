const db = require('../../config/database');
const PagoBeneficiarioModel = require('./pagoBeneficiario.model');

class PagoBeneficiarioRepository {
  constructor(database = db) {
    this.db = database;
    this.table = PagoBeneficiarioModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as pb`)
      .select(
        'pb.id',
        'pb.solicitud_id',
        'pb.beneficiario_id',
        'b.nombre as beneficiario_nombre',
        'b.apellido_p as beneficiario_apellido_p',
        'b.apellido_m as beneficiario_apellido_m',
        'pb.cuenta_empresa_austral_id',
        'cea.nombre_cuenta as cuenta_empresa_austral_nombre',
        'cea.banco as cuenta_empresa_austral_banco',
        'pb.monto_pagado',
        'pb.comprobante_url',
        'pb.fecha_pago',
        'pb.pagado_por',
        'u.username as pagado_por_username',
        'pb.estado_id',
        'ce.codigo as estado_codigo',
        'ce.nombre as estado_nombre',
      )
      .leftJoin('beneficiarios as b', 'pb.beneficiario_id', 'b.id')
      .leftJoin('cuentas_empresa_austral as cea', 'pb.cuenta_empresa_austral_id', 'cea.id')
      .leftJoin('users as u', 'pb.pagado_por', 'u.id')
      .leftJoin('cat_estados as ce', 'pb.estado_id', 'ce.id');
  }

  findAll({ solicitudId = null, beneficiarioId = null, estadoId = null } = {}) {
    const query = this.baseSelect().orderBy('pb.fecha_pago', 'desc');
    if (solicitudId) query.where('pb.solicitud_id', solicitudId);
    if (beneficiarioId) query.where('pb.beneficiario_id', beneficiarioId);
    if (estadoId) query.where('pb.estado_id', estadoId);
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('pb.id', id).first();
  }

  findBySolicitudAndBeneficiario(solicitudId, beneficiarioId, trx = null) {
    return this.baseSelect(trx)
      .where('pb.solicitud_id', solicitudId)
      .where('pb.beneficiario_id', beneficiarioId)
      .first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(PagoBeneficiarioModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.where({ id }).update(data).returning(PagoBeneficiarioModel.columns);
  }
}

module.exports = PagoBeneficiarioRepository;
