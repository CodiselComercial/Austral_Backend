const ClienteBeneficiarioService = require('./clienteBeneficiario.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const clienteBeneficiarioService = new ClienteBeneficiarioService();

const getClienteBeneficiarios = asyncHandler(async (req, res) => {
  const asignaciones = await clienteBeneficiarioService.getAll(req.query);
  sendSuccess(res, asignaciones, 'Asignaciones cliente-beneficiario obtenidas correctamente');
});

const getClienteBeneficiarioById = asyncHandler(async (req, res) => {
  const asignacion = await clienteBeneficiarioService.getById(req.params.id);
  sendSuccess(res, asignacion, 'Asignación cliente-beneficiario obtenida correctamente');
});

const assignClienteBeneficiario = asyncHandler(async (req, res) => {
  const asignacion = await clienteBeneficiarioService.assign(req.body);
  sendSuccess(res, asignacion, 'Beneficiario asignado al cliente correctamente', 201);
});

const removeClienteBeneficiario = asyncHandler(async (req, res) => {
  await clienteBeneficiarioService.remove(req.params.id);
  sendSuccess(res, null, 'Asignación cliente-beneficiario eliminada correctamente');
});

module.exports = {
  getClienteBeneficiarios,
  getClienteBeneficiarioById,
  assignClienteBeneficiario,
  removeClienteBeneficiario,
};
