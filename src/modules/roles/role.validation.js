const Joi = require('joi');

const assignRoleSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  roleId: Joi.number().integer().positive().required(),
});

module.exports = {
  assignRoleSchema,
};
