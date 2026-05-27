const db = require('../../config/database');
const SolicitudModel = require('./solicitud.model');

class SolicitudRepository {
  constructor(database = db) {
    this.db = database;
    this.table = SolicitudModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as s`)
      .select(
        's.id',
        's.cliente_id',
        'c.empresa as cliente_empresa',
        's.empresa_austral_id',
        'ea.nombre as empresa_austral_nombre',
        's.asociado_id',
        'a.nombre as asociado_nombre',
        'a.apellido_p as asociado_apellido_p',
        'a.apellido_m as asociado_apellido_m',
        's.beneficiario_id',
        'b.nombre as beneficiario_nombre',
        'b.apellido_p as beneficiario_apellido_p',
        'b.apellido_m as beneficiario_apellido_m',
        's.estado_id',
        'ce.codigo as estado_codigo',
        'ce.nombre as estado_nombre',
        'ce.color as estado_color',
        's.etapa_actual',
        's.created_at',
        's.updated_at',
        's.created_by',
        's.updated_by',
        's.deactivated_at',
        's.deactivated_by',
      )
      .leftJoin('clientes as c', 's.cliente_id', 'c.id')
      .leftJoin('empresas_austral as ea', 's.empresa_austral_id', 'ea.id')
      .leftJoin('asociados as a', 's.asociado_id', 'a.id')
      .leftJoin('beneficiarios as b', 's.beneficiario_id', 'b.id')
      .leftJoin('cat_estados as ce', 's.estado_id', 'ce.id');
  }

  findAll({
    activeOnly = null,
    clienteId = null,
    empresaAustralId = null,
    asociadoId = null,
    beneficiarioId = null,
    estadoId = null,
  } = {}) {
    const query = this.baseSelect().orderBy('s.created_at', 'desc');

    if (activeOnly === true) {
      query.whereNull('s.deactivated_at');
    } else if (activeOnly === false) {
      query.whereNotNull('s.deactivated_at');
    }

    if (clienteId) query.where('s.cliente_id', clienteId);
    if (empresaAustralId) query.where('s.empresa_austral_id', empresaAustralId);
    if (asociadoId) query.where('s.asociado_id', asociadoId);
    if (beneficiarioId) query.where('s.beneficiario_id', beneficiarioId);
    if (estadoId) query.where('s.estado_id', estadoId);

    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('s.id', id).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(SolicitudModel.columns);
  }

  updateEstado(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(SolicitudModel.columns);
  }
}

module.exports = SolicitudRepository;
