const AppError = require('../../shared/errors/AppError');
const SolicitudComentarioRepository = require('./solicitudComentario.repository');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');

const ROLES_VALIDOS = ['ADMIN', 'USER', 'ASOCIADO', 'TENIENTE', 'BENEFICIARIO', 'SISTEMA'];

class SolicitudComentarioService {
  constructor(
    repository = new SolicitudComentarioRepository(),
    solicitudGuard = new SolicitudGuardService(),
  ) {
    this.repository = repository;
    this.solicitudGuard = solicitudGuard;
  }

  resolveRol(payloadRol, userRoles = []) {
    if (payloadRol) return payloadRol;
    if (userRoles.includes('ADMIN')) return 'ADMIN';
    if (userRoles.length > 0) return userRoles[0];
    return 'USER';
  }

  getAll(filters = {}) {
    return this.repository.findAll({ solicitudId: filters.solicitud_id || null });
  }

  async getById(id) {
    const comentario = await this.repository.findById(id);
    if (!comentario) {
      throw new AppError('Comentario no encontrado', 404);
    }
    return comentario;
  }

  async create(payload, user) {
    await this.solicitudGuard.assertSolicitudActiva(payload.solicitud_id);

    const rol = this.resolveRol(payload.rol, user.roles);
    if (!ROLES_VALIDOS.includes(rol)) {
      throw new AppError('Rol de comentario inválido', 400);
    }

    const [comentario] = await this.repository.create({
      solicitud_id: payload.solicitud_id,
      escrito_por: user.id,
      rol,
      comentario: payload.comentario,
    });

    return this.getById(comentario.id);
  }

  async update(id, payload, userId) {
    const comentario = await this.getById(id);

    if (comentario.escrito_por !== userId) {
      throw new AppError('Solo el autor puede editar el comentario', 403);
    }

    await this.repository.update(id, { comentario: payload.comentario });
    return this.getById(id);
  }
}

module.exports = SolicitudComentarioService;
