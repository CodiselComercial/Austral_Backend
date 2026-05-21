const Joi = require('joi');

const createEmpresaInternaSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).required(),
});

const updateEmpresaInternaSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).required(),
});

const listEmpresaInternaQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
});

module.exports = {
  createEmpresaInternaSchema,
  updateEmpresaInternaSchema,
  listEmpresaInternaQuerySchema,
};
