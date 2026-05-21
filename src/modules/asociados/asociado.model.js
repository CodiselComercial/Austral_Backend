const TABLE_NAME = 'asociados';

const AsociadoModel = {
  TABLE_NAME,
  columns: [
    'id',
    'nombre',
    'apellido_p',
    'apellido_m',
    'celular',
    'correo',
    'comision',
    'user_id',
    'created_at',
    'updated_at',
    'is_active',
    'deactivated_at',
    'deactivated_by',
  ],
};

module.exports = AsociadoModel;
