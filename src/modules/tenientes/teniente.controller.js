const TenienteService = require('./teniente.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const tenienteService = new TenienteService();

const getTenientes = asyncHandler(async (req, res) => {
  const tenientes = await tenienteService.getAll(req.query);
  sendSuccess(res, tenientes, 'Tenientes obtenidos correctamente');
});

const getTenienteById = asyncHandler(async (req, res) => {
  const teniente = await tenienteService.getById(req.params.id);
  sendSuccess(res, teniente, 'Teniente obtenido correctamente');
});

const createTeniente = asyncHandler(async (req, res) => {
  const teniente = await tenienteService.create(req.body, req.user.id);
  sendSuccess(res, teniente, 'Teniente creado correctamente', 201);
});

const updateTeniente = asyncHandler(async (req, res) => {
  const teniente = await tenienteService.update(req.params.id, req.body);
  sendSuccess(res, teniente, 'Teniente actualizado correctamente');
});

const deactivateTeniente = asyncHandler(async (req, res) => {
  const teniente = await tenienteService.deactivate(req.params.id, req.user.id);
  sendSuccess(res, teniente, 'Teniente desactivado correctamente');
});

module.exports = {
  getTenientes,
  getTenienteById,
  createTeniente,
  updateTeniente,
  deactivateTeniente,
};
