const Joi = require('joi');

const uuid = Joi.string().uuid();

const createSolicitudComentarioSchema = Joi.object({
  solicitud_id: uuid.required(),
  comentario: Joi.string().trim().min(1).required(),
  rol: Joi.string()
    .trim()
    .valid('ADMIN', 'USER', 'ASOCIADO', 'TENIENTE', 'BENEFICIARIO', 'SISTEMA')
    .optional(),
});

const updateSolicitudComentarioSchema = Joi.object({
  comentario: Joi.string().trim().min(1).required(),
});

const listSolicitudComentarioQuerySchema = Joi.object({
  solicitud_id: uuid.optional(),
});

module.exports = {
  createSolicitudComentarioSchema,
  updateSolicitudComentarioSchema,
  listSolicitudComentarioQuerySchema,
};
