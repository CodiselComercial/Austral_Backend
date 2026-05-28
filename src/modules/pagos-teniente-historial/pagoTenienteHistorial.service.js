const db = require('../../config/database');
const AppError = require('../../shared/errors/AppError');
const PagoTenienteHistorialRepository = require('./pagoTenienteHistorial.repository');
const PagoTenienteRepository = require('../pagos-teniente/pagoTeniente.repository');
const PagoTenienteHistorialModel = require('./pagoTenienteHistorial.model');

class PagoTenienteHistorialService {
  constructor(
    repository = new PagoTenienteHistorialRepository(),
    pagoTenienteRepository = new PagoTenienteRepository(),
    database = db,
  ) {
    this.repository = repository;
    this.pagoTenienteRepository = pagoTenienteRepository;
    this.db = database;
  }

  parseOptionalInt(value) {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  async validateEstadoId(estadoId, fieldName) {
    if (estadoId === null || estadoId === undefined) return null;
    const estado = await this.db('cat_estados').where({ id: estadoId }).first();
    if (!estado) {
      throw new AppError(`El ${fieldName} indicado no existe`, 404);
    }
    return estado;
  }

  async assertPagoTenienteExists(pagoTenienteId) {
    const pago = await this.pagoTenienteRepository.findById(pagoTenienteId);
    if (!pago) {
      throw new AppError('El pago teniente indicado no existe', 404);
    }
    return pago;
  }

  getAll(filters = {}) {
    return this.repository.findAll({
      pagoTenienteId: filters.pago_teniente_id || null,
      evento: filters.evento || null,
    });
  }

  async getById(id) {
    const historial = await this.repository.findById(id);
    if (!historial) {
      throw new AppError('Registro de historial no encontrado', 404);
    }
    return historial;
  }

  async create(payload, user, meta = {}) {
    const pago = await this.assertPagoTenienteExists(payload.pago_teniente_id);
    await this.validateEstadoId(payload.estado_nuevo_id, 'estado nuevo');

    if (payload.estado_anterior_id !== undefined && payload.estado_anterior_id !== null) {
      await this.validateEstadoId(payload.estado_anterior_id, 'estado anterior');
    }

    if (payload.evento && !PagoTenienteHistorialModel.EVENTOS.includes(payload.evento)) {
      throw new AppError(
        `evento debe ser uno de: ${PagoTenienteHistorialModel.EVENTOS.join(', ')}`,
        400,
      );
    }

    const [historial] = await this.repository.create({
      pago_teniente_id: payload.pago_teniente_id,
      estado_anterior_id: payload.estado_anterior_id ?? pago.estado_id,
      estado_nuevo_id: payload.estado_nuevo_id,
      evento: payload.evento ?? 'ACTUALIZACION',
      codigo_proporcionado: payload.codigo_proporcionado ?? null,
      es_correcto: payload.es_correcto ?? null,
      cambiado_por: user.id,
      ip_origen: meta.ip_origen || null,
      user_agent: meta.user_agent || null,
      detalles: payload.detalles ?? null,
    });

    return this.getById(historial.id);
  }
}

module.exports = PagoTenienteHistorialService;
