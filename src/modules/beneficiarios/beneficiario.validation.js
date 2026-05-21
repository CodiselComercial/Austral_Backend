const Joi = require('joi');

const createBeneficiarioSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).required(),
  apellido_p: Joi.string().trim().min(1).max(150).required(),
  apellido_m: Joi.string().trim().max(150).allow(null, '').optional(),
  username: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

const updateBeneficiarioSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(150).optional(),
  apellido_p: Joi.string().trim().min(1).max(150).optional(),
  apellido_m: Joi.string().trim().max(150).allow(null, '').optional(),
}).min(1);

const listBeneficiarioQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
});

module.exports = {
  createBeneficiarioSchema,
  updateBeneficiarioSchema,
  listBeneficiarioQuerySchema,
};
