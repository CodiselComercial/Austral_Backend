const express = require('express');
const { register, login, logout } = require('./auth.controller');
const validate = require('../../middlewares/validate.middleware');
const authenticate = require('../../middlewares/auth.middleware');
const { loginSchema, registerSchema } = require('./auth.validation');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);

module.exports = router;
