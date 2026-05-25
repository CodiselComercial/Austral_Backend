const Joi = require('joi');

const createCuentaBancariaClienteSchema = Joi.object({
  cliente_id: Joi.string().uuid().required(),
  asociado_id: Joi.string().uuid().allow(null, '').optional(),
  alias: Joi.string().trim().min(1).max(100).optional(),
  numero_cuenta: Joi.string().trim().min(1).max(50).required(),
  limite_credito: Joi.number().precision(2).min(0).optional(),
});

const updateCuentaBancariaClienteSchema = Joi.object({
  alias: Joi.string().trim().min(1).max(100).optional(),
  numero_cuenta: Joi.string().trim().min(1).max(50).optional(),
  asociado_id: Joi.string().uuid().allow(null, '').optional(),
  limite_credito: Joi.number().precision(2).min(0).optional(),
}).min(1);

const listCuentaBancariaClienteQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
  cliente_id: Joi.string().uuid().optional(),
  asociado_id: Joi.string().uuid().optional(),
});

module.exports = {
  createCuentaBancariaClienteSchema,
  updateCuentaBancariaClienteSchema,
  listCuentaBancariaClienteQuerySchema,
};
