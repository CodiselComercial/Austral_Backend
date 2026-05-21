const EmpresaInternaService = require('./empresaInterna.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const empresaInternaService = new EmpresaInternaService();

const getEmpresasInternas = asyncHandler(async (req, res) => {
  const empresas = await empresaInternaService.getAll(req.query);
  sendSuccess(res, empresas, 'Empresas internas obtenidas correctamente');
});

const getEmpresaInternaById = asyncHandler(async (req, res) => {
  const empresa = await empresaInternaService.getById(req.params.id);
  sendSuccess(res, empresa, 'Empresa interna obtenida correctamente');
});

const createEmpresaInterna = asyncHandler(async (req, res) => {
  const empresa = await empresaInternaService.create(req.body, req.user.id);
  sendSuccess(res, empresa, 'Empresa interna creada correctamente', 201);
});

const updateEmpresaInterna = asyncHandler(async (req, res) => {
  const empresa = await empresaInternaService.update(req.params.id, req.body);
  sendSuccess(res, empresa, 'Empresa interna actualizada correctamente');
});

const deactivateEmpresaInterna = asyncHandler(async (req, res) => {
  const empresa = await empresaInternaService.deactivate(req.params.id, req.user.id);
  sendSuccess(res, empresa, 'Empresa interna desactivada correctamente');
});

module.exports = {
  getEmpresasInternas,
  getEmpresaInternaById,
  createEmpresaInterna,
  updateEmpresaInterna,
  deactivateEmpresaInterna,
};
