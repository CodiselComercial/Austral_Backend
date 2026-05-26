const db = require('../../config/database');
const SolicitudComentarioModel = require('./solicitudComentario.model');

class SolicitudComentarioRepository {
  constructor(database = db) {
    this.db = database;
    this.table = SolicitudComentarioModel.TABLE_NAME;
  }

  baseSelect(trx = null) {
    const conn = trx || this.db;
    return conn(`${this.table} as sc`)
      .select(
        'sc.id',
        'sc.solicitud_id',
        'sc.escrito_por',
        'u.username as escrito_por_username',
        'sc.rol',
        'sc.comentario',
        'sc.fecha_comentario',
        'sc.updated_at',
      )
      .leftJoin('users as u', 'sc.escrito_por', 'u.id');
  }

  findAll({ solicitudId = null } = {}) {
    const query = this.baseSelect().orderBy('sc.fecha_comentario', 'desc');
    if (solicitudId) query.where('sc.solicitud_id', solicitudId);
    return query;
  }

  findById(id, trx = null) {
    return this.baseSelect(trx).where('sc.id', id).first();
  }

  create(data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(data).returning(SolicitudComentarioModel.columns);
  }

  update(id, data, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning(SolicitudComentarioModel.columns);
  }
}

module.exports = SolicitudComentarioRepository;
