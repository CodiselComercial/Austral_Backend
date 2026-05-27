const TABLE_NAME = 'solicitud_retorno';

const SolicitudRetornoModel = {
  TABLE_NAME,
  columns: [
    'id',
    'solicitud_id',
    'metodo_devolucion',
    'cuenta_empresa_austral_id',
    'cuenta_retorno',
    'clave_retorno',
    'tarjeta_retorno',
    'fecha_retorno',
    'monto_retorno',
  ],
};

module.exports = SolicitudRetornoModel;
