const Joi = require('joi');

const uuid = Joi.string().uuid();

const createSolicitudDepositoSchema = Joi.object({
  solicitud_id: uuid.required(),
  cuenta_empresa_austral_id: uuid.required(),
  cuenta_deposito: Joi.string().trim().max(50).allow(null, '').optional(),
  monto_depositado: Joi.number().precision(2).positive().required(),
  fecha_deposito: Joi.date().iso().required(),
  referencia_deposito: Joi.string().trim().max(100).allow(null, '').optional(),
  ficha_url: Joi.string().trim().allow(null, '').optional(),
  comentarios: Joi.string().trim().allow(null, '').optional(),
});

const updateSolicitudDepositoSchema = Joi.object({
  cuenta_empresa_austral_id: uuid.optional(),
  cuenta_deposito: Joi.string().trim().max(50).allow(null, '').optional(),
  monto_depositado: Joi.number().precision(2).positive().optional(),
  fecha_deposito: Joi.date().iso().optional(),
  referencia_deposito: Joi.string().trim().max(100).allow(null, '').optional(),
  ficha_url: Joi.string().trim().allow(null, '').optional(),
  comentarios: Joi.string().trim().allow(null, '').optional(),
}).min(1);

const listSolicitudDepositoQuerySchema = Joi.object({
  solicitud_id: uuid.optional(),
});

module.exports = {
  createSolicitudDepositoSchema,
  updateSolicitudDepositoSchema,
  listSolicitudDepositoQuerySchema,
};
