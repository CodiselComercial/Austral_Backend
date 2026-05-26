const SolicitudComisionService = require('./solicitudComision.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const service = new SolicitudComisionService();

const getComisiones = asyncHandler(async (req, res) => {
  const comisiones = await service.getAll(req.query);
  sendSuccess(res, comisiones, 'Comisiones obtenidas correctamente');
});

const getComisionById = asyncHandler(async (req, res) => {
  const comision = await service.getById(req.params.id);
  sendSuccess(res, comision, 'Comisiones obtenidas correctamente');
});

const createComision = asyncHandler(async (req, res) => {
  const comision = await service.create(req.body);
  sendSuccess(res, comision, 'Comisiones creadas correctamente', 201);
});

const updateComision = asyncHandler(async (req, res) => {
  const comision = await service.update(req.params.id, req.body);
  sendSuccess(res, comision, 'Comisiones actualizadas correctamente');
});

module.exports = {
  getComisiones,
  getComisionById,
  createComision,
  updateComision,
};
