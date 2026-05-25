const Joi = require('joi');

const createClienteAsociadoSchema = Joi.object({
  cliente_id: Joi.string().uuid().required(),
  asociado_id: Joi.string().uuid().required(),
});

const listClienteAsociadoQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
  cliente_id: Joi.string().uuid().optional(),
  asociado_id: Joi.string().uuid().optional(),
});

module.exports = {
  createClienteAsociadoSchema,
  listClienteAsociadoQuerySchema,
};
