const Joi = require('joi');

const uuid = Joi.string().uuid();
const METODOS_DEVOLUCION = ['TRANSFERENCIA', 'SPEI', 'EFECTIVO', 'TARJETA', 'CHEQUE', 'CLABE'];

const createSolicitudRetornoSchema = Joi.object({
  solicitud_id: uuid.required(),
  metodo_devolucion: Joi.string().valid(...METODOS_DEVOLUCION).required(),
  cuenta_empresa_austral_id: uuid.optional().allow(null),
  cuenta_retorno: Joi.string().trim().max(50).optional().allow(null, ''),
  clave_retorno: Joi.string().trim().max(50).optional().allow(null, ''),
  tarjeta_retorno: Joi.string().trim().max(50).optional().allow(null, ''),
  fecha_retorno: Joi.date().iso().allow(null).optional(),
  monto_retorno: Joi.number().precision(2).min(0).allow(null).optional(),
});

const updateSolicitudRetornoSchema = Joi.object({
  metodo_devolucion: Joi.string().valid(...METODOS_DEVOLUCION).optional(),
  cuenta_empresa_austral_id: uuid.optional().allow(null),
  cuenta_retorno: Joi.string().trim().max(50).optional().allow(null, ''),
  clave_retorno: Joi.string().trim().max(50).optional().allow(null, ''),
  tarjeta_retorno: Joi.string().trim().max(50).optional().allow(null, ''),
  fecha_retorno: Joi.date().iso().allow(null).optional(),
  monto_retorno: Joi.number().precision(2).min(0).allow(null).optional(),
}).min(1);

const listSolicitudRetornoQuerySchema = Joi.object({
  solicitud_id: uuid.optional(),
});

module.exports = {
  createSolicitudRetornoSchema,
  updateSolicitudRetornoSchema,
  listSolicitudRetornoQuerySchema,
  METODOS_DEVOLUCION,
};
