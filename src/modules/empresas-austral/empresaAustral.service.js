const AppError = require('../../shared/errors/AppError');
const EmpresaAustralRepository = require('./empresaAustral.repository');
const CuentaEmpresaAustralRepository = require('../cuentas-empresa-austral/cuentaEmpresaAustral.repository');

class EmpresaAustralService {
  constructor(
    empresaAustralRepository = new EmpresaAustralRepository(),
    cuentaEmpresaAustralRepository = new CuentaEmpresaAustralRepository(),
  ) {
    this.empresaAustralRepository = empresaAustralRepository;
    this.cuentaEmpresaAustralRepository = cuentaEmpresaAustralRepository;
  }

  parseActiveFilter(active) {
    if (active === 'true') return true;
    if (active === 'false') return false;
    return null;
  }

  getAll(filters = {}) {
    return this.empresaAustralRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
    });
  }

  async getById(id) {
    const empresa = await this.empresaAustralRepository.findById(id);
    if (!empresa) {
      throw new AppError('Empresa Austral no encontrada', 404);
    }
    return empresa;
  }

  async create({ nombre }, createdBy) {
    const existing = await this.empresaAustralRepository.findByNombre(nombre);
    if (existing) {
      throw new AppError('Ya existe una empresa Austral con ese nombre', 409);
    }

    const [empresa] = await this.empresaAustralRepository.create({
      nombre,
      created_by: createdBy,
      is_active: true,
    });

    return empresa;
  }

  async update(id, { nombre }) {
    const empresa = await this.getById(id);

    if (!empresa.is_active) {
      throw new AppError('No se puede editar una empresa Austral inactiva', 400);
    }

    if (nombre !== empresa.nombre) {
      const existing = await this.empresaAustralRepository.findByNombre(nombre);
      if (existing) {
        throw new AppError('Ya existe una empresa Austral con ese nombre', 409);
      }
    }

    const [updated] = await this.empresaAustralRepository.update(id, { nombre });
    return updated;
  }

  async deactivate(id, deactivatedBy) {
    const empresa = await this.getById(id);

    if (!empresa.is_active) {
      throw new AppError('La empresa Austral ya está inactiva', 400);
    }

    const { total } = await this.cuentaEmpresaAustralRepository.countActiveByEmpresaAustralId(id);
    if (Number.parseInt(total, 10) > 0) {
      throw new AppError(
        'No se puede desactivar una empresa Austral con cuentas activas',
        400,
      );
    }

    const [deactivated] = await this.empresaAustralRepository.deactivate(id, deactivatedBy);
    return deactivated;
  }
}

module.exports = EmpresaAustralService;
