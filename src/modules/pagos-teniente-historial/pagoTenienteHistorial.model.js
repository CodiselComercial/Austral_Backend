const TABLE_NAME = 'pagos_teniente_historial';

const EVENTOS = [
  'CREACION',
  'VALIDACION_CODIGO',
  'ENTREGA',
  'ACTUALIZACION',
  'DESACTIVACION',
  'CAMBIO_ESTADO',
];

const PagoTenienteHistorialModel = {
  TABLE_NAME,
  EVENTOS,
  columns: [
    'id',
    'pago_teniente_id',
    'estado_anterior_id',
    'estado_nuevo_id',
    'evento',
    'codigo_proporcionado',
    'es_correcto',
    'cambiado_por',
    'cambiado_en',
    'ip_origen',
    'user_agent',
    'detalles',
  ],
};

module.exports = PagoTenienteHistorialModel;
