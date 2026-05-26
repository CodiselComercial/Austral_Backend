const TABLE_NAME = 'solicitud_deposito';

const SolicitudDepositoModel = {
  TABLE_NAME,
  columns: [
    'id',
    'solicitud_id',
    'cuenta_empresa_austral_id',
    'cuenta_deposito',
    'monto_depositado',
    'fecha_deposito',
    'referencia_deposito',
    'ficha_url',
    'comentarios',
  ],
};

module.exports = SolicitudDepositoModel;
