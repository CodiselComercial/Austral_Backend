const SolicitudComentarioService = require('./solicitudComentario.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const service = new SolicitudComentarioService();

const getComentarios = asyncHandler(async (req, res) => {
  const comentarios = await service.getAll(req.query);
  sendSuccess(res, comentarios, 'Comentarios obtenidos correctamente');
});

const getComentarioById = asyncHandler(async (req, res) => {
  const comentario = await service.getById(req.params.id);
  sendSuccess(res, comentario, 'Comentario obtenido correctamente');
});

const createComentario = asyncHandler(async (req, res) => {
  const comentario = await service.create(req.body, req.user);
  sendSuccess(res, comentario, 'Comentario creado correctamente', 201);
});

const updateComentario = asyncHandler(async (req, res) => {
  const comentario = await service.update(req.params.id, req.body, req.user.id);
  sendSuccess(res, comentario, 'Comentario actualizado correctamente');
});

module.exports = {
  getComentarios,
  getComentarioById,
  createComentario,
  updateComentario,
};
