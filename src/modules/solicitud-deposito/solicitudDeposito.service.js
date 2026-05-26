const AppError = require('../../shared/errors/AppError');
const SolicitudDepositoRepository = require('./solicitudDeposito.repository');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');
const CuentaEmpresaAustralRepository = require('../cuentas-empresa-austral/cuentaEmpresaAustral.repository');

class SolicitudDepositoService {
  constructor(
    repository = new SolicitudDepositoRepository(),
    solicitudGuard = new SolicitudGuardService(),
    cuentaEmpresaAustralRepository = new CuentaEmpresaAustralRepository(),
  ) {
    this.repository = repository;
    this.solicitudGuard = solicitudGuard;
    this.cuentaEmpresaAustralRepository = cuentaEmpresaAustralRepository;
  }

  normalizeOptionalString(value) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    return value;
  }

  async validateCuentaEmpresa(cuentaId) {
    const cuenta = await this.cuentaEmpresaAustralRepository.findById(cuentaId);
    if (!cuenta) throw new AppError('La cuenta empresa Austral indicada no existe', 404);
    if (!cuenta.is_active) throw new AppError('La cuenta empresa Austral indicada está inactiva', 400);
    return cuenta;
  }

  getAll(filters = {}) {
    return this.repository.findAll({ solicitudId: filters.solicitud_id || null });
  }

  async getById(id) {
    const deposito = await this.repository.findById(id);
    if (!deposito) {
      throw new AppError('Depósito de solicitud no encontrado', 404);
    }
    return deposito;
  }

  async create(payload) {
    await this.solicitudGuard.assertSolicitudActiva(payload.solicitud_id);
    await this.validateCuentaEmpresa(payload.cuenta_empresa_austral_id);

    const existing = await this.repository.findBySolicitudId(payload.solicitud_id);
    if (existing) {
      throw new AppError('La solicitud ya tiene depósito registrado', 409);
    }

    const [deposito] = await this.repository.create({
      solicitud_id: payload.solicitud_id,
      cuenta_empresa_austral_id: payload.cuenta_empresa_austral_id,
      cuenta_deposito: this.normalizeOptionalString(payload.cuenta_deposito),
      monto_depositado: payload.monto_depositado,
      fecha_deposito: payload.fecha_deposito,
      referencia_deposito: this.normalizeOptionalString(payload.referencia_deposito),
      ficha_url: this.normalizeOptionalString(payload.ficha_url),
      comentarios: this.normalizeOptionalString(payload.comentarios),
    });

    return this.getById(deposito.id);
  }

  async update(id, payload) {
    await this.getById(id);

    const updateData = {};
    if (payload.cuenta_empresa_austral_id !== undefined) {
      await this.validateCuentaEmpresa(payload.cuenta_empresa_austral_id);
      updateData.cuenta_empresa_austral_id = payload.cuenta_empresa_austral_id;
    }
    if (payload.cuenta_deposito !== undefined) {
      updateData.cuenta_deposito = this.normalizeOptionalString(payload.cuenta_deposito);
    }
    if (payload.monto_depositado !== undefined) {
      updateData.monto_depositado = payload.monto_depositado;
    }
    if (payload.fecha_deposito !== undefined) {
      updateData.fecha_deposito = payload.fecha_deposito;
    }
    if (payload.referencia_deposito !== undefined) {
      updateData.referencia_deposito = this.normalizeOptionalString(payload.referencia_deposito);
    }
    if (payload.ficha_url !== undefined) {
      updateData.ficha_url = this.normalizeOptionalString(payload.ficha_url);
    }
    if (payload.comentarios !== undefined) {
      updateData.comentarios = this.normalizeOptionalString(payload.comentarios);
    }

    await this.repository.update(id, updateData);
    return this.getById(id);
  }
}

module.exports = SolicitudDepositoService;
