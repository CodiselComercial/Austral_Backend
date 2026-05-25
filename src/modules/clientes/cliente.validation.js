const Joi = require('joi');

const createClienteSchema = Joi.object({
  empresa: Joi.string().trim().min(1).max(150).required(),
  nombre_contacto: Joi.string().trim().min(1).max(150).required(),
  apellido_p_contacto: Joi.string().trim().min(1).max(150).required(),
  apellido_m_contacto: Joi.string().trim().max(150).allow(null, '').optional(),
  telefono1: Joi.string().trim().min(1).max(20).required(),
  telefono2: Joi.string().trim().max(20).allow(null, '').optional(),
  correo1: Joi.string().trim().email().max(150).required(),
  correo2: Joi.string().trim().email().max(150).allow(null, '').optional(),
  calle: Joi.string().trim().min(1).max(150).required(),
  num_exterior: Joi.string().trim().min(1).max(20).required(),
  num_interior: Joi.string().trim().max(20).allow(null, '').optional(),
  colonia: Joi.string().trim().max(150).allow(null, '').optional(),
  municipio: Joi.string().trim().max(150).allow(null, '').optional(),
  ciudad: Joi.string().trim().min(1).max(150).required(),
  estado: Joi.string().trim().min(1).max(150).required(),
  pais: Joi.string().trim().max(100).optional(),
  codigo_postal: Joi.string().trim().min(1).max(10).required(),
  rfc: Joi.string().trim().max(13).allow(null, '').optional(),
  comision: Joi.number().precision(2).min(0).max(100).optional(),
});

const updateClienteSchema = Joi.object({
  empresa: Joi.string().trim().min(1).max(150).optional(),
  nombre_contacto: Joi.string().trim().min(1).max(150).optional(),
  apellido_p_contacto: Joi.string().trim().min(1).max(150).optional(),
  apellido_m_contacto: Joi.string().trim().max(150).allow(null, '').optional(),
  telefono1: Joi.string().trim().min(1).max(20).optional(),
  telefono2: Joi.string().trim().max(20).allow(null, '').optional(),
  correo1: Joi.string().trim().email().max(150).optional(),
  correo2: Joi.string().trim().email().max(150).allow(null, '').optional(),
  calle: Joi.string().trim().min(1).max(150).optional(),
  num_exterior: Joi.string().trim().min(1).max(20).optional(),
  num_interior: Joi.string().trim().max(20).allow(null, '').optional(),
  colonia: Joi.string().trim().max(150).allow(null, '').optional(),
  municipio: Joi.string().trim().max(150).allow(null, '').optional(),
  ciudad: Joi.string().trim().min(1).max(150).optional(),
  estado: Joi.string().trim().min(1).max(150).optional(),
  pais: Joi.string().trim().max(100).optional(),
  codigo_postal: Joi.string().trim().min(1).max(10).optional(),
  rfc: Joi.string().trim().max(13).allow(null, '').optional(),
  comision: Joi.number().precision(2).min(0).max(100).optional(),
}).min(1);

const listClienteQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
});

module.exports = {
  createClienteSchema,
  updateClienteSchema,
  listClienteQuerySchema,
};
