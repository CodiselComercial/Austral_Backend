const db = require('../../config/database');
const AppError = require('../../shared/errors/AppError');
const PersonaUserService = require('../../shared/personaUser.service');
const TenienteRepository = require('./teniente.repository');

class TenienteService {
  constructor(
    tenienteRepository = new TenienteRepository(),
    personaUserService = new PersonaUserService(),
  ) {
    this.tenienteRepository = tenienteRepository;
    this.personaUserService = personaUserService;
  }

  parseActiveFilter(active) {
    if (active === 'true') return true;
    if (active === 'false') return false;
    return null;
  }

  getAll(filters = {}) {
    return this.tenienteRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
    });
  }

  async getById(id) {
    const teniente = await this.tenienteRepository.findById(id);
    if (!teniente) {
      throw new AppError('Teniente no encontrado', 404);
    }
    return teniente;
  }

  async create(payload, createdBy) {
    const { nombre, telefono, username, email, password } = payload;

    return db.transaction(async (trx) => {
      const user = await this.personaUserService.createLinkedUser(
        { username, email, password, roleName: 'TENIENTE' },
        trx,
      );

      const [teniente] = await this.tenienteRepository.create(
        {
          nombre,
          telefono,
          user_id: user.id,
          created_by: createdBy,
          is_active: true,
        },
        trx,
      );

      return this.tenienteRepository.findById(teniente.id, trx);
    });
  }

  async update(id, payload) {
    const teniente = await this.getById(id);

    if (!teniente.is_active) {
      throw new AppError('No se puede editar un teniente inactivo', 400);
    }

    const updateData = {};
    if (payload.nombre !== undefined) updateData.nombre = payload.nombre;
    if (payload.telefono !== undefined) updateData.telefono = payload.telefono;

    await this.tenienteRepository.update(id, updateData);
    return this.getById(id);
  }

  async deactivate(id, deactivatedBy) {
    const teniente = await this.getById(id);

    if (!teniente.is_active) {
      throw new AppError('El teniente ya está inactivo', 400);
    }

    return db.transaction(async (trx) => {
      await this.tenienteRepository.deactivate(id, deactivatedBy, trx);
      await this.personaUserService.deactivateLinkedUser(teniente.user_id, deactivatedBy, trx);
      return this.tenienteRepository.findById(id, trx);
    });
  }
}

module.exports = TenienteService;
