const AppError = require('../../shared/errors/AppError');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');
const CuentaEmpresaAustralRepository = require('../cuentas-empresa-austral/cuentaEmpresaAustral.repository');
const SolicitudRetornoRepository = require('./solicitudRetorno.repository');

class SolicitudRetornoService {
  constructor(
    repository = new SolicitudRetornoRepository(),
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
    const retorno = await this.repository.findById(id);
    if (!retorno) {
      throw new AppError('Retorno de solicitud no encontrado', 404);
    }
    return retorno;
  }

  async create(payload) {
    await this.solicitudGuard.assertSolicitudActiva(payload.solicitud_id);

    const existing = await this.repository.findBySolicitudId(payload.solicitud_id);
    if (existing) {
      throw new AppError('La solicitud ya tiene retorno registrado', 409);
    }

    if (payload.cuenta_empresa_austral_id) {
      await this.validateCuentaEmpresa(payload.cuenta_empresa_austral_id);
    }

    const [retorno] = await this.repository.create({
      solicitud_id: payload.solicitud_id,
      metodo_devolucion: payload.metodo_devolucion,
      cuenta_empresa_austral_id: payload.cuenta_empresa_austral_id || null,
      cuenta_retorno: this.normalizeOptionalString(payload.cuenta_retorno),
      clave_retorno: this.normalizeOptionalString(payload.clave_retorno),
      tarjeta_retorno: this.normalizeOptionalString(payload.tarjeta_retorno),
      fecha_retorno: payload.fecha_retorno ?? null,
      monto_retorno: payload.monto_retorno ?? null,
    });

    return this.getById(retorno.id);
  }

  async update(id, payload) {
    await this.getById(id);

    if (payload.cuenta_empresa_austral_id !== undefined && payload.cuenta_empresa_austral_id !== null) {
      await this.validateCuentaEmpresa(payload.cuenta_empresa_austral_id);
    }

    const updateData = {};
    if (payload.metodo_devolucion !== undefined) {
      updateData.metodo_devolucion = payload.metodo_devolucion;
    }
    if (payload.cuenta_empresa_austral_id !== undefined) {
      updateData.cuenta_empresa_austral_id = payload.cuenta_empresa_austral_id;
    }
    if (payload.cuenta_retorno !== undefined) {
      updateData.cuenta_retorno = this.normalizeOptionalString(payload.cuenta_retorno);
    }
    if (payload.clave_retorno !== undefined) {
      updateData.clave_retorno = this.normalizeOptionalString(payload.clave_retorno);
    }
    if (payload.tarjeta_retorno !== undefined) {
      updateData.tarjeta_retorno = this.normalizeOptionalString(payload.tarjeta_retorno);
    }
    if (payload.fecha_retorno !== undefined) {
      updateData.fecha_retorno = payload.fecha_retorno;
    }
    if (payload.monto_retorno !== undefined) {
      updateData.monto_retorno = payload.monto_retorno;
    }

    await this.repository.update(id, updateData);
    return this.getById(id);
  }
}

module.exports = SolicitudRetornoService;
