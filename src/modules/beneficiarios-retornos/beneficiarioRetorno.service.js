const db = require('../../config/database');
const AppError = require('../../shared/errors/AppError');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');
const BeneficiarioRepository = require('../beneficiarios/beneficiario.repository');
const CuentaBancariaBeneficiarioRepository = require('../cuentas-bancarias-beneficiarios/cuentaBancariaBeneficiario.repository');
const BeneficiarioRetornoRepository = require('./beneficiarioRetorno.repository');

class BeneficiarioRetornoService {
  constructor(
    repository = new BeneficiarioRetornoRepository(),
    solicitudGuard = new SolicitudGuardService(),
    beneficiarioRepository = new BeneficiarioRepository(),
    cuentaBancariaBeneficiarioRepository = new CuentaBancariaBeneficiarioRepository(),
    database = db,
  ) {
    this.repository = repository;
    this.solicitudGuard = solicitudGuard;
    this.beneficiarioRepository = beneficiarioRepository;
    this.cuentaBancariaBeneficiarioRepository = cuentaBancariaBeneficiarioRepository;
    this.db = database;
  }

  normalizeOptionalString(value) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    return value;
  }

  async validateEstadoPagoId(estadoPagoId) {
    if (estadoPagoId === null || estadoPagoId === undefined) return;
    const estado = await this.db('cat_estados').where({ id: estadoPagoId }).first();
    if (!estado) {
      throw new AppError('El estado de pago indicado no existe', 404);
    }
  }

  async validateBeneficiarioActivo(beneficiarioId) {
    const beneficiario = await this.beneficiarioRepository.findById(beneficiarioId);
    if (!beneficiario) throw new AppError('El beneficiario indicado no existe', 404);
    if (!beneficiario.is_active) throw new AppError('El beneficiario indicado está inactivo', 400);
    return beneficiario;
  }

  async validateCuentaBancaria(cuentaId, beneficiarioId = null) {
    const cuenta = await this.cuentaBancariaBeneficiarioRepository.findById(cuentaId);
    if (!cuenta) throw new AppError('La cuenta bancaria del beneficiario no existe', 404);
    if (!cuenta.is_active) {
      throw new AppError('La cuenta bancaria del beneficiario está inactiva', 400);
    }
    if (beneficiarioId && cuenta.beneficiario_id !== beneficiarioId) {
      throw new AppError('La cuenta bancaria no pertenece al beneficiario indicado', 400);
    }
    return cuenta;
  }

  getAll(filters = {}) {
    return this.repository.findAll({
      solicitudId: filters.solicitud_id || null,
      beneficiarioId: filters.beneficiario_id || null,
    });
  }

  async getById(id) {
    const retorno = await this.repository.findById(id);
    if (!retorno) {
      throw new AppError('Retorno de beneficiario no encontrado', 404);
    }
    return retorno;
  }

  async create(payload) {
    await this.solicitudGuard.assertSolicitudActiva(payload.solicitud_id);

    let beneficiario = null;
    if (payload.beneficiario_id) {
      beneficiario = await this.validateBeneficiarioActivo(payload.beneficiario_id);
    }

    if (payload.cuenta_bancaria_beneficiario_id) {
      await this.validateCuentaBancaria(
        payload.cuenta_bancaria_beneficiario_id,
        payload.beneficiario_id || null,
      );
    }

    if (payload.estado_pago_id !== undefined) {
      await this.validateEstadoPagoId(payload.estado_pago_id);
    }

    const [retorno] = await this.repository.create({
      solicitud_id: payload.solicitud_id,
      beneficiario_id: payload.beneficiario_id || null,
      nombre_beneficiario: this.normalizeOptionalString(payload.nombre_beneficiario)
        ?? (beneficiario ? beneficiario.nombre : null),
      apellido_p_beneficiario: this.normalizeOptionalString(payload.apellido_p_beneficiario)
        ?? (beneficiario ? beneficiario.apellido_p : null),
      apellido_m_beneficiario: this.normalizeOptionalString(payload.apellido_m_beneficiario)
        ?? (beneficiario ? beneficiario.apellido_m : null),
      monto_beneficiario: payload.monto_beneficiario,
      cuenta_bancaria_beneficiario_id: payload.cuenta_bancaria_beneficiario_id || null,
      metodo_pago: payload.metodo_pago,
      monto_pagado: payload.monto_pagado ?? null,
      comprobante_url: this.normalizeOptionalString(payload.comprobante_url),
      fecha_pago: payload.fecha_pago ?? null,
      estado_pago_id: payload.estado_pago_id ?? 1,
    });

    return this.getById(retorno.id);
  }

  async update(id, payload) {
    const retorno = await this.getById(id);

    if (payload.beneficiario_id !== undefined && payload.beneficiario_id !== null) {
      await this.validateBeneficiarioActivo(payload.beneficiario_id);
    }

    const beneficiarioId = payload.beneficiario_id !== undefined
      ? payload.beneficiario_id
      : retorno.beneficiario_id;

    if (payload.cuenta_bancaria_beneficiario_id !== undefined && payload.cuenta_bancaria_beneficiario_id !== null) {
      await this.validateCuentaBancaria(payload.cuenta_bancaria_beneficiario_id, beneficiarioId);
    }

    if (payload.estado_pago_id !== undefined) {
      await this.validateEstadoPagoId(payload.estado_pago_id);
    }

    const updateData = {};
    const fields = [
      'beneficiario_id',
      'nombre_beneficiario',
      'apellido_p_beneficiario',
      'apellido_m_beneficiario',
      'monto_beneficiario',
      'cuenta_bancaria_beneficiario_id',
      'metodo_pago',
      'monto_pagado',
      'fecha_pago',
      'estado_pago_id',
    ];

    fields.forEach((field) => {
      if (payload[field] !== undefined) {
        updateData[field] = payload[field];
      }
    });

    if (payload.comprobante_url !== undefined) {
      updateData.comprobante_url = this.normalizeOptionalString(payload.comprobante_url);
    }

    await this.repository.update(id, updateData);
    return this.getById(id);
  }
}

module.exports = BeneficiarioRetornoService;
