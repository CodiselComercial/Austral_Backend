const express = require('express');
const {
  getTenientes,
  getTenienteById,
  createTeniente,
  updateTeniente,
  deactivateTeniente,
} = require('./teniente.controller');
const {
  createTenienteSchema,
  updateTenienteSchema,
  listTenienteQuerySchema,
} = require('./teniente.validation');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/authorize.middleware');
const validate = require('../../middlewares/validate.middleware');
const AppError = require('../../shared/errors/AppError');

const router = express.Router();

const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return next(new AppError('Parámetros de consulta inválidos', 400, details));
  }

  req.query = value;
  return next();
};

router.use(authenticate, authorize(['ADMIN']));

router.get('/', validateQuery(listTenienteQuerySchema), getTenientes);
router.get('/:id', getTenienteById);
router.post('/', validate(createTenienteSchema), createTeniente);
router.put('/:id', validate(updateTenienteSchema), updateTeniente);
router.delete('/:id', deactivateTeniente);

module.exports = router;
