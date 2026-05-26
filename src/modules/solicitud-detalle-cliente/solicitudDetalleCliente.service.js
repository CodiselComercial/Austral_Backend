const AppError = require('../../shared/errors/AppError');
const SolicitudDetalleClienteRepository = require('./solicitudDetalleCliente.repository');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');

class SolicitudDetalleClienteService {
  constructor(
    repository = new SolicitudDetalleClienteRepository(),
    solicitudGuard = new SolicitudGuardService(),
  ) {
    this.repository = repository;
    this.solicitudGuard = solicitudGuard;
  }

  normalizeOptionalString(value) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    return value;
  }

  getAll(filters = {}) {
    return this.repository.findAll({ solicitudId: filters.solicitud_id || null });
  }

  async getById(id) {
    const detalle = await this.repository.findById(id);
    if (!detalle) {
      throw new AppError('Detalle de cliente no encontrado', 404);
    }
    return detalle;
  }

  async create(payload) {
    await this.solicitudGuard.assertSolicitudActiva(payload.solicitud_id);

    const existing = await this.repository.findBySolicitudId(payload.solicitud_id);
    if (existing) {
      throw new AppError('La solicitud ya tiene detalle de cliente registrado', 409);
    }

    const [detalle] = await this.repository.create({
      solicitud_id: payload.solicitud_id,
      empresa_cliente: this.normalizeOptionalString(payload.empresa_cliente),
      nombre_contacto: this.normalizeOptionalString(payload.nombre_contacto),
      apellido_p_contacto: this.normalizeOptionalString(payload.apellido_p_contacto),
      apellido_m_contacto: this.normalizeOptionalString(payload.apellido_m_contacto),
      telefono: this.normalizeOptionalString(payload.telefono),
      email: this.normalizeOptionalString(payload.email),
    });

    return this.getById(detalle.id);
  }

  async update(id, payload) {
    await this.getById(id);

    const updateData = {};
    const optionalFields = [
      'empresa_cliente',
      'nombre_contacto',
      'apellido_p_contacto',
      'apellido_m_contacto',
      'telefono',
      'email',
    ];

    optionalFields.forEach((field) => {
      if (payload[field] !== undefined) {
        updateData[field] = this.normalizeOptionalString(payload[field]);
      }
    });

    await this.repository.update(id, updateData);
    return this.getById(id);
  }
}

module.exports = SolicitudDetalleClienteService;
