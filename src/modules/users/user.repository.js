const db = require('../../config/database');
const UserModel = require('./user.model');

class UserRepository {
  constructor(database = db) {
    this.db = database;
    this.table = UserModel.TABLE_NAME;
  }

  findAll() {
    return this.db(this.table)
      .select(UserModel.publicColumns)
      .orderBy('created_at', 'desc');
  }

  findById(id) {
    return this.db(this.table).where({ id }).first();
  }

  findByEmail(email) {
    return this.db(this.table).where({ email }).first();
  }

  findByUsername(username) {
    return this.db(this.table).where({ username }).first();
  }

  findByEmailOrUsername(identifier) {
    return this.db(this.table)
      .where({ email: identifier })
      .orWhere({ username: identifier })
      .first();
  }

  create(userData, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query.insert(userData).returning(UserModel.publicColumns);
  }

  update(id, userData, trx = null) {
    const query = trx ? trx(this.table) : this.db(this.table);
    return query
      .where({ id })
      .update({ ...userData, updated_at: this.db.fn.now() })
      .returning(UserModel.publicColumns);
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
      .returning(UserModel.publicColumns);
  }
}

module.exports = UserRepository;
