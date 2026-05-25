const TABLE_NAME = 'clientes';

const ClienteModel = {
  TABLE_NAME,
  columns: [
    'id',
    'empresa',
    'nombre_contacto',
    'apellido_p_contacto',
    'apellido_m_contacto',
    'telefono1',
    'telefono2',
    'correo1',
    'correo2',
    'calle',
    'num_exterior',
    'num_interior',
    'colonia',
    'municipio',
    'ciudad',
    'estado',
    'pais',
    'codigo_postal',
    'rfc',
    'comision',
    'created_at',
    'updated_at',
    'is_active',
    'deactivated_at',
    'deactivated_by',
  ],
};

module.exports = ClienteModel;
