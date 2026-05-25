const AppError = require('../../shared/errors/AppError');
const ClienteBeneficiarioRepository = require('./clienteBeneficiario.repository');
const ClienteRepository = require('../clientes/cliente.repository');
const BeneficiarioRepository = require('../beneficiarios/beneficiario.repository');

class ClienteBeneficiarioService {
  constructor(
    clienteBeneficiarioRepository = new ClienteBeneficiarioRepository(),
    clienteRepository = new ClienteRepository(),
    beneficiarioRepository = new BeneficiarioRepository(),
  ) {
    this.clienteBeneficiarioRepository = clienteBeneficiarioRepository;
    this.clienteRepository = clienteRepository;
    this.beneficiarioRepository = beneficiarioRepository;
  }

  getAll(filters = {}) {
    return this.clienteBeneficiarioRepository.findAll({
      clienteId: filters.cliente_id || null,
      beneficiarioId: filters.beneficiario_id || null,
    });
  }

  async getById(id) {
    const asignacion = await this.clienteBeneficiarioRepository.findById(id);
    if (!asignacion) {
      throw new AppError('Asignación cliente-beneficiario no encontrada', 404);
    }
    return asignacion;
  }

  async validateClienteActivo(clienteId) {
    const cliente = await this.clienteRepository.findById(clienteId);
    if (!cliente) {
      throw new AppError('El cliente indicado no existe', 404);
    }
    if (!cliente.is_active) {
      throw new AppError('El cliente indicado está inactivo', 400);
    }
    return cliente;
  }

  async validateBeneficiarioActivo(beneficiarioId) {
    const beneficiario = await this.beneficiarioRepository.findById(beneficiarioId);
    if (!beneficiario) {
      throw new AppError('El beneficiario indicado no existe', 404);
    }
    if (!beneficiario.is_active) {
      throw new AppError('El beneficiario indicado está inactivo', 400);
    }
    return beneficiario;
  }

  async assign({ cliente_id, beneficiario_id }) {
    await this.validateClienteActivo(cliente_id);
    await this.validateBeneficiarioActivo(beneficiario_id);

    const existing = await this.clienteBeneficiarioRepository.findByClienteAndBeneficiario(
      cliente_id,
      beneficiario_id,
    );
    if (existing) {
      throw new AppError('Ese beneficiario ya está asignado al cliente', 409);
    }

    const [asignacion] = await this.clienteBeneficiarioRepository.create({
      cliente_id,
      beneficiario_id,
    });

    return this.getById(asignacion.id);
  }

  async remove(id) {
    await this.getById(id);
    await this.clienteBeneficiarioRepository.remove(id);
  }
}

module.exports = ClienteBeneficiarioService;
