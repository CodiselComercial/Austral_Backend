const express = require('express');
const { getRoles } = require('./role.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/authorize.middleware');

const router = express.Router();

router.get('/', authenticate, authorize(['ADMIN']), getRoles);

module.exports = router;
