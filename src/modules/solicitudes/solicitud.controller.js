const SolicitudService = require('./solicitud.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const solicitudService = new SolicitudService();

const getSolicitudes = asyncHandler(async (req, res) => {
  const solicitudes = await solicitudService.getAll(req.query);
  sendSuccess(res, solicitudes, 'Solicitudes obtenidas correctamente');
});

const getSolicitudById = asyncHandler(async (req, res) => {
  const solicitud = await solicitudService.getById(req.params.id);
  sendSuccess(res, solicitud, 'Solicitud obtenida correctamente');
});

const createSolicitud = asyncHandler(async (req, res) => {
  const solicitud = await solicitudService.create(req.body, req.user.id);
  sendSuccess(res, solicitud, 'Solicitud creada correctamente', 201);
});

module.exports = {
  getSolicitudes,
  getSolicitudById,
  createSolicitud,
};
