const express = require('express');
const {
  getComisiones,
  getComisionById,
  createComision,
  updateComision,
} = require('./solicitudComision.controller');
const {
  createSolicitudComisionSchema,
  updateSolicitudComisionSchema,
  listSolicitudComisionQuerySchema,
} = require('./solicitudComision.validation');
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

router.get('/', validateQuery(listSolicitudComisionQuerySchema), getComisiones);
router.get('/:id', getComisionById);
router.post('/', validate(createSolicitudComisionSchema), createComision);
router.put('/:id', validate(updateSolicitudComisionSchema), updateComision);

module.exports = router;
