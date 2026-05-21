const Joi = require('joi');

const createTenienteSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).required(),
  telefono: Joi.string().trim().min(1).max(20).required(),
  username: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

const updateTenienteSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).optional(),
  telefono: Joi.string().trim().min(1).max(20).optional(),
}).min(1);

const listTenienteQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
});

module.exports = {
  createTenienteSchema,
  updateTenienteSchema,
  listTenienteQuerySchema,
};
