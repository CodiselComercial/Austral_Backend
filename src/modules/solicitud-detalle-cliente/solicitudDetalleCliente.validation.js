const Joi = require('joi');

const uuid = Joi.string().uuid();

const createSolicitudDetalleClienteSchema = Joi.object({
  solicitud_id: uuid.required(),
  empresa_cliente: Joi.string().trim().max(150).allow(null, '').optional(),
  nombre_contacto: Joi.string().trim().max(150).allow(null, '').optional(),
  apellido_p_contacto: Joi.string().trim().max(150).allow(null, '').optional(),
  apellido_m_contacto: Joi.string().trim().max(150).allow(null, '').optional(),
  telefono: Joi.string().trim().max(20).allow(null, '').optional(),
  email: Joi.string().trim().email().max(150).allow(null, '').optional(),
});

const updateSolicitudDetalleClienteSchema = Joi.object({
  empresa_cliente: Joi.string().trim().max(150).allow(null, '').optional(),
  nombre_contacto: Joi.string().trim().max(150).allow(null, '').optional(),
  apellido_p_contacto: Joi.string().trim().max(150).allow(null, '').optional(),
  apellido_m_contacto: Joi.string().trim().max(150).allow(null, '').optional(),
  telefono: Joi.string().trim().max(20).allow(null, '').optional(),
  email: Joi.string().trim().email().max(150).allow(null, '').optional(),
}).min(1);

const listSolicitudDetalleClienteQuerySchema = Joi.object({
  solicitud_id: uuid.optional(),
});

module.exports = {
  createSolicitudDetalleClienteSchema,
  updateSolicitudDetalleClienteSchema,
  listSolicitudDetalleClienteQuerySchema,
};
