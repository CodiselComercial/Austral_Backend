const db = require('../../config/database');
const ClienteModel = require('./cliente.model');

class ClienteRepository {
  constructor(database = db) {
    this.db = database;
    this.table = ClienteModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as c`).select(
      'c.id',
      'c.empresa',
      'c.nombre_contacto',
      'c.apellido_p_contacto',
      'c.apellido_m_contacto',
      'c.telefono1',
      'c.telefono2',
      'c.correo1',
      'c.correo2',
      'c.calle',
      'c.num_exterior',
      'c.num_interior',
      'c.colonia',
      'c.municipio',
      'c.ciudad',
      'c.estado',
      'c.pais',
      'c.codigo_postal',
      'c.rfc',
      'c.comision',
      'c.created_at',
      'c.updated_at',
      'c.is_active',
      'c.deactivated_at',
      'c.deactivated_by',
    );
  }

  findAll({ activeOnly = null } = {}) {
    const query = this.baseSelect().orderBy('c.empresa', 'asc');

    if (activeOnly === true) {
      query.where('c.is_active', true);
    } else if (activeOnly === false) {
      query.where('c.is_active', false);
    }

    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('c.id', id).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(ClienteModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(ClienteModel.columns);
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
      .returning(ClienteModel.columns);
  }
}

module.exports = ClienteRepository;
