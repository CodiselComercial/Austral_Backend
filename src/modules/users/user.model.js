const TABLE_NAME = 'users';

const UserModel = {
  TABLE_NAME,
  columns: [
    'id',
    'username',
    'email',
    'password_hash',
    'is_active',
    'created_at',
    'updated_at',
    'deactivated_at',
    'deactivated_by',
  ],
  publicColumns: [
    'id',
    'username',
    'email',
    'is_active',
    'created_at',
    'updated_at',
    'deactivated_at',
    'deactivated_by',
  ],
};

module.exports = UserModel;
