const TABLE_NAME = 'cliente_beneficiarios';

const ClienteBeneficiarioModel = {
  TABLE_NAME,
  columns: ['id', 'cliente_id', 'beneficiario_id', 'assigned_at', 'updated_at'],
};

module.exports = ClienteBeneficiarioModel;
