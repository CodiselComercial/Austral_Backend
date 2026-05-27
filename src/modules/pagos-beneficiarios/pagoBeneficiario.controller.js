const PagoBeneficiarioService = require('./pagoBeneficiario.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const service = new PagoBeneficiarioService();

const getPagos = asyncHandler(async (req, res) => {
  const pagos = await service.getAll(req.query);
  sendSuccess(res, pagos, 'Pagos a beneficiarios obtenidos correctamente');
});

const getPagoById = asyncHandler(async (req, res) => {
  const pago = await service.getById(req.params.id);
  sendSuccess(res, pago, 'Pago a beneficiario obtenido correctamente');
});

const createPago = asyncHandler(async (req, res) => {
  const pago = await service.create(req.body, req.user.id);
  sendSuccess(res, pago, 'Pago a beneficiario registrado correctamente', 201);
});

const updatePago = asyncHandler(async (req, res) => {
  const pago = await service.update(req.params.id, req.body);
  sendSuccess(res, pago, 'Pago a beneficiario actualizado correctamente');
});

module.exports = {
  getPagos,
  getPagoById,
  createPago,
  updatePago,
};
