const db = require('../../config/database');
const AppError = require('../../shared/errors/AppError');
const PersonaUserService = require('../../shared/personaUser.service');
const BeneficiarioRepository = require('./beneficiario.repository');

class BeneficiarioService {
  constructor(
    beneficiarioRepository = new BeneficiarioRepository(),
    personaUserService = new PersonaUserService(),
  ) {
    this.beneficiarioRepository = beneficiarioRepository;
    this.personaUserService = personaUserService;
  }

  parseActiveFilter(active) {
    if (active === 'true') return true;
    if (active === 'false') return false;
    return null;
  }

  normalizeApellidoM(apellidoM) {
    if (apellidoM === undefined) return undefined;
    if (apellidoM === null || apellidoM === '') return null;
    return apellidoM;
  }

  getAll(filters = {}) {
    return this.beneficiarioRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
    });
  }

  async getById(id) {
    const beneficiario = await this.beneficiarioRepository.findById(id);
    if (!beneficiario) {
      throw new AppError('Beneficiario no encontrado', 404);
    }
    return beneficiario;
  }

  async create(payload) {
    const { nombre, apellido_p, apellido_m, username, email, password } = payload;

    return db.transaction(async (trx) => {
      const user = await this.personaUserService.createLinkedUser(
        { username, email, password, roleName: 'BENEFICIARIO' },
        trx,
      );

      const [beneficiario] = await this.beneficiarioRepository.create(
        {
          nombre,
          apellido_p,
          apellido_m: this.normalizeApellidoM(apellido_m),
          user_id: user.id,
          is_active: true,
        },
        trx,
      );

      return this.beneficiarioRepository.findById(beneficiario.id, trx);
    });
  }

  async update(id, payload) {
    const beneficiario = await this.getById(id);

    if (!beneficiario.is_active) {
      throw new AppError('No se puede editar un beneficiario inactivo', 400);
    }

    const updateData = {};
    if (payload.nombre !== undefined) updateData.nombre = payload.nombre;
    if (payload.apellido_p !== undefined) updateData.apellido_p = payload.apellido_p;
    if (payload.apellido_m !== undefined) {
      updateData.apellido_m = this.normalizeApellidoM(payload.apellido_m);
    }

    await this.beneficiarioRepository.update(id, updateData);
    return this.getById(id);
  }

  async deactivate(id, deactivatedBy) {
    const beneficiario = await this.getById(id);

    if (!beneficiario.is_active) {
      throw new AppError('El beneficiario ya está inactivo', 400);
    }

    return db.transaction(async (trx) => {
      await this.beneficiarioRepository.deactivate(id, deactivatedBy, trx);
      await this.personaUserService.deactivateLinkedUser(beneficiario.user_id, deactivatedBy, trx);
      return this.beneficiarioRepository.findById(id, trx);
    });
  }
}

module.exports = BeneficiarioService;
