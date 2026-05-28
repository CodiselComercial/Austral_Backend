const PagoTenienteService = require('./pagoTeniente.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const service = new PagoTenienteService();

const getMeta = (req) => ({
  ip_origen: req.ip,
  user_agent: req.get('user-agent'),
});

const getPagosTeniente = asyncHandler(async (req, res) => {
  const pagos = await service.getAll(req.query, req.user, req.user.roles || []);
  sendSuccess(res, pagos, 'Pagos teniente obtenidos correctamente');
});

const getPagoTenienteById = asyncHandler(async (req, res) => {
  const pago = await service.getById(req.params.id);
  sendSuccess(res, pago, 'Pago teniente obtenido correctamente');
});

const createPagoTeniente = asyncHandler(async (req, res) => {
  const pago = await service.create(req.body, req.user.id);
  sendSuccess(res, pago, 'Pago teniente creado correctamente', 201);
});

const updatePagoTeniente = asyncHandler(async (req, res) => {
  const pago = await service.update(req.params.id, req.body, req.user, req.user.roles || [], getMeta(req));
  sendSuccess(res, pago, 'Pago teniente actualizado correctamente');
});

const validarCodigo = asyncHandler(async (req, res) => {
  const result = await service.validarCodigo(
    req.params.id,
    req.body,
    req.user,
    req.user.roles || [],
    getMeta(req),
  );
  sendSuccess(res, result, result.mensaje);
});

const entregarPagoTeniente = asyncHandler(async (req, res) => {
  const pago = await service.entregar(
    req.params.id,
    req.body,
    req.user,
    req.user.roles || [],
    getMeta(req),
  );
  sendSuccess(res, pago, 'Entrega registrada correctamente');
});

const deactivatePagoTeniente = asyncHandler(async (req, res) => {
  const pago = await service.deactivate(req.params.id, req.user, req.user.roles || [], getMeta(req));
  sendSuccess(res, pago, 'Pago teniente desactivado correctamente');
});

module.exports = {
  getPagosTeniente,
  getPagoTenienteById,
  createPagoTeniente,
  updatePagoTeniente,
  validarCodigo,
  entregarPagoTeniente,
  deactivatePagoTeniente,
};
