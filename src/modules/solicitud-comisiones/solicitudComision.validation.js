const Joi = require('joi');

const uuid = Joi.string().uuid();

const createSolicitudComisionSchema = Joi.object({
  solicitud_id: uuid.required(),
  comision_asociado: Joi.number().precision(2).min(0).max(100).optional(),
  comision_cliente: Joi.number().precision(2).min(0).max(100).optional(),
  monto_comision_asociado: Joi.number().precision(2).min(0).allow(null).optional(),
  monto_comision_cliente: Joi.number().precision(2).min(0).allow(null).optional(),
  pagado_asociado: Joi.boolean().optional(),
  pagado_cliente: Joi.boolean().optional(),
});

const updateSolicitudComisionSchema = Joi.object({
  comision_asociado: Joi.number().precision(2).min(0).max(100).optional(),
  comision_cliente: Joi.number().precision(2).min(0).max(100).optional(),
  monto_comision_asociado: Joi.number().precision(2).min(0).allow(null).optional(),
  monto_comision_cliente: Joi.number().precision(2).min(0).allow(null).optional(),
  pagado_asociado: Joi.boolean().optional(),
  pagado_cliente: Joi.boolean().optional(),
}).min(1);

const listSolicitudComisionQuerySchema = Joi.object({
  solicitud_id: uuid.optional(),
});

module.exports = {
  createSolicitudComisionSchema,
  updateSolicitudComisionSchema,
  listSolicitudComisionQuerySchema,
};
