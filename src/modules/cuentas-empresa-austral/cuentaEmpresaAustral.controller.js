const CuentaEmpresaAustralService = require('./cuentaEmpresaAustral.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const cuentaEmpresaAustralService = new CuentaEmpresaAustralService();

const getCuentasEmpresaAustral = asyncHandler(async (req, res) => {
  const cuentas = await cuentaEmpresaAustralService.getAll(req.query);
  sendSuccess(res, cuentas, 'Cuentas de empresa Austral obtenidas correctamente');
});

const getCuentaEmpresaAustralById = asyncHandler(async (req, res) => {
  const cuenta = await cuentaEmpresaAustralService.getById(req.params.id);
  sendSuccess(res, cuenta, 'Cuenta de empresa Austral obtenida correctamente');
});

const createCuentaEmpresaAustral = asyncHandler(async (req, res) => {
  const cuenta = await cuentaEmpresaAustralService.create(req.body, req.user.id);
  sendSuccess(res, cuenta, 'Cuenta de empresa Austral creada correctamente', 201);
});

const updateCuentaEmpresaAustral = asyncHandler(async (req, res) => {
  const cuenta = await cuentaEmpresaAustralService.update(req.params.id, req.body);
  sendSuccess(res, cuenta, 'Cuenta de empresa Austral actualizada correctamente');
});

const deactivateCuentaEmpresaAustral = asyncHandler(async (req, res) => {
  const cuenta = await cuentaEmpresaAustralService.deactivate(req.params.id, req.user.id);
  sendSuccess(res, cuenta, 'Cuenta de empresa Austral desactivada correctamente');
});

module.exports = {
  getCuentasEmpresaAustral,
  getCuentaEmpresaAustralById,
  createCuentaEmpresaAustral,
  updateCuentaEmpresaAustral,
  deactivateCuentaEmpresaAustral,
};
