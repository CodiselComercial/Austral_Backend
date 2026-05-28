const Joi = require('joi');
const PagoTenienteModel = require('./pagoTeniente.model');

const uuid = Joi.string().uuid();

const createPagoTenienteSchema = Joi.object({
  pago_beneficiario_id: uuid.required(),
  beneficiario_id: uuid.required(),
  entregado_por: uuid.required(),
  receptor_tipo: Joi.string()
    .valid(...PagoTenienteModel.RECEPTOR_TIPOS)
    .optional(),
  max_intentos: Joi.number().integer().min(1).max(10).optional(),
  estado_id: Joi.number().integer().positive().optional(),
  observaciones: Joi.string().trim().allow(null, '').optional(),
});

const updatePagoTenienteSchema = Joi.object({
  entregado_por: uuid.optional(),
  receptor_tipo: Joi.string()
    .valid(...PagoTenienteModel.RECEPTOR_TIPOS)
    .optional(),
  receptor_nombre: Joi.string().trim().max(150).allow(null, '').optional(),
  identificacion_receptor: Joi.string().trim().max(50).allow(null, '').optional(),
  receptor_firma_url: Joi.string().trim().allow(null, '').optional(),
  foto_comprobante_url: Joi.string().trim().allow(null, '').optional(),
  latitud: Joi.number().min(-90).max(90).optional(),
  longitud: Joi.number().min(-180).max(180).optional(),
  estado_id: Joi.number().integer().positive().optional(),
  max_intentos: Joi.number().integer().min(1).max(10).optional(),
  observaciones: Joi.string().trim().allow(null, '').optional(),
}).min(1);

const validarCodigoSchema = Joi.object({
  codigo: Joi.string().trim().length(6).pattern(/^\d+$/).required(),
});

const entregarPagoTenienteSchema = Joi.object({
  codigo: Joi.string().trim().length(6).pattern(/^\d+$/).optional(),
  receptor_tipo: Joi.string()
    .valid(...PagoTenienteModel.RECEPTOR_TIPOS)
    .optional(),
  receptor_nombre: Joi.string().trim().max(150).allow(null, '').optional(),
  identificacion_receptor: Joi.string().trim().max(50).allow(null, '').optional(),
  receptor_firma_url: Joi.string().trim().allow(null, '').optional(),
  foto_comprobante_url: Joi.string().trim().allow(null, '').optional(),
  latitud: Joi.number().min(-90).max(90).required(),
  longitud: Joi.number().min(-180).max(180).required(),
  observaciones: Joi.string().trim().allow(null, '').optional(),
});

const listPagoTenienteQuerySchema = Joi.object({
  solicitud_id: uuid.optional(),
  beneficiario_id: uuid.optional(),
  estado_id: Joi.number().integer().positive().optional(),
  entregado_por: uuid.optional(),
  active: Joi.string().valid('true', 'false').optional(),
});

module.exports = {
  createPagoTenienteSchema,
  updatePagoTenienteSchema,
  validarCodigoSchema,
  entregarPagoTenienteSchema,
  listPagoTenienteQuerySchema,
};
