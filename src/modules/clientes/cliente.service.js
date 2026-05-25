const AppError = require('../../shared/errors/AppError');
const ClienteRepository = require('./cliente.repository');
const CuentaBancariaClienteRepository = require('../cuentas-bancarias-clientes/cuentaBancariaCliente.repository');

class ClienteService {
  constructor(
    clienteRepository = new ClienteRepository(),
    cuentaBancariaClienteRepository = new CuentaBancariaClienteRepository(),
  ) {
    this.clienteRepository = clienteRepository;
    this.cuentaBancariaClienteRepository = cuentaBancariaClienteRepository;
  }

  parseActiveFilter(active) {
    if (active === 'true') return true;
    if (active === 'false') return false;
    return null;
  }

  normalizeOptionalString(value) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    return value;
  }

  getAll(filters = {}) {
    return this.clienteRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
    });
  }

  async getById(id) {
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }
    return cliente;
  }

  async create(payload) {
    const [cliente] = await this.clienteRepository.create({
      empresa: payload.empresa,
      nombre_contacto: payload.nombre_contacto,
      apellido_p_contacto: payload.apellido_p_contacto,
      apellido_m_contacto: this.normalizeOptionalString(payload.apellido_m_contacto),
      telefono1: payload.telefono1,
      telefono2: this.normalizeOptionalString(payload.telefono2),
      correo1: payload.correo1,
      correo2: this.normalizeOptionalString(payload.correo2),
      calle: payload.calle,
      num_exterior: payload.num_exterior,
      num_interior: this.normalizeOptionalString(payload.num_interior),
      colonia: this.normalizeOptionalString(payload.colonia),
      municipio: this.normalizeOptionalString(payload.municipio),
      ciudad: payload.ciudad,
      estado: payload.estado,
      pais: payload.pais ?? 'México',
      codigo_postal: payload.codigo_postal,
      rfc: this.normalizeOptionalString(payload.rfc),
      comision: payload.comision ?? 0,
      is_active: true,
    });

    return cliente;
  }

  async update(id, payload) {
    const cliente = await this.getById(id);

    if (!cliente.is_active) {
      throw new AppError('No se puede editar un cliente inactivo', 400);
    }

    const updateData = {};
    const fields = [
      'empresa',
      'nombre_contacto',
      'apellido_p_contacto',
      'telefono1',
      'correo1',
      'calle',
      'num_exterior',
      'ciudad',
      'estado',
      'codigo_postal',
      'comision',
      'pais',
    ];
    const optionalFields = [
      'apellido_m_contacto',
      'telefono2',
      'correo2',
      'num_interior',
      'colonia',
      'municipio',
      'rfc',
    ];

    fields.forEach((field) => {
      if (payload[field] !== undefined) {
        updateData[field] = payload[field];
      }
    });

    optionalFields.forEach((field) => {
      if (payload[field] !== undefined) {
        updateData[field] = this.normalizeOptionalString(payload[field]);
      }
    });

    await this.clienteRepository.update(id, updateData);
    return this.getById(id);
  }

  async deactivate(id, deactivatedBy) {
    const cliente = await this.getById(id);

    if (!cliente.is_active) {
      throw new AppError('El cliente ya está inactivo', 400);
    }

    const { total } = await this.cuentaBancariaClienteRepository.countActiveByClienteId(id);
    if (Number.parseInt(total, 10) > 0) {
      throw new AppError('No se puede desactivar un cliente con cuentas bancarias activas', 400);
    }

    const [deactivated] = await this.clienteRepository.deactivate(id, deactivatedBy);
    return deactivated;
  }
}

module.exports = ClienteService;
