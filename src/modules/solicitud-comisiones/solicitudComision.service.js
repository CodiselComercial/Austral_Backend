const AppError = require('../../shared/errors/AppError');
const SolicitudComisionRepository = require('./solicitudComision.repository');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');

class SolicitudComisionService {
  constructor(
    repository = new SolicitudComisionRepository(),
    solicitudGuard = new SolicitudGuardService(),
  ) {
    this.repository = repository;
    this.solicitudGuard = solicitudGuard;
  }

  getAll(filters = {}) {
    return this.repository.findAll({ solicitudId: filters.solicitud_id || null });
  }

  async getById(id) {
    const comision = await this.repository.findById(id);
    if (!comision) {
      throw new AppError('Comisiones de solicitud no encontradas', 404);
    }
    return comision;
  }

  async create(payload) {
    await this.solicitudGuard.assertSolicitudActiva(payload.solicitud_id);

    const existing = await this.repository.findBySolicitudId(payload.solicitud_id);
    if (existing) {
      throw new AppError('La solicitud ya tiene comisiones registradas', 409);
    }

    const [comision] = await this.repository.create({
      solicitud_id: payload.solicitud_id,
      comision_asociado: payload.comision_asociado ?? 0,
      comision_cliente: payload.comision_cliente ?? 0,
      monto_comision_asociado: payload.monto_comision_asociado ?? null,
      monto_comision_cliente: payload.monto_comision_cliente ?? null,
      pagado_asociado: payload.pagado_asociado ?? false,
      pagado_cliente: payload.pagado_cliente ?? false,
    });

    return this.getById(comision.id);
  }

  async update(id, payload) {
    await this.getById(id);

    const updateData = {};
    const fields = [
      'comision_asociado',
      'comision_cliente',
      'monto_comision_asociado',
      'monto_comision_cliente',
      'pagado_asociado',
      'pagado_cliente',
    ];

    fields.forEach((field) => {
      if (payload[field] !== undefined) {
        updateData[field] = payload[field];
      }
    });

    await this.repository.update(id, updateData);
    return this.getById(id);
  }
}

module.exports = SolicitudComisionService;
