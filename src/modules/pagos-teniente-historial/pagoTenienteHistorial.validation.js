const Joi = require('joi');
const PagoTenienteHistorialModel = require('./pagoTenienteHistorial.model');

const uuid = Joi.string().uuid();

const createPagoTenienteHistorialSchema = Joi.object({
  pago_teniente_id: uuid.required(),
  estado_anterior_id: Joi.number().integer().positive().allow(null).optional(),
  estado_nuevo_id: Joi.number().integer().positive().required(),
  evento: Joi.string()
    .valid(...PagoTenienteHistorialModel.EVENTOS)
    .optional(),
  codigo_proporcionado: Joi.string().trim().max(10).allow(null, '').optional(),
  es_correcto: Joi.boolean().allow(null).optional(),
  detalles: Joi.object().allow(null).optional(),
});

const listPagoTenienteHistorialQuerySchema = Joi.object({
  pago_teniente_id: uuid.optional(),
  evento: Joi.string()
    .valid(...PagoTenienteHistorialModel.EVENTOS)
    .optional(),
});

module.exports = {
  createPagoTenienteHistorialSchema,
  listPagoTenienteHistorialQuerySchema,
};
