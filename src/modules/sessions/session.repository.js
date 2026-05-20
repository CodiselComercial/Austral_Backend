const db = require('../../config/database');
const SessionModel = require('./session.model');

class SessionRepository {
  constructor(database = db) {
    this.db = database;
    this.table = SessionModel.TABLE_NAME;
  }

  create(sessionData, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(sessionData).returning(SessionModel.columns);
  }

  findByToken(token) {
    return this.db(this.table).where({ token }).first();
  }

  findActiveByToken(token) {
    return this.db(this.table)
      .where({ token })
      .andWhere('expires_at', '>', this.db.fn.now())
      .first();
  }

  deleteByToken(token) {
    return this.db(this.table).where({ token }).del();
  }

  deleteExpiredByUserId(userId) {
    return this.db(this.table)
      .where({ user_id: userId })
      .andWhere('expires_at', '<=', this.db.fn.now())
      .del();
  }
}

module.exports = SessionRepository;
