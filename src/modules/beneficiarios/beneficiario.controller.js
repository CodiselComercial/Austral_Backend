const BeneficiarioService = require('./beneficiario.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const beneficiarioService = new BeneficiarioService();

const getBeneficiarios = asyncHandler(async (req, res) => {
  const beneficiarios = await beneficiarioService.getAll(req.query);
  sendSuccess(res, beneficiarios, 'Beneficiarios obtenidos correctamente');
});

const getBeneficiarioById = asyncHandler(async (req, res) => {
  const beneficiario = await beneficiarioService.getById(req.params.id);
  sendSuccess(res, beneficiario, 'Beneficiario obtenido correctamente');
});

const createBeneficiario = asyncHandler(async (req, res) => {
  const beneficiario = await beneficiarioService.create(req.body);
  sendSuccess(res, beneficiario, 'Beneficiario creado correctamente', 201);
});

const updateBeneficiario = asyncHandler(async (req, res) => {
  const beneficiario = await beneficiarioService.update(req.params.id, req.body);
  sendSuccess(res, beneficiario, 'Beneficiario actualizado correctamente');
});

const deactivateBeneficiario = asyncHandler(async (req, res) => {
  const beneficiario = await beneficiarioService.deactivate(req.params.id, req.user.id);
  sendSuccess(res, beneficiario, 'Beneficiario desactivado correctamente');
});

module.exports = {
  getBeneficiarios,
  getBeneficiarioById,
  createBeneficiario,
  updateBeneficiario,
  deactivateBeneficiario,
};
