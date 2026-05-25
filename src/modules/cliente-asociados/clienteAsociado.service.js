const AppError = require('../../shared/errors/AppError');
const ClienteAsociadoRepository = require('./clienteAsociado.repository');
const ClienteRepository = require('../clientes/cliente.repository');
const AsociadoRepository = require('../asociados/asociado.repository');

class ClienteAsociadoService {
  constructor(
    clienteAsociadoRepository = new ClienteAsociadoRepository(),
    clienteRepository = new ClienteRepository(),
    asociadoRepository = new AsociadoRepository(),
  ) {
    this.clienteAsociadoRepository = clienteAsociadoRepository;
    this.clienteRepository = clienteRepository;
    this.asociadoRepository = asociadoRepository;
  }

  parseActiveFilter(active) {
    if (active === 'true') return true;
    if (active === 'false') return false;
    return null;
  }

  getAll(filters = {}) {
    return this.clienteAsociadoRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
      clienteId: filters.cliente_id || null,
      asociadoId: filters.asociado_id || null,
    });
  }

  async getById(id) {
    const relacion = await this.clienteAsociadoRepository.findById(id);
    if (!relacion) {
      throw new AppError('Relación cliente-asociado no encontrada', 404);
    }
    return relacion;
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

  async validateAsociadoActivo(asociadoId) {
    const asociado = await this.asociadoRepository.findById(asociadoId);
    if (!asociado) {
      throw new AppError('El asociado indicado no existe', 404);
    }
    if (!asociado.is_active) {
      throw new AppError('El asociado indicado está inactivo', 400);
    }
    return asociado;
  }

  async assign({ cliente_id, asociado_id }) {
    await this.validateClienteActivo(cliente_id);
    await this.validateAsociadoActivo(asociado_id);

    const existing = await this.clienteAsociadoRepository.findByClienteAndAsociado(
      cliente_id,
      asociado_id,
    );

    if (existing) {
      if (existing.is_active) {
        throw new AppError('Ya existe una relación activa entre ese cliente y asociado', 409);
      }

      await this.clienteAsociadoRepository.reactivate(existing.id);
      return this.getById(existing.id);
    }

    const [relacion] = await this.clienteAsociadoRepository.create({
      cliente_id,
      asociado_id,
      is_active: true,
    });

    return this.getById(relacion.id);
  }

  async deactivate(id, deactivatedBy) {
    const relacion = await this.getById(id);

    if (!relacion.is_active) {
      throw new AppError('La relación cliente-asociado ya está inactiva', 400);
    }

    await this.clienteAsociadoRepository.deactivate(id, deactivatedBy);
    return this.getById(id);
  }
}

module.exports = ClienteAsociadoService;
