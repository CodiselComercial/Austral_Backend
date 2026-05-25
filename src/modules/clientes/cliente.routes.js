const express = require('express');
const {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deactivateCliente,
} = require('./cliente.controller');
const {
  createClienteSchema,
  updateClienteSchema,
  listClienteQuerySchema,
} = require('./cliente.validation');
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

router.get('/', validateQuery(listClienteQuerySchema), getClientes);
router.get('/:id', getClienteById);
router.post('/', validate(createClienteSchema), createCliente);
router.put('/:id', validate(updateClienteSchema), updateCliente);
router.delete('/:id', deactivateCliente);

module.exports = router;
