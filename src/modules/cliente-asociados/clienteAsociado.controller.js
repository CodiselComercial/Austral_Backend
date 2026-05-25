const ClienteAsociadoService = require('./clienteAsociado.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const clienteAsociadoService = new ClienteAsociadoService();

const getClienteAsociados = asyncHandler(async (req, res) => {
  const relaciones = await clienteAsociadoService.getAll(req.query);
  sendSuccess(res, relaciones, 'Relaciones cliente-asociado obtenidas correctamente');
});

const getClienteAsociadoById = asyncHandler(async (req, res) => {
  const relacion = await clienteAsociadoService.getById(req.params.id);
  sendSuccess(res, relacion, 'Relación cliente-asociado obtenida correctamente');
});

const assignClienteAsociado = asyncHandler(async (req, res) => {
  const relacion = await clienteAsociadoService.assign(req.body);
  sendSuccess(res, relacion, 'Asociado asignado al cliente correctamente', 201);
});

const deactivateClienteAsociado = asyncHandler(async (req, res) => {
  const relacion = await clienteAsociadoService.deactivate(req.params.id, req.user.id);
  sendSuccess(res, relacion, 'Relación cliente-asociado desactivada correctamente');
});

module.exports = {
  getClienteAsociados,
  getClienteAsociadoById,
  assignClienteAsociado,
  deactivateClienteAsociado,
};
