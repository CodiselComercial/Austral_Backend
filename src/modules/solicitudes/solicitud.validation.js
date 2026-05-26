const Joi = require('joi');

const uuid = Joi.string().uuid();

const createSolicitudSchema = Joi.object({
  cliente_id: uuid.optional().allow(null),
  empresa_austral_id: uuid.optional().allow(null),
  asociado_id: uuid.optional().allow(null),
  beneficiario_id: uuid.optional().allow(null),
}).or('cliente_id', 'empresa_austral_id', 'asociado_id', 'beneficiario_id');

const listSolicitudQuerySchema = Joi.object({
  active: Joi.string().valid('true', 'false').optional(),
  cliente_id: uuid.optional(),
  empresa_austral_id: uuid.optional(),
  asociado_id: uuid.optional(),
  beneficiario_id: uuid.optional(),
  estado_id: Joi.number().integer().positive().optional(),
});

module.exports = {
  createSolicitudSchema,
  listSolicitudQuerySchema,
};
