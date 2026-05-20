const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
  roleName: Joi.string().trim().valid('ADMIN', 'USER').optional(),
});

module.exports = {
  createUserSchema,
};
