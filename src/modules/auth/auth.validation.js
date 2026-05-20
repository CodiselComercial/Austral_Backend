const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
  password: Joi.string().required(),
}).xor('username', 'email');

const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

module.exports = {
  loginSchema,
  registerSchema,
};
