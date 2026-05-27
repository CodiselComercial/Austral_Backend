const SolicitudRetornoService = require('./solicitudRetorno.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const service = new SolicitudRetornoService();

const getRetornos = asyncHandler(async (req, res) => {
  const retornos = await service.getAll(req.query);
  sendSuccess(res, retornos, 'Retornos de solicitud obtenidos correctamente');
});

const getRetornoById = asyncHandler(async (req, res) => {
  const retorno = await service.getById(req.params.id);
  sendSuccess(res, retorno, 'Retorno de solicitud obtenido correctamente');
});

const createRetorno = asyncHandler(async (req, res) => {
  const retorno = await service.create(req.body);
  sendSuccess(res, retorno, 'Retorno de solicitud registrado correctamente', 201);
});

const updateRetorno = asyncHandler(async (req, res) => {
  const retorno = await service.update(req.params.id, req.body);
  sendSuccess(res, retorno, 'Retorno de solicitud actualizado correctamente');
});

module.exports = {
  getRetornos,
  getRetornoById,
  createRetorno,
  updateRetorno,
};
