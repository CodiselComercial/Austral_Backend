const crypto = require('crypto');
const db = require('../../config/database');
const AppError = require('../../shared/errors/AppError');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');
const BeneficiarioRepository = require('../beneficiarios/beneficiario.repository');
const PagoBeneficiarioRepository = require('../pagos-beneficiarios/pagoBeneficiario.repository');
const PagoTenienteHistorialRepository = require('../pagos-teniente-historial/pagoTenienteHistorial.repository');
const PagoTenienteModel = require('./pagoTeniente.model');
const PagoTenienteRepository = require('./pagoTeniente.repository');

const ESTADO_PENDIENTE = 1;
const ESTADO_PAGADO = 4;
const BLOCK_MINUTES = 30;
const VALIDATION_WINDOW_MINUTES = 30;

class PagoTenienteService {
  constructor(
    repository = new PagoTenienteRepository(),
    historialRepository = new PagoTenienteHistorialRepository(),
    solicitudGuard = new SolicitudGuardService(),
    beneficiarioRepository = new BeneficiarioRepository(),
    pagoBeneficiarioRepository = new PagoBeneficiarioRepository(),
    database = db,
  ) {
    this.repository = repository;
    this.historialRepository = historialRepository;
    this.solicitudGuard = solicitudGuard;
    this.beneficiarioRepository = beneficiarioRepository;
    this.pagoBeneficiarioRepository = pagoBeneficiarioRepository;
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

  generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
  }

  async validateEstadoId(estadoId) {
    if (estadoId === null || estadoId === undefined) return;
    const estado = await this.db('cat_estados').where({ id: estadoId }).first();
    if (!estado) {
      throw new AppError('El estado indicado no existe', 404);
    }
  }

  async validateTenienteActivo(userId) {
    const teniente = await this.db('tenientes').where({ user_id: userId, is_active: true }).first();
    if (!teniente) {
      throw new AppError('El teniente indicado no existe o está inactivo', 400);
    }
    return teniente;
  }

  assertPagoActivo(pago) {
    if (pago.deactivated_at) {
      throw new AppError('El pago teniente está desactivado', 400);
    }
  }

  assertNotBlocked(pago) {
    if (pago.bloqueado_hasta && new Date(pago.bloqueado_hasta) > new Date()) {
      throw new AppError('El pago está bloqueado por intentos fallidos. Intente más tarde.', 429);
    }
  }

  assertTenienteOwnership(pago, user, roles = []) {
    if (roles.includes('ADMIN')) return;
    if (pago.entregado_por !== user.id) {
      throw new AppError('No tiene permiso para operar este pago', 403);
    }
  }

  async registrarHistorial(
    {
      pagoTenienteId,
      estadoAnteriorId,
      estadoNuevoId,
      evento,
      codigoProporcionado = null,
      esCorrecto = null,
      cambiadoPor,
      detalles = null,
    },
    meta = {},
    trx = null,
  ) {
    await this.historialRepository.create(
      {
        pago_teniente_id: pagoTenienteId,
        estado_anterior_id: estadoAnteriorId ?? null,
        estado_nuevo_id: estadoNuevoId,
        evento,
        codigo_proporcionado: codigoProporcionado,
        es_correcto: esCorrecto,
        cambiado_por: cambiadoPor,
        ip_origen: meta.ip_origen || null,
        user_agent: meta.user_agent || null,
        detalles: detalles || null,
      },
      trx,
    );
  }

  getAll(filters = {}, user = null, roles = []) {
    const entregadoPor = roles.includes('TENIENTE') && !roles.includes('ADMIN')
      ? user.id
      : filters.entregado_por || null;

    return this.repository.findAll({
      solicitudId: filters.solicitud_id || null,
      beneficiarioId: filters.beneficiario_id || null,
      estadoId: this.parseOptionalInt(filters.estado_id),
      entregadoPor,
      activeOnly: this.parseActiveFilter(filters.active),
    });
  }

  parseActiveFilter(value) {
    if (value === undefined || value === null || value === '') return null;
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return null;
  }

  async getById(id) {
    const pago = await this.repository.findById(id);
    if (!pago) {
      throw new AppError('Pago teniente no encontrado', 404);
    }
    return pago;
  }

  async create(payload, createdBy) {
    const pagoBeneficiario = await this.pagoBeneficiarioRepository.findById(payload.pago_beneficiario_id);
    if (!pagoBeneficiario) {
      throw new AppError('El pago a beneficiario indicado no existe', 404);
    }

    await this.solicitudGuard.assertSolicitudActiva(pagoBeneficiario.solicitud_id);
    await this.validateBeneficiarioFromPago(pagoBeneficiario, payload.beneficiario_id);
    await this.validateTenienteActivo(payload.entregado_por);

    const existing = await this.repository.findByPagoBeneficiarioId(payload.pago_beneficiario_id);
    if (existing) {
      throw new AppError('Ya existe un pago teniente para ese pago a beneficiario', 409);
    }

    if (payload.estado_id !== undefined) {
      await this.validateEstadoId(payload.estado_id);
    }

    const codigoVerificacion = this.generateVerificationCode();
    const maxIntentos = payload.max_intentos ?? 3;

    return this.db.transaction(async (trx) => {
      const [pago] = await this.repository.create(
        {
          pago_beneficiario_id: payload.pago_beneficiario_id,
          beneficiario_id: payload.beneficiario_id,
          solicitud_id: pagoBeneficiario.solicitud_id,
          codigo_verificacion: codigoVerificacion,
          max_intentos: maxIntentos,
          entregado_por: payload.entregado_por,
          receptor_tipo: payload.receptor_tipo ?? 'beneficiario',
          created_by: createdBy,
          estado_id: payload.estado_id ?? ESTADO_PENDIENTE,
          observaciones: this.normalizeOptionalString(payload.observaciones),
        },
        trx,
      );

      await this.registrarHistorial(
        {
          pagoTenienteId: pago.id,
          estadoAnteriorId: null,
          estadoNuevoId: pago.estado_id,
          evento: 'CREACION',
          cambiadoPor: createdBy,
          detalles: { codigo_generado: true },
        },
        {},
        trx,
      );

      const detalle = await this.repository.findById(pago.id, trx);
      return { ...detalle, codigo_verificacion: codigoVerificacion };
    });
  }

  async validateBeneficiarioFromPago(pagoBeneficiario, beneficiarioId) {
    if (pagoBeneficiario.beneficiario_id !== beneficiarioId) {
      throw new AppError('El beneficiario no coincide con el pago a beneficiario', 400);
    }
    const beneficiario = await this.beneficiarioRepository.findById(beneficiarioId);
    if (!beneficiario) throw new AppError('El beneficiario indicado no existe', 404);
    if (!beneficiario.is_active) throw new AppError('El beneficiario indicado está inactivo', 400);
  }

  async validarCodigo(id, payload, user, roles = [], meta = {}, trx = null) {
    const run = async (transaction) => {
      const pagoRaw = await this.repository.findByIdWithCode(id, transaction);
      if (!pagoRaw) {
        throw new AppError('Pago teniente no encontrado', 404);
      }

      this.assertPagoActivo(pagoRaw);
      this.assertNotBlocked(pagoRaw);
      this.assertTenienteOwnership(pagoRaw, user, roles);

      if (pagoRaw.estado_id === ESTADO_PAGADO) {
        throw new AppError('El pago ya fue entregado', 400);
      }

      const codigoProporcionado = payload.codigo.trim();
      const esCorrecto = codigoProporcionado === pagoRaw.codigo_verificacion;

      if (!esCorrecto) {
        const intentosFallidos = (pagoRaw.intentos_fallidos || 0) + 1;
        const updateData = {
          intentos_fallidos: intentosFallidos,
          ultimo_intento_fallido: new Date(),
          updated_by: user.id,
        };

        if (intentosFallidos >= pagoRaw.max_intentos) {
          const bloqueadoHasta = new Date();
          bloqueadoHasta.setMinutes(bloqueadoHasta.getMinutes() + BLOCK_MINUTES);
          updateData.bloqueado_hasta = bloqueadoHasta;
        }

        await this.repository.update(pagoRaw.id, updateData, transaction);

        await this.registrarHistorial(
          {
            pagoTenienteId: pagoRaw.id,
            estadoAnteriorId: pagoRaw.estado_id,
            estadoNuevoId: pagoRaw.estado_id,
            evento: 'VALIDACION_CODIGO',
            codigoProporcionado,
            esCorrecto: false,
            cambiadoPor: user.id,
            detalles: { intentos_fallidos: intentosFallidos },
          },
          meta,
          transaction,
        );

        if (intentosFallidos >= pagoRaw.max_intentos) {
          throw new AppError(
            `Código incorrecto. Se alcanzó el máximo de intentos (${pagoRaw.max_intentos}). Bloqueado por ${BLOCK_MINUTES} minutos.`,
            429,
          );
        }

        throw new AppError(
          `Código incorrecto. Intentos restantes: ${pagoRaw.max_intentos - intentosFallidos}`,
          400,
        );
      }

      await this.repository.update(
        pagoRaw.id,
        {
          intentos_fallidos: 0,
          bloqueado_hasta: null,
          updated_by: user.id,
        },
        transaction,
      );

      await this.registrarHistorial(
        {
          pagoTenienteId: pagoRaw.id,
          estadoAnteriorId: pagoRaw.estado_id,
          estadoNuevoId: pagoRaw.estado_id,
          evento: 'VALIDACION_CODIGO',
          codigoProporcionado,
          esCorrecto: true,
          cambiadoPor: user.id,
        },
        meta,
        transaction,
      );

      return {
        valido: true,
        mensaje: 'Código verificado correctamente',
        pago_teniente_id: pagoRaw.id,
      };
    };

    if (trx) return run(trx);
    return this.db.transaction(run);
  }

  async hasValidacionReciente(pagoTenienteId, trx = null) {
    const sinceDate = new Date();
    sinceDate.setMinutes(sinceDate.getMinutes() - VALIDATION_WINDOW_MINUTES);
    const registro = await this.historialRepository.findLastValidacionExitosa(
      pagoTenienteId,
      sinceDate,
      trx,
    );
    return Boolean(registro);
  }

  async entregar(id, payload, user, roles = [], meta = {}) {
    const pagoRaw = await this.repository.findByIdWithCode(id);
    if (!pagoRaw) {
      throw new AppError('Pago teniente no encontrado', 404);
    }

    this.assertPagoActivo(pagoRaw);
    this.assertNotBlocked(pagoRaw);
    this.assertTenienteOwnership(pagoRaw, user, roles);

    if (pagoRaw.estado_id === ESTADO_PAGADO) {
      throw new AppError('El pago ya fue entregado', 400);
    }

    if (payload.receptor_tipo && !PagoTenienteModel.RECEPTOR_TIPOS.includes(payload.receptor_tipo)) {
      throw new AppError(`receptor_tipo debe ser uno de: ${PagoTenienteModel.RECEPTOR_TIPOS.join(', ')}`, 400);
    }

    return this.db.transaction(async (trx) => {
      const validacionReciente = await this.hasValidacionReciente(pagoRaw.id, trx);

      if (!validacionReciente) {
        if (!payload.codigo) {
          throw new AppError(
            'Debe validar el código antes de entregar o incluirlo en la solicitud de entrega',
            400,
          );
        }
        await this.validarCodigo(id, { codigo: payload.codigo }, user, roles, meta, trx);
      }

      const updateData = {
        receptor_tipo: payload.receptor_tipo ?? pagoRaw.receptor_tipo,
        receptor_nombre: this.normalizeOptionalString(payload.receptor_nombre) ?? pagoRaw.receptor_nombre,
        identificacion_receptor:
          this.normalizeOptionalString(payload.identificacion_receptor) ?? pagoRaw.identificacion_receptor,
        receptor_firma_url:
          this.normalizeOptionalString(payload.receptor_firma_url) ?? pagoRaw.receptor_firma_url,
        foto_comprobante_url:
          this.normalizeOptionalString(payload.foto_comprobante_url) ?? pagoRaw.foto_comprobante_url,
        latitud: payload.latitud ?? pagoRaw.latitud,
        longitud: payload.longitud ?? pagoRaw.longitud,
        observaciones: this.normalizeOptionalString(payload.observaciones) ?? pagoRaw.observaciones,
        estado_id: ESTADO_PAGADO,
        updated_by: user.id,
      };

      if (updateData.latitud === null || updateData.latitud === undefined) {
        throw new AppError('La latitud es requerida para registrar la entrega', 400);
      }
      if (updateData.longitud === null || updateData.longitud === undefined) {
        throw new AppError('La longitud es requerida para registrar la entrega', 400);
      }

      await this.repository.update(pagoRaw.id, updateData, trx);

      await this.registrarHistorial(
        {
          pagoTenienteId: pagoRaw.id,
          estadoAnteriorId: pagoRaw.estado_id,
          estadoNuevoId: ESTADO_PAGADO,
          evento: 'ENTREGA',
          cambiadoPor: user.id,
          detalles: {
            latitud: updateData.latitud,
            longitud: updateData.longitud,
            receptor_tipo: updateData.receptor_tipo,
          },
        },
        meta,
        trx,
      );

      return this.repository.findById(pagoRaw.id, trx);
    });
  }

  async update(id, payload, user, roles = [], meta = {}) {
    const pago = await this.getById(id);
    this.assertPagoActivo(pago);

    if (roles.includes('TENIENTE') && !roles.includes('ADMIN')) {
      this.assertTenienteOwnership(pago, user, roles);
    }

    if (payload.estado_id !== undefined) {
      await this.validateEstadoId(payload.estado_id);
    }

    if (payload.entregado_por !== undefined) {
      await this.validateTenienteActivo(payload.entregado_por);
    }

    if (payload.receptor_tipo !== undefined && !PagoTenienteModel.RECEPTOR_TIPOS.includes(payload.receptor_tipo)) {
      throw new AppError(`receptor_tipo debe ser uno de: ${PagoTenienteModel.RECEPTOR_TIPOS.join(', ')}`, 400);
    }

    const updateData = {};
    if (payload.entregado_por !== undefined) updateData.entregado_por = payload.entregado_por;
    if (payload.receptor_tipo !== undefined) updateData.receptor_tipo = payload.receptor_tipo;
    if (payload.receptor_nombre !== undefined) {
      updateData.receptor_nombre = this.normalizeOptionalString(payload.receptor_nombre);
    }
    if (payload.identificacion_receptor !== undefined) {
      updateData.identificacion_receptor = this.normalizeOptionalString(payload.identificacion_receptor);
    }
    if (payload.receptor_firma_url !== undefined) {
      updateData.receptor_firma_url = this.normalizeOptionalString(payload.receptor_firma_url);
    }
    if (payload.foto_comprobante_url !== undefined) {
      updateData.foto_comprobante_url = this.normalizeOptionalString(payload.foto_comprobante_url);
    }
    if (payload.latitud !== undefined) updateData.latitud = payload.latitud;
    if (payload.longitud !== undefined) updateData.longitud = payload.longitud;
    if (payload.estado_id !== undefined) updateData.estado_id = payload.estado_id;
    if (payload.observaciones !== undefined) {
      updateData.observaciones = this.normalizeOptionalString(payload.observaciones);
    }
    if (payload.max_intentos !== undefined) updateData.max_intentos = payload.max_intentos;
    updateData.updated_by = user.id;

    const estadoAnteriorId = pago.estado_id;

    return this.db.transaction(async (trx) => {
      await this.repository.update(id, updateData, trx);

      const evento = payload.estado_id !== undefined && payload.estado_id !== estadoAnteriorId
        ? 'CAMBIO_ESTADO'
        : 'ACTUALIZACION';

      await this.registrarHistorial(
        {
          pagoTenienteId: id,
          estadoAnteriorId,
          estadoNuevoId: payload.estado_id ?? estadoAnteriorId,
          evento,
          cambiadoPor: user.id,
          detalles: updateData,
        },
        meta,
        trx,
      );

      return this.repository.findById(id, trx);
    });
  }

  async deactivate(id, user, roles = [], meta = {}) {
    const pago = await this.getById(id);
    this.assertPagoActivo(pago);

    if (roles.includes('TENIENTE') && !roles.includes('ADMIN')) {
      throw new AppError('Solo un administrador puede desactivar pagos teniente', 403);
    }

    return this.db.transaction(async (trx) => {
      await this.repository.deactivate(id, user.id, trx);

      await this.registrarHistorial(
        {
          pagoTenienteId: id,
          estadoAnteriorId: pago.estado_id,
          estadoNuevoId: pago.estado_id,
          evento: 'DESACTIVACION',
          cambiadoPor: user.id,
        },
        meta,
        trx,
      );

      return this.repository.findById(id, trx);
    });
  }
}

module.exports = PagoTenienteService;
