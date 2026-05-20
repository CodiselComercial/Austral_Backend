const TABLE_NAME = 'sessions';

const SessionModel = {
  TABLE_NAME,
  columns: ['id', 'user_id', 'token', 'created_at', 'updated_at', 'expires_at'],
};

module.exports = SessionModel;
