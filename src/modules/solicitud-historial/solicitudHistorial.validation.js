const Joi = require('joi');

const uuid = Joi.string().uuid();

const createSolicitudHistorialSchema = Joi.object({
  solicitud_id: uuid.required(),
  estado_anterior_id: Joi.number().integer().positive().allow(null).optional(),
  estado_nuevo_id: Joi.number().integer().positive().required(),
  motivo: Joi.string().trim().allow(null, '').optional(),
});

const listSolicitudHistorialQuerySchema = Joi.object({
  solicitud_id: uuid.optional(),
});

module.exports = {
  createSolicitudHistorialSchema,
  listSolicitudHistorialQuerySchema,
};
