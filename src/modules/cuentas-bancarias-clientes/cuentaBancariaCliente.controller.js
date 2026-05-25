const CuentaBancariaClienteService = require('./cuentaBancariaCliente.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const cuentaBancariaClienteService = new CuentaBancariaClienteService();

const getCuentasBancariasClientes = asyncHandler(async (req, res) => {
  const cuentas = await cuentaBancariaClienteService.getAll(req.query);
  sendSuccess(res, cuentas, 'Cuentas bancarias de clientes obtenidas correctamente');
});

const getCuentaBancariaClienteById = asyncHandler(async (req, res) => {
  const cuenta = await cuentaBancariaClienteService.getById(req.params.id);
  sendSuccess(res, cuenta, 'Cuenta bancaria de cliente obtenida correctamente');
});

const createCuentaBancariaCliente = asyncHandler(async (req, res) => {
  const cuenta = await cuentaBancariaClienteService.create(req.body, req.user.id);
  sendSuccess(res, cuenta, 'Cuenta bancaria de cliente creada correctamente', 201);
});

const updateCuentaBancariaCliente = asyncHandler(async (req, res) => {
  const cuenta = await cuentaBancariaClienteService.update(req.params.id, req.body);
  sendSuccess(res, cuenta, 'Cuenta bancaria de cliente actualizada correctamente');
});

const deactivateCuentaBancariaCliente = asyncHandler(async (req, res) => {
  const cuenta = await cuentaBancariaClienteService.deactivate(req.params.id, req.user.id);
  sendSuccess(res, cuenta, 'Cuenta bancaria de cliente desactivada correctamente');
});

module.exports = {
  getCuentasBancariasClientes,
  getCuentaBancariaClienteById,
  createCuentaBancariaCliente,
  updateCuentaBancariaCliente,
  deactivateCuentaBancariaCliente,
};
