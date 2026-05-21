const express = require('express');
const {
  getAsociados,
  getAsociadoById,
  createAsociado,
  updateAsociado,
  deactivateAsociado,
} = require('./asociado.controller');
const {
  createAsociadoSchema,
  updateAsociadoSchema,
  listAsociadoQuerySchema,
} = require('./asociado.validation');
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

router.get('/', validateQuery(listAsociadoQuerySchema), getAsociados);
router.get('/:id', getAsociadoById);
router.post('/', validate(createAsociadoSchema), createAsociado);
router.put('/:id', validate(updateAsociadoSchema), updateAsociado);
router.delete('/:id', deactivateAsociado);

module.exports = router;
