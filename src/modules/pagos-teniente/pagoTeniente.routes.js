const express = require('express');
const {
  getPagosTeniente,
  getPagoTenienteById,
  createPagoTeniente,
  updatePagoTeniente,
  validarCodigo,
  entregarPagoTeniente,
  deactivatePagoTeniente,
} = require('./pagoTeniente.controller');
const {
  createPagoTenienteSchema,
  updatePagoTenienteSchema,
  validarCodigoSchema,
  entregarPagoTenienteSchema,
  listPagoTenienteQuerySchema,
} = require('./pagoTeniente.validation');
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

router.get('/', validateQuery(listPagoTenienteQuerySchema), getPagosTeniente);
router.get('/:id', getPagoTenienteById);
router.post('/', authorize(['ADMIN']), validate(createPagoTenienteSchema), createPagoTeniente);
router.put('/:id', validate(updatePagoTenienteSchema), updatePagoTeniente);
router.post('/:id/validar-codigo', validate(validarCodigoSchema), validarCodigo);
router.post('/:id/entregar', validate(entregarPagoTenienteSchema), entregarPagoTeniente);
router.delete('/:id', authorize(['ADMIN']), deactivatePagoTeniente);

module.exports = router;
