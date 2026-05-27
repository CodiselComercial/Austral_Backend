const TABLE_NAME = 'cuentas_bancarias_beneficiarios';

const CuentaBancariaBeneficiarioModel = {
  TABLE_NAME,
  columns: [
    'id',
    'beneficiario_id',
    'banco',
    'cuenta',
    'clabe',
    'tarjeta',
    'es_principal',
    'created_at',
    'updated_at',
    'is_active',
  ],
};

module.exports = CuentaBancariaBeneficiarioModel;
