const AppError = require('./errors/AppError');
const SolicitudRepository = require('../modules/solicitudes/solicitud.repository');

class SolicitudGuardService {
  constructor(solicitudRepository = new SolicitudRepository()) {
    this.solicitudRepository = solicitudRepository;
  }

  async assertSolicitudActiva(solicitudId, trx = null) {
    const solicitud = await this.solicitudRepository.findById(solicitudId, trx);
    if (!solicitud) {
      throw new AppError('Solicitud no encontrada', 404);
    }
    if (solicitud.deactivated_at) {
      throw new AppError('La solicitud está desactivada', 400);
    }
    return solicitud;
  }
}

module.exports = SolicitudGuardService;
