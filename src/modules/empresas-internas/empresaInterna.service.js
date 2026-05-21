const AppError = require('../../shared/errors/AppError');
const EmpresaInternaRepository = require('./empresaInterna.repository');

class EmpresaInternaService {
  constructor(empresaInternaRepository = new EmpresaInternaRepository()) {
    this.empresaInternaRepository = empresaInternaRepository;
  }

  parseActiveFilter(active) {
    if (active === 'true') return true;
    if (active === 'false') return false;
    return null;
  }

  getAll(filters = {}) {
    return this.empresaInternaRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
    });
  }

  async getById(id) {
    const empresa = await this.empresaInternaRepository.findById(id);
    if (!empresa) {
      throw new AppError('Empresa interna no encontrada', 404);
    }
    return empresa;
  }

  async create({ nombre }, createdBy) {
    const existing = await this.empresaInternaRepository.findByNombre(nombre);
    if (existing) {
      throw new AppError('Ya existe una empresa interna con ese nombre', 409);
    }

    const [empresa] = await this.empresaInternaRepository.create({
      nombre,
      created_by: createdBy,
      is_active: true,
    });

    return empresa;
  }

  async update(id, { nombre }) {
    const empresa = await this.getById(id);

    if (!empresa.is_active) {
      throw new AppError('No se puede editar una empresa interna inactiva', 400);
    }

    if (nombre !== empresa.nombre) {
      const existing = await this.empresaInternaRepository.findByNombre(nombre);
      if (existing) {
        throw new AppError('Ya existe una empresa interna con ese nombre', 409);
      }
    }

    const [updated] = await this.empresaInternaRepository.update(id, { nombre });
    return updated;
  }

  async deactivate(id, deactivatedBy) {
    const empresa = await this.getById(id);

    if (!empresa.is_active) {
      throw new AppError('La empresa interna ya está inactiva', 400);
    }

    const [deactivated] = await this.empresaInternaRepository.deactivate(id, deactivatedBy);
    return deactivated;
  }
}

module.exports = EmpresaInternaService;
