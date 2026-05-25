const express = require('express');
const {
  getCuentasBancariasClientes,
  getCuentaBancariaClienteById,
  createCuentaBancariaCliente,
  updateCuentaBancariaCliente,
  deactivateCuentaBancariaCliente,
} = require('./cuentaBancariaCliente.controller');
const {
  createCuentaBancariaClienteSchema,
  updateCuentaBancariaClienteSchema,
  listCuentaBancariaClienteQuerySchema,
} = require('./cuentaBancariaCliente.validation');
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

router.get('/', validateQuery(listCuentaBancariaClienteQuerySchema), getCuentasBancariasClientes);
router.get('/:id', getCuentaBancariaClienteById);
router.post('/', validate(createCuentaBancariaClienteSchema), createCuentaBancariaCliente);
router.put('/:id', validate(updateCuentaBancariaClienteSchema), updateCuentaBancariaCliente);
router.delete('/:id', deactivateCuentaBancariaCliente);

module.exports = router;
