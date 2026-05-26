const express = require('express');
const {
  getDetalles,
  getDetalleById,
  createDetalle,
  updateDetalle,
} = require('./solicitudDetalleCliente.controller');
const {
  createSolicitudDetalleClienteSchema,
  updateSolicitudDetalleClienteSchema,
  listSolicitudDetalleClienteQuerySchema,
} = require('./solicitudDetalleCliente.validation');
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

router.get('/', validateQuery(listSolicitudDetalleClienteQuerySchema), getDetalles);
router.get('/:id', getDetalleById);
router.post('/', validate(createSolicitudDetalleClienteSchema), createDetalle);
router.put('/:id', validate(updateSolicitudDetalleClienteSchema), updateDetalle);

module.exports = router;
