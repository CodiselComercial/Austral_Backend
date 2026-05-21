const db = require('../../config/database');
const AppError = require('../../shared/errors/AppError');
const PersonaUserService = require('../../shared/personaUser.service');
const AsociadoRepository = require('./asociado.repository');

class AsociadoService {
  constructor(
    asociadoRepository = new AsociadoRepository(),
    personaUserService = new PersonaUserService(),
  ) {
    this.asociadoRepository = asociadoRepository;
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
    return this.asociadoRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
    });
  }

  async getById(id) {
    const asociado = await this.asociadoRepository.findById(id);
    if (!asociado) {
      throw new AppError('Asociado no encontrado', 404);
    }
    return asociado;
  }

  async validateUniqueFields({ celular, correo }, excludeId = null) {
    const existingCelular = await this.asociadoRepository.findByCelular(celular, excludeId);
    if (existingCelular) {
      throw new AppError('Ya existe un asociado con ese celular', 409);
    }

    const existingCorreo = await this.asociadoRepository.findByCorreo(correo, excludeId);
    if (existingCorreo) {
      throw new AppError('Ya existe un asociado con ese correo', 409);
    }
  }

  async create(payload) {
    const {
      nombre,
      apellido_p,
      apellido_m,
      celular,
      correo,
      comision,
      username,
      email,
      password,
    } = payload;

    await this.validateUniqueFields({ celular, correo });

    return db.transaction(async (trx) => {
      const user = await this.personaUserService.createLinkedUser(
        { username, email, password, roleName: 'ASOCIADO' },
        trx,
      );

      const [asociado] = await this.asociadoRepository.create(
        {
          nombre,
          apellido_p,
          apellido_m: this.normalizeApellidoM(apellido_m),
          celular,
          correo,
          comision,
          user_id: user.id,
          is_active: true,
        },
        trx,
      );

      return this.asociadoRepository.findById(asociado.id, trx);
    });
  }

  async update(id, payload) {
    const asociado = await this.getById(id);

    if (!asociado.is_active) {
      throw new AppError('No se puede editar un asociado inactivo', 400);
    }

    const updateData = {};

    if (payload.nombre !== undefined) updateData.nombre = payload.nombre;
    if (payload.apellido_p !== undefined) updateData.apellido_p = payload.apellido_p;
    if (payload.apellido_m !== undefined) {
      updateData.apellido_m = this.normalizeApellidoM(payload.apellido_m);
    }
    if (payload.celular !== undefined) updateData.celular = payload.celular;
    if (payload.correo !== undefined) updateData.correo = payload.correo;
    if (payload.comision !== undefined) updateData.comision = payload.comision;

    await this.validateUniqueFields(
      {
        celular: updateData.celular ?? asociado.celular,
        correo: updateData.correo ?? asociado.correo,
      },
      id,
    );

    await this.asociadoRepository.update(id, updateData);
    return this.getById(id);
  }

  async deactivate(id, deactivatedBy) {
    const asociado = await this.getById(id);

    if (!asociado.is_active) {
      throw new AppError('El asociado ya está inactivo', 400);
    }

    return db.transaction(async (trx) => {
      await this.asociadoRepository.deactivate(id, deactivatedBy, trx);
      await this.personaUserService.deactivateLinkedUser(asociado.user_id, deactivatedBy, trx);
      return this.asociadoRepository.findById(id, trx);
    });
  }
}

module.exports = AsociadoService;
