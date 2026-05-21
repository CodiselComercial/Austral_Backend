const AsociadoService = require('./asociado.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const asociadoService = new AsociadoService();

const getAsociados = asyncHandler(async (req, res) => {
  const asociados = await asociadoService.getAll(req.query);
  sendSuccess(res, asociados, 'Asociados obtenidos correctamente');
});

const getAsociadoById = asyncHandler(async (req, res) => {
  const asociado = await asociadoService.getById(req.params.id);
  sendSuccess(res, asociado, 'Asociado obtenido correctamente');
});

const createAsociado = asyncHandler(async (req, res) => {
  const asociado = await asociadoService.create(req.body);
  sendSuccess(res, asociado, 'Asociado creado correctamente', 201);
});

const updateAsociado = asyncHandler(async (req, res) => {
  const asociado = await asociadoService.update(req.params.id, req.body);
  sendSuccess(res, asociado, 'Asociado actualizado correctamente');
});

const deactivateAsociado = asyncHandler(async (req, res) => {
  const asociado = await asociadoService.deactivate(req.params.id, req.user.id);
  sendSuccess(res, asociado, 'Asociado desactivado correctamente');
});

module.exports = {
  getAsociados,
  getAsociadoById,
  createAsociado,
  updateAsociado,
  deactivateAsociado,
};
