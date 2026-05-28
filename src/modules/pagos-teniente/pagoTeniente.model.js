const TABLE_NAME = 'pagos_teniente';

const RECEPTOR_TIPOS = ['beneficiario', 'tercero'];

const PagoTenienteModel = {
  TABLE_NAME,
  RECEPTOR_TIPOS,
  columns: [
    'id',
    'pago_beneficiario_id',
    'beneficiario_id',
    'solicitud_id',
    'codigo_verificacion',
    'intentos_fallidos',
    'max_intentos',
    'bloqueado_hasta',
    'ultimo_intento_fallido',
    'entregado_por',
    'receptor_tipo',
    'receptor_nombre',
    'identificacion_receptor',
    'receptor_firma_url',
    'foto_comprobante_url',
    'latitud',
    'longitud',
    'created_at',
    'updated_at',
    'created_by',
    'updated_by',
    'estado_id',
    'deactivated_at',
    'deactivated_by',
    'observaciones',
  ],
};

module.exports = PagoTenienteModel;
