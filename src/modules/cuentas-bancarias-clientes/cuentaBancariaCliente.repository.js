const db = require('../../config/database');
const CuentaBancariaClienteModel = require('./cuentaBancariaCliente.model');

class CuentaBancariaClienteRepository {
  constructor(database = db) {
    this.db = database;
    this.table = CuentaBancariaClienteModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as cb`)
      .select(
        'cb.id',
        'cb.cliente_id',
        'c.empresa as cliente_empresa',
        'cb.asociado_id',
        'a.nombre as asociado_nombre',
        'a.apellido_p as asociado_apellido_p',
        'cb.alias',
        'cb.numero_cuenta',
        'cb.saldo_disponible',
        'cb.saldo_bloqueado',
        'cb.limite_credito',
        'cb.created_at',
        'cb.updated_at',
        'cb.created_by',
        'cb.is_active',
        'cb.deactivated_at',
        'cb.deactivated_by',
      )
      .leftJoin('clientes as c', 'cb.cliente_id', 'c.id')
      .leftJoin('asociados as a', 'cb.asociado_id', 'a.id');
  }

  findAll({ activeOnly = null, clienteId = null, asociadoId = null } = {}) {
    const query = this.baseSelect().orderBy('cb.alias', 'asc');

    if (activeOnly === true) {
      query.where('cb.is_active', true);
    } else if (activeOnly === false) {
      query.where('cb.is_active', false);
    }

    if (clienteId) {
      query.where('cb.cliente_id', clienteId);
    }

    if (asociadoId) {
      query.where('cb.asociado_id', asociadoId);
    }

    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('cb.id', id).first();
  }

  findByNumeroCuenta(numeroCuenta, excludeId = null) {
    const query = this.db(this.table).where({ numero_cuenta: numeroCuenta });
    if (excludeId) {
      query.whereNot({ id: excludeId });
    }
    return query.first();
  }

  countActiveByClienteId(clienteId) {
    return this.db(this.table)
      .where({ cliente_id: clienteId, is_active: true })
      .count('id as total')
      .first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(CuentaBancariaClienteModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(CuentaBancariaClienteModel.columns);
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
      .returning(CuentaBancariaClienteModel.columns);
  }
}

module.exports = CuentaBancariaClienteRepository;
