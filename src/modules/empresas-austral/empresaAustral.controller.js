const EmpresaAustralService = require('./empresaAustral.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const empresaAustralService = new EmpresaAustralService();

const getEmpresasAustral = asyncHandler(async (req, res) => {
  const empresas = await empresaAustralService.getAll(req.query);
  sendSuccess(res, empresas, 'Empresas Austral obtenidas correctamente');
});

const getEmpresaAustralById = asyncHandler(async (req, res) => {
  const empresa = await empresaAustralService.getById(req.params.id);
  sendSuccess(res, empresa, 'Empresa Austral obtenida correctamente');
});

const createEmpresaAustral = asyncHandler(async (req, res) => {
  const empresa = await empresaAustralService.create(req.body, req.user.id);
  sendSuccess(res, empresa, 'Empresa Austral creada correctamente', 201);
});

const updateEmpresaAustral = asyncHandler(async (req, res) => {
  const empresa = await empresaAustralService.update(req.params.id, req.body);
  sendSuccess(res, empresa, 'Empresa Austral actualizada correctamente');
});

const deactivateEmpresaAustral = asyncHandler(async (req, res) => {
  const empresa = await empresaAustralService.deactivate(req.params.id, req.user.id);
  sendSuccess(res, empresa, 'Empresa Austral desactivada correctamente');
});

module.exports = {
  getEmpresasAustral,
  getEmpresaAustralById,
  createEmpresaAustral,
  updateEmpresaAustral,
  deactivateEmpresaAustral,
};
