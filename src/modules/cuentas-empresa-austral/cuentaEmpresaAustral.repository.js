const db = require('../../config/database');
const CuentaEmpresaAustralModel = require('./cuentaEmpresaAustral.model');

class CuentaEmpresaAustralRepository {
  constructor(database = db) {
    this.db = database;
    this.table = CuentaEmpresaAustralModel.TABLE_NAME;
  }

  findAll({ activeOnly = null, empresaAustralId = null } = {}) {
    const query = this.db(`${this.table} as c`)
      .select(
        'c.id',
        'c.nombre_cuenta',
        'c.empresa_austral_id',
        'ea.nombre as empresa_austral_nombre',
        'c.banco',
        'c.numero_clabe',
        'c.clave_interbancaria',
        'c.tarjeta',
        'c.saldo_actual',
        'c.saldo_disponible',
        'c.created_at',
        'c.updated_at',
        'c.created_by',
        'c.is_active',
        'c.deactivated_at',
        'c.deactivated_by',
      )
      .leftJoin('empresas_austral as ea', 'c.empresa_austral_id', 'ea.id')
      .orderBy('c.nombre_cuenta', 'asc');

    if (activeOnly === true) {
      query.where('c.is_active', true);
    } else if (activeOnly === false) {
      query.where('c.is_active', false);
    }

    if (empresaAustralId) {
      query.where('c.empresa_austral_id', empresaAustralId);
    }

    return query;
  }

  findById(id) {
    return this.db(`${this.table} as c`)
      .select(
        'c.id',
        'c.nombre_cuenta',
        'c.empresa_austral_id',
        'ea.nombre as empresa_austral_nombre',
        'c.banco',
        'c.numero_clabe',
        'c.clave_interbancaria',
        'c.tarjeta',
        'c.saldo_actual',
        'c.saldo_disponible',
        'c.created_at',
        'c.updated_at',
        'c.created_by',
        'c.is_active',
        'c.deactivated_at',
        'c.deactivated_by',
      )
      .leftJoin('empresas_austral as ea', 'c.empresa_austral_id', 'ea.id')
      .where('c.id', id)
      .first();
  }

  findByNumeroClabe(numeroClabe, excludeId = null) {
    const query = this.db(this.table).where({ numero_clabe: numeroClabe });
    if (excludeId) {
      query.whereNot({ id: excludeId });
    }
    return query.first();
  }

  findByClaveInterbancaria(claveInterbancaria, excludeId = null) {
    const query = this.db(this.table).where({ clave_interbancaria: claveInterbancaria });
    if (excludeId) {
      query.whereNot({ id: excludeId });
    }
    return query.first();
  }

  findByTarjeta(tarjeta, excludeId = null) {
    const query = this.db(this.table).where({ tarjeta });
    if (excludeId) {
      query.whereNot({ id: excludeId });
    }
    return query.first();
  }

  countActiveByEmpresaAustralId(empresaAustralId) {
    return this.db(this.table)
      .where({ empresa_austral_id: empresaAustralId, is_active: true })
      .count('id as total')
      .first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(CuentaEmpresaAustralModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(CuentaEmpresaAustralModel.columns);
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
      .returning(CuentaEmpresaAustralModel.columns);
  }
}

module.exports = CuentaEmpresaAustralRepository;
