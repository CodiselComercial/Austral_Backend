const SolicitudDepositoService = require('./solicitudDeposito.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const service = new SolicitudDepositoService();

const getDepositos = asyncHandler(async (req, res) => {
  const depositos = await service.getAll(req.query);
  sendSuccess(res, depositos, 'Depósitos obtenidos correctamente');
});

const getDepositoById = asyncHandler(async (req, res) => {
  const deposito = await service.getById(req.params.id);
  sendSuccess(res, deposito, 'Depósito obtenido correctamente');
});

const createDeposito = asyncHandler(async (req, res) => {
  const deposito = await service.create(req.body);
  sendSuccess(res, deposito, 'Depósito creado correctamente', 201);
});

const updateDeposito = asyncHandler(async (req, res) => {
  const deposito = await service.update(req.params.id, req.body);
  sendSuccess(res, deposito, 'Depósito actualizado correctamente');
});

module.exports = {
  getDepositos,
  getDepositoById,
  createDeposito,
  updateDeposito,
};
