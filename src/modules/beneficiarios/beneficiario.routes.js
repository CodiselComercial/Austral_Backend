const express = require('express');
const {
  getBeneficiarios,
  getBeneficiarioById,
  createBeneficiario,
  updateBeneficiario,
  deactivateBeneficiario,
} = require('./beneficiario.controller');
const {
  createBeneficiarioSchema,
  updateBeneficiarioSchema,
  listBeneficiarioQuerySchema,
} = require('./beneficiario.validation');
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

router.get('/', validateQuery(listBeneficiarioQuerySchema), getBeneficiarios);
router.get('/:id', getBeneficiarioById);
router.post('/', validate(createBeneficiarioSchema), createBeneficiario);
router.put('/:id', validate(updateBeneficiarioSchema), updateBeneficiario);
router.delete('/:id', deactivateBeneficiario);

module.exports = router;
