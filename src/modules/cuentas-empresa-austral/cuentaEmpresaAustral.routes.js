const express = require('express');
const {
  getCuentasEmpresaAustral,
  getCuentaEmpresaAustralById,
  createCuentaEmpresaAustral,
  updateCuentaEmpresaAustral,
  deactivateCuentaEmpresaAustral,
} = require('./cuentaEmpresaAustral.controller');
const {
  createCuentaEmpresaAustralSchema,
  updateCuentaEmpresaAustralSchema,
  listCuentaEmpresaAustralQuerySchema,
} = require('./cuentaEmpresaAustral.validation');
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

router.get('/', validateQuery(listCuentaEmpresaAustralQuerySchema), getCuentasEmpresaAustral);
router.get('/:id', getCuentaEmpresaAustralById);
router.post('/', validate(createCuentaEmpresaAustralSchema), createCuentaEmpresaAustral);
router.put('/:id', validate(updateCuentaEmpresaAustralSchema), updateCuentaEmpresaAustral);
router.delete('/:id', deactivateCuentaEmpresaAustral);

module.exports = router;
