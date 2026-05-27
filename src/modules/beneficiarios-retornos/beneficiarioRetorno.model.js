const TABLE_NAME = 'beneficiarios_retornos';

const BeneficiarioRetornoModel = {
  TABLE_NAME,
  columns: [
    'id',
    'solicitud_id',
    'beneficiario_id',
    'nombre_beneficiario',
    'apellido_p_beneficiario',
    'apellido_m_beneficiario',
    'monto_beneficiario',
    'cuenta_bancaria_beneficiario_id',
    'metodo_pago',
    'monto_pagado',
    'comprobante_url',
    'fecha_pago',
    'estado_pago_id',
    'created_at',
    'updated_at',
  ],
};

module.exports = BeneficiarioRetornoModel;
