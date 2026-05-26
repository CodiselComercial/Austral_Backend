const TABLE_NAME = 'solicitud_comisiones';

const SolicitudComisionModel = {
  TABLE_NAME,
  columns: [
    'id',
    'solicitud_id',
    'comision_asociado',
    'comision_cliente',
    'monto_comision_asociado',
    'monto_comision_cliente',
    'pagado_asociado',
    'pagado_cliente',
  ],
};

module.exports = SolicitudComisionModel;
