const ClienteService = require('./cliente.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const clienteService = new ClienteService();

const getClientes = asyncHandler(async (req, res) => {
  const clientes = await clienteService.getAll(req.query);
  sendSuccess(res, clientes, 'Clientes obtenidos correctamente');
});

const getClienteById = asyncHandler(async (req, res) => {
  const cliente = await clienteService.getById(req.params.id);
  sendSuccess(res, cliente, 'Cliente obtenido correctamente');
});

const createCliente = asyncHandler(async (req, res) => {
  const cliente = await clienteService.create(req.body);
  sendSuccess(res, cliente, 'Cliente creado correctamente', 201);
});

const updateCliente = asyncHandler(async (req, res) => {
  const cliente = await clienteService.update(req.params.id, req.body);
  sendSuccess(res, cliente, 'Cliente actualizado correctamente');
});

const deactivateCliente = asyncHandler(async (req, res) => {
  const cliente = await clienteService.deactivate(req.params.id, req.user.id);
  sendSuccess(res, cliente, 'Cliente desactivado correctamente');
});

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deactivateCliente,
};
