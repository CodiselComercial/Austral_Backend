const TABLE_NAME = 'solicitud_detalle_cliente';

const SolicitudDetalleClienteModel = {
  TABLE_NAME,
  columns: [
    'id',
    'solicitud_id',
    'empresa_cliente',
    'nombre_contacto',
    'apellido_p_contacto',
    'apellido_m_contacto',
    'telefono',
    'email',
    'created_at',
    'updated_at',
  ],
};

module.exports = SolicitudDetalleClienteModel;
