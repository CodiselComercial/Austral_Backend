const Joi = require('joi');

const createClienteBeneficiarioSchema = Joi.object({
  cliente_id: Joi.string().uuid().required(),
  beneficiario_id: Joi.string().uuid().required(),
});

const listClienteBeneficiarioQuerySchema = Joi.object({
  cliente_id: Joi.string().uuid().optional(),
  beneficiario_id: Joi.string().uuid().optional(),
});

module.exports = {
  createClienteBeneficiarioSchema,
  listClienteBeneficiarioQuerySchema,
};
