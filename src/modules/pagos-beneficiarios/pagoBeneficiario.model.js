const TABLE_NAME = 'pagos_beneficiarios';

const PagoBeneficiarioModel = {
  TABLE_NAME,
  columns: [
    'id',
    'solicitud_id',
    'beneficiario_id',
    'cuenta_empresa_austral_id',
    'monto_pagado',
    'comprobante_url',
    'fecha_pago',
    'pagado_por',
    'estado_id',
  ],
};

module.exports = PagoBeneficiarioModel;
