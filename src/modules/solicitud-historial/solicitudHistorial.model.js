const TABLE_NAME = 'solicitud_historial';

const SolicitudHistorialModel = {
  TABLE_NAME,
  columns: [
    'id',
    'solicitud_id',
    'estado_anterior_id',
    'estado_nuevo_id',
    'cambiado_por',
    'cambiado_en',
    'motivo',
    'ip_address',
    'user_agent',
  ],
};

module.exports = SolicitudHistorialModel;
