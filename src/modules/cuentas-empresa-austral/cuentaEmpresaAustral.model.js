const TABLE_NAME = 'cuentas_empresa_austral';

const CuentaEmpresaAustralModel = {
  TABLE_NAME,
  columns: [
    'id',
    'nombre_cuenta',
    'empresa_austral_id',
    'banco',
    'numero_clabe',
    'clave_interbancaria',
    'tarjeta',
    'saldo_actual',
    'saldo_disponible',
    'created_at',
    'updated_at',
    'created_by',
    'is_active',
    'deactivated_at',
    'deactivated_by',
  ],
  editableColumns: [
    'nombre_cuenta',
    'banco',
    'numero_clabe',
    'clave_interbancaria',
    'tarjeta',
  ],
};

module.exports = CuentaEmpresaAustralModel;
