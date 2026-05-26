const TABLE_NAME = 'solicitud_comentarios';

const SolicitudComentarioModel = {
  TABLE_NAME,
  columns: [
    'id',
    'solicitud_id',
    'escrito_por',
    'rol',
    'comentario',
    'fecha_comentario',
    'updated_at',
  ],
};

module.exports = SolicitudComentarioModel;
