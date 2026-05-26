const SolicitudDetalleClienteService = require('./solicitudDetalleCliente.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const service = new SolicitudDetalleClienteService();

const getDetalles = asyncHandler(async (req, res) => {
  const detalles = await service.getAll(req.query);
  sendSuccess(res, detalles, 'Detalles de cliente obtenidos correctamente');
});

const getDetalleById = asyncHandler(async (req, res) => {
  const detalle = await service.getById(req.params.id);
  sendSuccess(res, detalle, 'Detalle de cliente obtenido correctamente');
});

const createDetalle = asyncHandler(async (req, res) => {
  const detalle = await service.create(req.body);
  sendSuccess(res, detalle, 'Detalle de cliente creado correctamente', 201);
});

const updateDetalle = asyncHandler(async (req, res) => {
  const detalle = await service.update(req.params.id, req.body);
  sendSuccess(res, detalle, 'Detalle de cliente actualizado correctamente');
});

module.exports = {
  getDetalles,
  getDetalleById,
  createDetalle,
  updateDetalle,
};
