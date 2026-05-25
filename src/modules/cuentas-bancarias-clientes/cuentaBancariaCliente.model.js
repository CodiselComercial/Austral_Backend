const TABLE_NAME = 'cuentas_bancarias_clientes';

const CuentaBancariaClienteModel = {
  TABLE_NAME,
  columns: [
    'id',
    'cliente_id',
    'asociado_id',
    'alias',
    'numero_cuenta',
    'saldo_disponible',
    'saldo_bloqueado',
    'limite_credito',
    'created_at',
    'updated_at',
    'created_by',
    'is_active',
    'deactivated_at',
    'deactivated_by',
  ],
};

module.exports = CuentaBancariaClienteModel;
