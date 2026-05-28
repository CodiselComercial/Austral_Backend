const db = require('../../config/database');
const PagoTenienteModel = require('./pagoTeniente.model');

class PagoTenienteRepository {
  constructor(database = db) {
    this.db = database;
    this.table = PagoTenienteModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as pt`)
      .select(
        'pt.id',
        'pt.pago_beneficiario_id',
        'pt.beneficiario_id',
        'b.nombre as beneficiario_nombre',
        'b.apellido_p as beneficiario_apellido_p',
        'b.apellido_m as beneficiario_apellido_m',
        'pt.solicitud_id',
        'pt.intentos_fallidos',
        'pt.max_intentos',
        'pt.bloqueado_hasta',
        'pt.ultimo_intento_fallido',
        'pt.entregado_por',
        'ue.username as entregado_por_username',
        'pt.receptor_tipo',
        'pt.receptor_nombre',
        'pt.identificacion_receptor',
        'pt.receptor_firma_url',
        'pt.foto_comprobante_url',
        'pt.latitud',
        'pt.longitud',
        'pt.created_at',
        'pt.updated_at',
        'pt.created_by',
        'uc.username as created_by_username',
        'pt.updated_by',
        'pt.estado_id',
        'ce.codigo as estado_codigo',
        'ce.nombre as estado_nombre',
        'pt.deactivated_at',
        'pt.deactivated_by',
        'pt.observaciones',
        'pb.monto_pagado',
        'pb.fecha_pago as pago_beneficiario_fecha',
      )
      .leftJoin('beneficiarios as b', 'pt.beneficiario_id', 'b.id')
      .leftJoin('users as ue', 'pt.entregado_por', 'ue.id')
      .leftJoin('users as uc', 'pt.created_by', 'uc.id')
      .leftJoin('cat_estados as ce', 'pt.estado_id', 'ce.id')
      .leftJoin('pagos_beneficiarios as pb', 'pt.pago_beneficiario_id', 'pb.id');
  }

  findAll({
    solicitudId = null,
    beneficiarioId = null,
    estadoId = null,
    entregadoPor = null,
    activeOnly = null,
  } = {}) {
    const query = this.baseSelect().orderBy('pt.created_at', 'desc');
    if (solicitudId) query.where('pt.solicitud_id', solicitudId);
    if (beneficiarioId) query.where('pt.beneficiario_id', beneficiarioId);
    if (estadoId) query.where('pt.estado_id', estadoId);
    if (entregadoPor) query.where('pt.entregado_por', entregadoPor);
    if (activeOnly === true) query.whereNull('pt.deactivated_at');
    else if (activeOnly === false) query.whereNotNull('pt.deactivated_at');
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('pt.id', id).first();
  }

  findByIdWithCode(id, trx = null) {
    const conn = trx || this.db;
    return conn(this.table).where({ id }).first();
  }

  findByPagoBeneficiarioId(pagoBeneficiarioId, trx = null) {
    return this.baseSelect(trx).where('pt.pago_beneficiario_id', pagoBeneficiarioId).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(PagoTenienteModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(PagoTenienteModel.columns);
  }

  deactivate(id, deactivatedBy, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .whereNull('deactivated_at')
      .update({
        deactivated_at: this.db.fn.now(),
        deactivated_by: deactivatedBy,
        updated_at: this.db.fn.now(),
      })
      .returning(PagoTenienteModel.columns);
  }
}

module.exports = PagoTenienteRepository;
