const TABLE_NAME = 'empresas_internas';

const EmpresaInternaModel = {
  TABLE_NAME,
  columns: [
    'id',
    'nombre',
    'created_at',
    'updated_at',
    'created_by',
    'is_active',
    'deactivated_at',
    'deactivated_by',
  ],
};

module.exports = EmpresaInternaModel;
