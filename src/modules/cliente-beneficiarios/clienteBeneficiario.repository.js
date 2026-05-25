const db = require('../../config/database');
const ClienteBeneficiarioModel = require('./clienteBeneficiario.model');

class ClienteBeneficiarioRepository {
  constructor(database = db) {
    this.db = database;
    this.table = ClienteBeneficiarioModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as cb`)
      .select(
        'cb.id',
        'cb.cliente_id',
        'c.empresa as cliente_empresa',
        'cb.beneficiario_id',
        'b.nombre as beneficiario_nombre',
        'b.apellido_p as beneficiario_apellido_p',
        'b.apellido_m as beneficiario_apellido_m',
        'cb.assigned_at',
        'cb.updated_at',
      )
      .leftJoin('clientes as c', 'cb.cliente_id', 'c.id')
      .leftJoin('beneficiarios as b', 'cb.beneficiario_id', 'b.id');
  }

  findAll({ clienteId = null, beneficiarioId = null } = {}) {
    const query = this.baseSelect().orderBy('cb.assigned_at', 'desc');

    if (clienteId) {
      query.where('cb.cliente_id', clienteId);
    }

    if (beneficiarioId) {
      query.where('cb.beneficiario_id', beneficiarioId);
    }

    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('cb.id', id).first();
  }

  findByClienteAndBeneficiario(clienteId, beneficiarioId, trx = null) {
    const conn = trx || this.db;
    return conn(this.table)
      .where({ cliente_id: clienteId, beneficiario_id: beneficiarioId })
      .first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(ClienteBeneficiarioModel.columns);
  }

  remove(id, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.where({ id }).del();
  }
}

module.exports = ClienteBeneficiarioRepository;
