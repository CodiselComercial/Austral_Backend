const Joi = require('joi');

const uuid = Joi.string().uuid();

const createPagoBeneficiarioSchema = Joi.object({
  solicitud_id: uuid.required(),
  beneficiario_id: uuid.required(),
  cuenta_empresa_austral_id: uuid.required(),
  monto_pagado: Joi.number().precision(2).positive().required(),
  comprobante_url: Joi.string().trim().allow(null, '').optional(),
  fecha_pago: Joi.date().iso().optional(),
  estado_id: Joi.number().integer().positive().optional(),
});

const updatePagoBeneficiarioSchema = Joi.object({
  cuenta_empresa_austral_id: uuid.optional(),
  monto_pagado: Joi.number().precision(2).positive().optional(),
  comprobante_url: Joi.string().trim().allow(null, '').optional(),
  fecha_pago: Joi.date().iso().optional(),
  estado_id: Joi.number().integer().positive().optional(),
}).min(1);

const listPagoBeneficiarioQuerySchema = Joi.object({
  solicitud_id: uuid.optional(),
  beneficiario_id: uuid.optional(),
  estado_id: Joi.number().integer().positive().optional(),
});

module.exports = {
  createPagoBeneficiarioSchema,
  updatePagoBeneficiarioSchema,
  listPagoBeneficiarioQuerySchema,
};
