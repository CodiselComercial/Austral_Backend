const TABLE_NAME = 'cliente_asociados';

const ClienteAsociadoModel = {
  TABLE_NAME,
  columns: [
    'id',
    'cliente_id',
    'asociado_id',
    'created_at',
    'updated_at',
    'is_active',
    'deactivated_at',
    'deactivated_by',
  ],
};

module.exports = ClienteAsociadoModel;
