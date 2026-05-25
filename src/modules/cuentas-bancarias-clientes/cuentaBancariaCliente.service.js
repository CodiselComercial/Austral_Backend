const AppError = require('../../shared/errors/AppError');
const CuentaBancariaClienteRepository = require('./cuentaBancariaCliente.repository');
const ClienteRepository = require('../clientes/cliente.repository');
const AsociadoRepository = require('../asociados/asociado.repository');
const ClienteAsociadoRepository = require('../cliente-asociados/clienteAsociado.repository');

class CuentaBancariaClienteService {
  constructor(
    cuentaRepository = new CuentaBancariaClienteRepository(),
    clienteRepository = new ClienteRepository(),
    asociadoRepository = new AsociadoRepository(),
    clienteAsociadoRepository = new ClienteAsociadoRepository(),
  ) {
    this.cuentaRepository = cuentaRepository;
    this.clienteRepository = clienteRepository;
    this.asociadoRepository = asociadoRepository;
    this.clienteAsociadoRepository = clienteAsociadoRepository;
  }

  parseActiveFilter(active) {
    if (active === 'true') return true;
    if (active === 'false') return false;
    return null;
  }

  normalizeAsociadoId(asociadoId) {
    if (asociadoId === undefined) return undefined;
    if (asociadoId === null || asociadoId === '') return null;
    return asociadoId;
  }

  parseSaldo(value) {
    return Number.parseFloat(value || 0);
  }

  getAll(filters = {}) {
    return this.cuentaRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
      clienteId: filters.cliente_id || null,
      asociadoId: filters.asociado_id || null,
    });
  }

  async getById(id) {
    const cuenta = await this.cuentaRepository.findById(id);
    if (!cuenta) {
      throw new AppError('Cuenta bancaria de cliente no encontrada', 404);
    }
    return cuenta;
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

  async validateAsociadoForCliente(clienteId, asociadoId) {
    if (!asociadoId) return null;

    const asociado = await this.asociadoRepository.findById(asociadoId);
    if (!asociado) {
      throw new AppError('El asociado indicado no existe', 404);
    }
    if (!asociado.is_active) {
      throw new AppError('El asociado indicado está inactivo', 400);
    }

    const relacion = await this.clienteAsociadoRepository.findByClienteAndAsociado(
      clienteId,
      asociadoId,
    );
    if (!relacion || !relacion.is_active) {
      throw new AppError('El asociado no está vinculado activamente a ese cliente', 400);
    }

    return asociado;
  }

  async validateUniqueNumeroCuenta(numeroCuenta, excludeId = null) {
    const existing = await this.cuentaRepository.findByNumeroCuenta(numeroCuenta, excludeId);
    if (existing) {
      throw new AppError('Ya existe una cuenta con ese número de cuenta', 409);
    }
  }

  async create(payload, createdBy) {
    const {
      cliente_id,
      asociado_id,
      alias = 'Cuenta Principal',
      numero_cuenta,
      limite_credito = 0,
    } = payload;

    const normalizedAsociadoId = this.normalizeAsociadoId(asociado_id);

    await this.validateClienteActivo(cliente_id);
    await this.validateAsociadoForCliente(cliente_id, normalizedAsociadoId);
    await this.validateUniqueNumeroCuenta(numero_cuenta);

    const [cuenta] = await this.cuentaRepository.create({
      cliente_id,
      asociado_id: normalizedAsociadoId,
      alias,
      numero_cuenta,
      saldo_disponible: 0,
      saldo_bloqueado: 0,
      limite_credito,
      created_by: createdBy,
      is_active: true,
    });

    return this.getById(cuenta.id);
  }

  async update(id, payload) {
    const cuenta = await this.getById(id);

    if (!cuenta.is_active) {
      throw new AppError('No se puede editar una cuenta inactiva', 400);
    }

    const updateData = {};

    if (payload.alias !== undefined) {
      updateData.alias = payload.alias;
    }

    if (payload.numero_cuenta !== undefined) {
      updateData.numero_cuenta = payload.numero_cuenta;
    }

    if (payload.asociado_id !== undefined) {
      const normalizedAsociadoId = this.normalizeAsociadoId(payload.asociado_id);
      await this.validateAsociadoForCliente(cuenta.cliente_id, normalizedAsociadoId);
      updateData.asociado_id = normalizedAsociadoId;
    }

    if (payload.limite_credito !== undefined) {
      updateData.limite_credito = payload.limite_credito;
    }

    await this.validateUniqueNumeroCuenta(
      updateData.numero_cuenta ?? cuenta.numero_cuenta,
      id,
    );

    await this.cuentaRepository.update(id, updateData);
    return this.getById(id);
  }

  async deactivate(id, deactivatedBy) {
    const cuenta = await this.getById(id);

    if (!cuenta.is_active) {
      throw new AppError('La cuenta ya está inactiva', 400);
    }

    const saldoDisponible = this.parseSaldo(cuenta.saldo_disponible);
    const saldoBloqueado = this.parseSaldo(cuenta.saldo_bloqueado);

    if (saldoDisponible !== 0 || saldoBloqueado !== 0) {
      throw new AppError(
        'No se puede desactivar una cuenta con saldo distinto de cero',
        400,
      );
    }

    await this.cuentaRepository.deactivate(id, deactivatedBy);
    return this.getById(id);
  }
}

module.exports = CuentaBancariaClienteService;
