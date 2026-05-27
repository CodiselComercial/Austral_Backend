const db = require('../../config/database');
const CuentaBancariaBeneficiarioModel = require('./cuentaBancariaBeneficiario.model');

class CuentaBancariaBeneficiarioRepository {
  constructor(database = db) {
    this.db = database;
    this.table = CuentaBancariaBeneficiarioModel.TABLE_NAME;
  }

  findById(id, trx = null) {
    const conn = trx || this.db;
    return conn(this.table).where({ id }).first();
  }
}

module.exports = CuentaBancariaBeneficiarioRepository;
