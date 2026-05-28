const express = require('express');
const {
  getHistorial,
  getHistorialById,
  createHistorial,
} = require('./pagoTenienteHistorial.controller');
const {
  createPagoTenienteHistorialSchema,
  listPagoTenienteHistorialQuerySchema,
} = require('./pagoTenienteHistorial.validation');
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

router.use(authenticate, authorize(['ADMIN', 'TENIENTE']));

router.get('/', validateQuery(listPagoTenienteHistorialQuerySchema), getHistorial);
router.get('/:id', getHistorialById);
router.post('/', authorize(['ADMIN']), validate(createPagoTenienteHistorialSchema), createHistorial);

module.exports = router;
