const express = require('express');
const {
  getEmpresasAustral,
  getEmpresaAustralById,
  createEmpresaAustral,
  updateEmpresaAustral,
  deactivateEmpresaAustral,
} = require('./empresaAustral.controller');
const {
  createEmpresaAustralSchema,
  updateEmpresaAustralSchema,
  listEmpresaAustralQuerySchema,
} = require('./empresaAustral.validation');
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

router.get('/', validateQuery(listEmpresaAustralQuerySchema), getEmpresasAustral);
router.get('/:id', getEmpresaAustralById);
router.post('/', validate(createEmpresaAustralSchema), createEmpresaAustral);
router.put('/:id', validate(updateEmpresaAustralSchema), updateEmpresaAustral);
router.delete('/:id', deactivateEmpresaAustral);

module.exports = router;
