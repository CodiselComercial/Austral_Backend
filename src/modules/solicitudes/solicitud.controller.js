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

const approveSolicitud = asyncHandler(async (req, res) => {
  const solicitud = await solicitudService.approveSolicitud(req.params.id, req.body, req.user, {
    ip_address: req.ip,
    user_agent: req.get('user-agent'),
  });
  sendSuccess(res, solicitud, 'Solicitud aprobada correctamente');
});

const rejectSolicitud = asyncHandler(async (req, res) => {
  const solicitud = await solicitudService.rejectSolicitud(req.params.id, req.body, req.user, {
    ip_address: req.ip,
    user_agent: req.get('user-agent'),
  });
  sendSuccess(res, solicitud, 'Solicitud rechazada correctamente');
});

const verifySolicitud = asyncHandler(async (req, res) => {
  const solicitud = await solicitudService.verifySolicitud(req.params.id, req.body, req.user, {
    ip_address: req.ip,
    user_agent: req.get('user-agent'),
  });
  sendSuccess(res, solicitud, 'Solicitud verificada por banco correctamente');
});

const rejectSolicitudBanco = asyncHandler(async (req, res) => {
  const solicitud = await solicitudService.rejectSolicitudBanco(req.params.id, req.body, req.user, {
    ip_address: req.ip,
    user_agent: req.get('user-agent'),
  });
  sendSuccess(res, solicitud, 'Solicitud rechazada por banco correctamente');
});

module.exports = {
  getSolicitudes,
  getSolicitudById,
  createSolicitud,
  approveSolicitud,
  rejectSolicitud,
  verifySolicitud,
  rejectSolicitudBanco,
};
