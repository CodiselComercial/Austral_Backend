const Joi = require('joi');

const createCuentaEmpresaAustralSchema = Joi.object({
  nombre_cuenta: Joi.string().trim().min(1).max(150).required(),
  empresa_austral_id: Joi.string().uuid().required(),
  banco: Joi.string().trim().min(1).max(100).required(),
  numero_clabe: Joi.string().trim().min(1).max(50).required(),
  clave_interbancaria: Joi.string().trim().min(1).max(50).required(),
  tarjeta: Joi.string().trim().max(50).allow(null, '').optional(),
  saldo_inicial: Joi.number().precision(2).min(0).optional(),
});

const updateCuentaEmpresaAustralSchema = Joi.object({
  nombre_cuenta: Joi.string().trim().min(1).max(150).optional(),
  banco: Joi.string().trim().min(1).max(100).optional(),
  numero_clabe: Joi.string().trim().min(1).max(50).optional(),
  clave_interbancaria: Joi.string().trim().min(1).max(50).optional(),
  tarjeta: Joi.string().trim().max(50).allow(null, '').optional(),
}).min(1);

const listCuentaEmpresaAustralQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
  empresa_austral_id: Joi.string().uuid().optional(),
});

module.exports = {
  createCuentaEmpresaAustralSchema,
  updateCuentaEmpresaAustralSchema,
  listCuentaEmpresaAustralQuerySchema,
};
