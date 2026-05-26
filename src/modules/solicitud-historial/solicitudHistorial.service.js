const db = require('../../config/database');
const AppError = require('../../shared/errors/AppError');
const SolicitudHistorialRepository = require('./solicitudHistorial.repository');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');

class SolicitudHistorialService {
  constructor(
    repository = new SolicitudHistorialRepository(),
    solicitudGuard = new SolicitudGuardService(),
    database = db,
  ) {
    this.repository = repository;
    this.solicitudGuard = solicitudGuard;
    this.db = database;
  }

  normalizeOptionalString(value) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    return value;
  }

  async validateEstadoId(estadoId, fieldName) {
    if (estadoId === null || estadoId === undefined) return null;
    const estado = await this.db('cat_estados').where({ id: estadoId }).first();
    if (!estado) {
      throw new AppError(`El ${fieldName} indicado no existe`, 404);
    }
    return estado;
  }

  getAll(filters = {}) {
    return this.repository.findAll({ solicitudId: filters.solicitud_id || null });
  }

  async getById(id) {
    const historial = await this.repository.findById(id);
    if (!historial) {
      throw new AppError('Registro de historial no encontrado', 404);
    }
    return historial;
  }

  async create(payload, user, meta = {}) {
    await this.solicitudGuard.assertSolicitudActiva(payload.solicitud_id);
    await this.validateEstadoId(payload.estado_nuevo_id, 'estado nuevo');

    if (payload.estado_anterior_id !== undefined && payload.estado_anterior_id !== null) {
      await this.validateEstadoId(payload.estado_anterior_id, 'estado anterior');
    }

    const [historial] = await this.repository.create({
      solicitud_id: payload.solicitud_id,
      estado_anterior_id: payload.estado_anterior_id ?? null,
      estado_nuevo_id: payload.estado_nuevo_id,
      cambiado_por: user.id,
      motivo: this.normalizeOptionalString(payload.motivo),
      ip_address: meta.ip_address || null,
      user_agent: meta.user_agent || null,
    });

    return this.getById(historial.id);
  }
}

module.exports = SolicitudHistorialService;
