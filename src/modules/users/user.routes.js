const express = require('express');
const { getUsers } = require('./user.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/authorize.middleware');

const router = express.Router();

router.get('/', authenticate, authorize(['ADMIN']), getUsers);

module.exports = router;
