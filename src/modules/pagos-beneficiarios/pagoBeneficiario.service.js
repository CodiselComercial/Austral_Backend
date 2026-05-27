const db = require('../../config/database');
const AppError = require('../../shared/errors/AppError');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');
const BeneficiarioRepository = require('../beneficiarios/beneficiario.repository');
const CuentaEmpresaAustralRepository = require('../cuentas-empresa-austral/cuentaEmpresaAustral.repository');
const PagoBeneficiarioRepository = require('./pagoBeneficiario.repository');

class PagoBeneficiarioService {
  constructor(
    repository = new PagoBeneficiarioRepository(),
    solicitudGuard = new SolicitudGuardService(),
    beneficiarioRepository = new BeneficiarioRepository(),
    cuentaEmpresaAustralRepository = new CuentaEmpresaAustralRepository(),
    database = db,
  ) {
    this.repository = repository;
    this.solicitudGuard = solicitudGuard;
    this.beneficiarioRepository = beneficiarioRepository;
    this.cuentaEmpresaAustralRepository = cuentaEmpresaAustralRepository;
    this.db = database;
  }

  normalizeOptionalString(value) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    return value;
  }

  parseOptionalInt(value) {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  async validateEstadoId(estadoId) {
    if (estadoId === null || estadoId === undefined) return;
    const estado = await this.db('cat_estados').where({ id: estadoId }).first();
    if (!estado) {
      throw new AppError('El estado indicado no existe', 404);
    }
  }

  async validateBeneficiarioActivo(beneficiarioId) {
    const beneficiario = await this.beneficiarioRepository.findById(beneficiarioId);
    if (!beneficiario) throw new AppError('El beneficiario indicado no existe', 404);
    if (!beneficiario.is_active) throw new AppError('El beneficiario indicado está inactivo', 400);
    return beneficiario;
  }

  async validateCuentaEmpresa(cuentaId) {
    const cuenta = await this.cuentaEmpresaAustralRepository.findById(cuentaId);
    if (!cuenta) throw new AppError('La cuenta empresa Austral indicada no existe', 404);
    if (!cuenta.is_active) throw new AppError('La cuenta empresa Austral indicada está inactiva', 400);
    return cuenta;
  }

  getAll(filters = {}) {
    return this.repository.findAll({
      solicitudId: filters.solicitud_id || null,
      beneficiarioId: filters.beneficiario_id || null,
      estadoId: this.parseOptionalInt(filters.estado_id),
    });
  }

  async getById(id) {
    const pago = await this.repository.findById(id);
    if (!pago) {
      throw new AppError('Pago a beneficiario no encontrado', 404);
    }
    return pago;
  }

  async create(payload, pagadoPor) {
    await this.solicitudGuard.assertSolicitudActiva(payload.solicitud_id);
    await this.validateBeneficiarioActivo(payload.beneficiario_id);
    await this.validateCuentaEmpresa(payload.cuenta_empresa_austral_id);

    if (payload.estado_id !== undefined) {
      await this.validateEstadoId(payload.estado_id);
    }

    const existing = await this.repository.findBySolicitudAndBeneficiario(
      payload.solicitud_id,
      payload.beneficiario_id,
    );
    if (existing) {
      throw new AppError('Ya existe un pago para ese beneficiario en la solicitud', 409);
    }

    const [pago] = await this.repository.create({
      solicitud_id: payload.solicitud_id,
      beneficiario_id: payload.beneficiario_id,
      cuenta_empresa_austral_id: payload.cuenta_empresa_austral_id,
      monto_pagado: payload.monto_pagado,
      comprobante_url: this.normalizeOptionalString(payload.comprobante_url),
      fecha_pago: payload.fecha_pago ?? new Date(),
      pagado_por: pagadoPor,
      estado_id: payload.estado_id ?? 1,
    });

    return this.getById(pago.id);
  }

  async update(id, payload) {
    await this.getById(id);

    if (payload.cuenta_empresa_austral_id !== undefined) {
      await this.validateCuentaEmpresa(payload.cuenta_empresa_austral_id);
    }

    if (payload.estado_id !== undefined) {
      await this.validateEstadoId(payload.estado_id);
    }

    const updateData = {};
    if (payload.cuenta_empresa_austral_id !== undefined) {
      updateData.cuenta_empresa_austral_id = payload.cuenta_empresa_austral_id;
    }
    if (payload.monto_pagado !== undefined) {
      updateData.monto_pagado = payload.monto_pagado;
    }
    if (payload.fecha_pago !== undefined) {
      updateData.fecha_pago = payload.fecha_pago;
    }
    if (payload.estado_id !== undefined) {
      updateData.estado_id = payload.estado_id;
    }
    if (payload.comprobante_url !== undefined) {
      updateData.comprobante_url = this.normalizeOptionalString(payload.comprobante_url);
    }

    await this.repository.update(id, updateData);
    return this.getById(id);
  }
}

module.exports = PagoBeneficiarioService;
