const TABLE_NAME = 'solicitudes';

const SolicitudModel = {
  TABLE_NAME,
  columns: [
    'id',
    'cliente_id',
    'empresa_austral_id',
    'asociado_id',
    'beneficiario_id',
    'estado_id',
    'etapa_actual',
    'created_at',
    'updated_at',
    'created_by',
    'updated_by',
    'deactivated_at',
    'deactivated_by',
  ],
};

module.exports = SolicitudModel;
