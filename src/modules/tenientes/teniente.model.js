const TABLE_NAME = 'tenientes';

const TenienteModel = {
  TABLE_NAME,
  columns: [
    'id',
    'nombre',
    'telefono',
    'user_id',
    'created_at',
    'updated_at',
    'created_by',
    'is_active',
    'deactivated_at',
    'deactivated_by',
  ],
};

module.exports = TenienteModel;
