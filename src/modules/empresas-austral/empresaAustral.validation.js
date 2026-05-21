const Joi = require('joi');

const createEmpresaAustralSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).required(),
});

const updateEmpresaAustralSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).required(),
});

const listEmpresaAustralQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
});

module.exports = {
  createEmpresaAustralSchema,
  updateEmpresaAustralSchema,
  listEmpresaAustralQuerySchema,
};
