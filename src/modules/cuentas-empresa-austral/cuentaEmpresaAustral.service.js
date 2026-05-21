const AppError = require('../../shared/errors/AppError');
const CuentaEmpresaAustralRepository = require('./cuentaEmpresaAustral.repository');
const EmpresaAustralRepository = require('../empresas-austral/empresaAustral.repository');

class CuentaEmpresaAustralService {
  constructor(
    cuentaRepository = new CuentaEmpresaAustralRepository(),
    empresaAustralRepository = new EmpresaAustralRepository(),
  ) {
    this.cuentaRepository = cuentaRepository;
    this.empresaAustralRepository = empresaAustralRepository;
  }

  parseActiveFilter(active) {
    if (active === 'true') return true;
    if (active === 'false') return false;
    return null;
  }

  normalizeTarjeta(tarjeta) {
    if (tarjeta === undefined) return undefined;
    if (tarjeta === null || tarjeta === '') return null;
    return tarjeta;
  }

  parseSaldo(value) {
    return Number.parseFloat(value || 0);
  }

  async validateEmpresaAustralActiva(empresaAustralId) {
    const empresa = await this.empresaAustralRepository.findById(empresaAustralId);
    if (!empresa) {
      throw new AppError('La empresa Austral indicada no existe', 404);
    }
    if (!empresa.is_active) {
      throw new AppError('La empresa Austral indicada está inactiva', 400);
    }
    return empresa;
  }

  async validateUniqueFields(
    { numero_clabe, clave_interbancaria, tarjeta },
    excludeId = null,
  ) {
    const existingClabe = await this.cuentaRepository.findByNumeroClabe(numero_clabe, excludeId);
    if (existingClabe) {
      throw new AppError('Ya existe una cuenta con ese número CLABE', 409);
    }

    const existingClave = await this.cuentaRepository.findByClaveInterbancaria(
      clave_interbancaria,
      excludeId,
    );
    if (existingClave) {
      throw new AppError('Ya existe una cuenta con esa clave interbancaria', 409);
    }

    const normalizedTarjeta = this.normalizeTarjeta(tarjeta);
    if (normalizedTarjeta) {
      const existingTarjeta = await this.cuentaRepository.findByTarjeta(
        normalizedTarjeta,
        excludeId,
      );
      if (existingTarjeta) {
        throw new AppError('Ya existe una cuenta con esa tarjeta', 409);
      }
    }
  }

  getAll(filters = {}) {
    return this.cuentaRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
      empresaAustralId: filters.empresa_austral_id || null,
    });
  }

  async getById(id) {
    const cuenta = await this.cuentaRepository.findById(id);
    if (!cuenta) {
      throw new AppError('Cuenta de empresa Austral no encontrada', 404);
    }
    return cuenta;
  }

  async create(payload, createdBy) {
    const {
      nombre_cuenta,
      empresa_austral_id,
      banco,
      numero_clabe,
      clave_interbancaria,
      tarjeta,
      saldo_inicial = 0,
    } = payload;

    await this.validateEmpresaAustralActiva(empresa_austral_id);
    await this.validateUniqueFields({ numero_clabe, clave_interbancaria, tarjeta });

    const saldo = saldo_inicial;
    const normalizedTarjeta = this.normalizeTarjeta(tarjeta);

    const [cuenta] = await this.cuentaRepository.create({
      nombre_cuenta,
      empresa_austral_id,
      banco,
      numero_clabe,
      clave_interbancaria,
      tarjeta: normalizedTarjeta,
      saldo_actual: saldo,
      saldo_disponible: saldo,
      created_by: createdBy,
      is_active: true,
    });

    return this.getById(cuenta.id);
  }

  async update(id, payload) {
    const cuenta = await this.getById(id);

    if (!cuenta.is_active) {
      throw new AppError('No se puede editar una cuenta inactiva', 400);
    }

    const updateData = {};

    if (payload.nombre_cuenta !== undefined) {
      updateData.nombre_cuenta = payload.nombre_cuenta;
    }
    if (payload.banco !== undefined) {
      updateData.banco = payload.banco;
    }
    if (payload.numero_clabe !== undefined) {
      updateData.numero_clabe = payload.numero_clabe;
    }
    if (payload.clave_interbancaria !== undefined) {
      updateData.clave_interbancaria = payload.clave_interbancaria;
    }
    if (payload.tarjeta !== undefined) {
      updateData.tarjeta = this.normalizeTarjeta(payload.tarjeta);
    }

    await this.validateUniqueFields(
      {
        numero_clabe: updateData.numero_clabe ?? cuenta.numero_clabe,
        clave_interbancaria: updateData.clave_interbancaria ?? cuenta.clave_interbancaria,
        tarjeta: updateData.tarjeta !== undefined ? updateData.tarjeta : cuenta.tarjeta,
      },
      id,
    );

    await this.cuentaRepository.update(id, updateData);
    return this.getById(id);
  }

  async deactivate(id, deactivatedBy) {
    const cuenta = await this.getById(id);

    if (!cuenta.is_active) {
      throw new AppError('La cuenta ya está inactiva', 400);
    }

    const saldoActual = this.parseSaldo(cuenta.saldo_actual);
    const saldoDisponible = this.parseSaldo(cuenta.saldo_disponible);

    if (saldoActual !== 0 || saldoDisponible !== 0) {
      throw new AppError(
        'No se puede desactivar una cuenta con saldo distinto de cero',
        400,
      );
    }

    await this.cuentaRepository.deactivate(id, deactivatedBy);
    return this.getById(id);
  }
}

module.exports = CuentaEmpresaAustralService;
