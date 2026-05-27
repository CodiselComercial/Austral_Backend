const Joi = require('joi');

const uuid = Joi.string().uuid();
const METODOS_PAGO = ['TRANSFERENCIA', 'SPEI', 'EFECTIVO', 'TARJETA', 'CHEQUE'];

const createBeneficiarioRetornoSchema = Joi.object({
  solicitud_id: uuid.required(),
  beneficiario_id: uuid.optional().allow(null),
  nombre_beneficiario: Joi.string().trim().max(150).optional().allow(null, ''),
  apellido_p_beneficiario: Joi.string().trim().max(150).optional().allow(null, ''),
  apellido_m_beneficiario: Joi.string().trim().max(150).optional().allow(null, ''),
  monto_beneficiario: Joi.number().precision(2).positive().required(),
  cuenta_bancaria_beneficiario_id: uuid.optional().allow(null),
  metodo_pago: Joi.string().valid(...METODOS_PAGO).required(),
  monto_pagado: Joi.number().precision(2).min(0).allow(null).optional(),
  comprobante_url: Joi.string().trim().allow(null, '').optional(),
  fecha_pago: Joi.date().iso().allow(null).optional(),
  estado_pago_id: Joi.number().integer().positive().optional(),
}).or('beneficiario_id', 'nombre_beneficiario');

const updateBeneficiarioRetornoSchema = Joi.object({
  beneficiario_id: uuid.optional().allow(null),
  nombre_beneficiario: Joi.string().trim().max(150).optional().allow(null, ''),
  apellido_p_beneficiario: Joi.string().trim().max(150).optional().allow(null, ''),
  apellido_m_beneficiario: Joi.string().trim().max(150).optional().allow(null, ''),
  monto_beneficiario: Joi.number().precision(2).positive().optional(),
  cuenta_bancaria_beneficiario_id: uuid.optional().allow(null),
  metodo_pago: Joi.string().valid(...METODOS_PAGO).optional(),
  monto_pagado: Joi.number().precision(2).min(0).allow(null).optional(),
  comprobante_url: Joi.string().trim().allow(null, '').optional(),
  fecha_pago: Joi.date().iso().allow(null).optional(),
  estado_pago_id: Joi.number().integer().positive().optional(),
}).min(1);

const listBeneficiarioRetornoQuerySchema = Joi.object({
  solicitud_id: uuid.optional(),
  beneficiario_id: uuid.optional(),
});

module.exports = {
  createBeneficiarioRetornoSchema,
  updateBeneficiarioRetornoSchema,
  listBeneficiarioRetornoQuerySchema,
  METODOS_PAGO,
};
