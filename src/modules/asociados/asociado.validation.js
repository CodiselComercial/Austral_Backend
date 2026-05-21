const Joi = require('joi');

const userCredentialsSchema = {
  username: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
};

const createAsociadoSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).required(),
  apellido_p: Joi.string().trim().min(1).max(150).required(),
  apellido_m: Joi.string().trim().max(150).allow(null, '').optional(),
  celular: Joi.string().trim().min(1).max(20).required(),
  correo: Joi.string().trim().email().max(150).required(),
  comision: Joi.number().precision(2).min(0).max(100).required(),
  ...userCredentialsSchema,
});

const updateAsociadoSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).optional(),
  apellido_p: Joi.string().trim().min(1).max(150).optional(),
  apellido_m: Joi.string().trim().max(150).allow(null, '').optional(),
  celular: Joi.string().trim().min(1).max(20).optional(),
  correo: Joi.string().trim().email().max(150).optional(),
  comision: Joi.number().precision(2).min(0).max(100).optional(),
}).min(1);

const listAsociadoQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
});

module.exports = {
  createAsociadoSchema,
  updateAsociadoSchema,
  listAsociadoQuerySchema,
};
