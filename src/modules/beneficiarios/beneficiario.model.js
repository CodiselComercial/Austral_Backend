const TABLE_NAME = 'beneficiarios';

const BeneficiarioModel = {
  TABLE_NAME,
  columns: [
    'id',
    'nombre',
    'apellido_p',
    'apellido_m',
    'user_id',
    'created_at',
    'updated_at',
    'is_active',
    'deactivated_at',
    'deactivated_by',
  ],
};

module.exports = BeneficiarioModel;
