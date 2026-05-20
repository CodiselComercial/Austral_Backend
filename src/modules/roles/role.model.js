const TABLE_NAME = 'roles';

const RoleModel = {
  TABLE_NAME,
  userRolesTable: 'user_roles',
  columns: ['id', 'name', 'description', 'created_at', 'updated_at'],
};

module.exports = RoleModel;
