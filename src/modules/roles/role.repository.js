const db = require('../../config/database');
const RoleModel = require('./role.model');

class RoleRepository {
  constructor(database = db) {
    this.db = database;
    this.table = RoleModel.TABLE_NAME;
    this.userRolesTable = RoleModel.userRolesTable;
  }

  findAll() {
    return this.db(this.table).select(RoleModel.columns).orderBy('id', 'asc');
  }

  findById(id) {
    return this.db(this.table).where({ id }).first();
  }

  findByName(name) {
    return this.db(this.table).where({ name }).first();
  }

  findRolesByUserId(userId) {
    return this.db(this.table)
      .select(`${this.table}.id`, `${this.table}.name`, `${this.table}.description`)
      .join(this.userRolesTable, `${this.userRolesTable}.role_id`, `${this.table}.id`)
      .where(`${this.userRolesTable}.user_id`, userId);
  }

  assignRoleToUser(userId, roleId, trx = null) {
    const query = trx ? trx(this.userRolesTable) : this.db(this.userRolesTable);
    return query
      .insert({
        user_id: userId,
        role_id: roleId,
      })
      .returning(['id', 'user_id', 'role_id', 'assigned_at', 'updated_at']);
  }
}

module.exports = RoleRepository;
