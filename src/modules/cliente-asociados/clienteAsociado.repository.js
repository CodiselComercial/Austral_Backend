const db = require('../../config/database');
const ClienteAsociadoModel = require('./clienteAsociado.model');

class ClienteAsociadoRepository {
  constructor(database = db) {
    this.db = database;
    this.table = ClienteAsociadoModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as ca`)
      .select(
        'ca.id',
        'ca.cliente_id',
        'c.empresa as cliente_empresa',
        'ca.asociado_id',
        'a.nombre as asociado_nombre',
        'a.apellido_p as asociado_apellido_p',
        'a.apellido_m as asociado_apellido_m',
        'ca.created_at',
        'ca.updated_at',
        'ca.is_active',
        'ca.deactivated_at',
        'ca.deactivated_by',
      )
      .leftJoin('clientes as c', 'ca.cliente_id', 'c.id')
      .leftJoin('asociados as a', 'ca.asociado_id', 'a.id');
  }

  findAll({ activeOnly = null, clienteId = null, asociadoId = null } = {}) {
    const query = this.baseSelect().orderBy('c.empresa', 'asc');

    if (activeOnly === true) {
      query.where('ca.is_active', true);
    } else if (activeOnly === false) {
      query.where('ca.is_active', false);
    }

    if (clienteId) {
      query.where('ca.cliente_id', clienteId);
    }

    if (asociadoId) {
      query.where('ca.asociado_id', asociadoId);
    }

    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('ca.id', id).first();
  }

  findByClienteAndAsociado(clienteId, asociadoId, trx = null) {
    const conn = trx || this.db;
    return conn(this.table)
      .where({ cliente_id: clienteId, asociado_id: asociadoId })
      .first();
  }

  countActiveByClienteId(clienteId) {
    return this.db(this.table)
      .where({ cliente_id: clienteId, is_active: true })
      .count('id as total')
      .first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(ClienteAsociadoModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(ClienteAsociadoModel.columns);
  }

  reactivate(id, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id, is_active: false })
      .update({
        is_active: true,
        deactivated_at: null,
        deactivated_by: null,
        updated_at: this.db.fn.now(),
      })
      .returning(ClienteAsociadoModel.columns);
  }

  deactivate(id, deactivatedBy, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id, is_active: true })
      .update({
        is_active: false,
        deactivated_at: this.db.fn.now(),
        deactivated_by: deactivatedBy,
        updated_at: this.db.fn.now(),
      })
      .returning(ClienteAsociadoModel.columns);
  }
}

module.exports = ClienteAsociadoRepository;
