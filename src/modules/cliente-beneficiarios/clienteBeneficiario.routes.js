const express = require('express');
const {
  getClienteBeneficiarios,
  getClienteBeneficiarioById,
  assignClienteBeneficiario,
  removeClienteBeneficiario,
} = require('./clienteBeneficiario.controller');
const {
  createClienteBeneficiarioSchema,
  listClienteBeneficiarioQuerySchema,
} = require('./clienteBeneficiario.validation');
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

router.get('/', validateQuery(listClienteBeneficiarioQuerySchema), getClienteBeneficiarios);
router.get('/:id', getClienteBeneficiarioById);
router.post('/', validate(createClienteBeneficiarioSchema), assignClienteBeneficiario);
router.delete('/:id', removeClienteBeneficiario);

module.exports = router;
