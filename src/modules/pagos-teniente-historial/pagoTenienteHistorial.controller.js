const PagoTenienteHistorialService = require('./pagoTenienteHistorial.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const service = new PagoTenienteHistorialService();

const getHistorial = asyncHandler(async (req, res) => {
  const historial = await service.getAll(req.query);
  sendSuccess(res, historial, 'Historial de pagos teniente obtenido correctamente');
});

const getHistorialById = asyncHandler(async (req, res) => {
  const registro = await service.getById(req.params.id);
  sendSuccess(res, registro, 'Registro de historial obtenido correctamente');
});

const createHistorial = asyncHandler(async (req, res) => {
  const registro = await service.create(req.body, req.user, {
    ip_origen: req.ip,
    user_agent: req.get('user-agent'),
  });
  sendSuccess(res, registro, 'Registro de historial creado correctamente', 201);
});

module.exports = {
  getHistorial,
  getHistorialById,
  createHistorial,
};
