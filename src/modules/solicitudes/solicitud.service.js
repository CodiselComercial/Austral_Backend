const AppError = require('../../shared/errors/AppError');
const SolicitudRepository = require('./solicitud.repository');
const ClienteRepository = require('../clientes/cliente.repository');
const EmpresaAustralRepository = require('../empresas-austral/empresaAustral.repository');
const AsociadoRepository = require('../asociados/asociado.repository');
const BeneficiarioRepository = require('../beneficiarios/beneficiario.repository');
const ClienteAsociadoRepository = require('../cliente-asociados/clienteAsociado.repository');
const ClienteBeneficiarioRepository = require('../cliente-beneficiarios/clienteBeneficiario.repository');
const SolicitudDetalleClienteRepository = require('../solicitud-detalle-cliente/solicitudDetalleCliente.repository');
const SolicitudDepositoRepository = require('../solicitud-deposito/solicitudDeposito.repository');
const SolicitudComentarioRepository = require('../solicitud-comentarios/solicitudComentario.repository');
const SolicitudHistorialRepository = require('../solicitud-historial/solicitudHistorial.repository');
const SolicitudComisionRepository = require('../solicitud-comisiones/solicitudComision.repository');

class SolicitudService {
  constructor(
    solicitudRepository = new SolicitudRepository(),
    clienteRepository = new ClienteRepository(),
    empresaAustralRepository = new EmpresaAustralRepository(),
    asociadoRepository = new AsociadoRepository(),
    beneficiarioRepository = new BeneficiarioRepository(),
    clienteAsociadoRepository = new ClienteAsociadoRepository(),
    clienteBeneficiarioRepository = new ClienteBeneficiarioRepository(),
    solicitudDetalleClienteRepository = new SolicitudDetalleClienteRepository(),
    solicitudDepositoRepository = new SolicitudDepositoRepository(),
    solicitudComentarioRepository = new SolicitudComentarioRepository(),
    solicitudHistorialRepository = new SolicitudHistorialRepository(),
    solicitudComisionRepository = new SolicitudComisionRepository(),
  ) {
    this.solicitudRepository = solicitudRepository;
    this.clienteRepository = clienteRepository;
    this.empresaAustralRepository = empresaAustralRepository;
    this.asociadoRepository = asociadoRepository;
    this.beneficiarioRepository = beneficiarioRepository;
    this.clienteAsociadoRepository = clienteAsociadoRepository;
    this.clienteBeneficiarioRepository = clienteBeneficiarioRepository;
    this.solicitudDetalleClienteRepository = solicitudDetalleClienteRepository;
    this.solicitudDepositoRepository = solicitudDepositoRepository;
    this.solicitudComentarioRepository = solicitudComentarioRepository;
    this.solicitudHistorialRepository = solicitudHistorialRepository;
    this.solicitudComisionRepository = solicitudComisionRepository;
  }

  parseActiveFilter(active) {
    if (active === 'true') return true;
    if (active === 'false') return false;
    return null;
  }

  parseOptionalInt(value) {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  async validateClienteActivo(clienteId) {
    const cliente = await this.clienteRepository.findById(clienteId);
    if (!cliente) throw new AppError('El cliente indicado no existe', 404);
    if (!cliente.is_active) throw new AppError('El cliente indicado está inactivo', 400);
    return cliente;
  }

  async validateEmpresaAustralActiva(empresaAustralId) {
    const empresa = await this.empresaAustralRepository.findById(empresaAustralId);
    if (!empresa) throw new AppError('La empresa Austral indicada no existe', 404);
    if (!empresa.is_active) throw new AppError('La empresa Austral indicada está inactiva', 400);
    return empresa;
  }

  async validateAsociadoActivo(asociadoId) {
    const asociado = await this.asociadoRepository.findById(asociadoId);
    if (!asociado) throw new AppError('El asociado indicado no existe', 404);
    if (!asociado.is_active) throw new AppError('El asociado indicado está inactivo', 400);
    return asociado;
  }

  async validateBeneficiarioActivo(beneficiarioId) {
    const beneficiario = await this.beneficiarioRepository.findById(beneficiarioId);
    if (!beneficiario) throw new AppError('El beneficiario indicado no existe', 404);
    if (!beneficiario.is_active) throw new AppError('El beneficiario indicado está inactivo', 400);
    return beneficiario;
  }

  async validateRelaciones(payload) {
    const { cliente_id, asociado_id, beneficiario_id } = payload;

    if (cliente_id) await this.validateClienteActivo(cliente_id);
    if (payload.empresa_austral_id) {
      await this.validateEmpresaAustralActiva(payload.empresa_austral_id);
    }
    if (asociado_id) await this.validateAsociadoActivo(asociado_id);
    if (beneficiario_id) await this.validateBeneficiarioActivo(beneficiario_id);

    if (cliente_id && asociado_id) {
      const vinculo = await this.clienteAsociadoRepository.findByClienteAndAsociado(
        cliente_id,
        asociado_id,
      );
      if (!vinculo || !vinculo.is_active) {
        throw new AppError('El asociado no está vinculado activamente al cliente', 400);
      }
    }

    if (cliente_id && beneficiario_id) {
      const vinculo = await this.clienteBeneficiarioRepository.findByClienteAndBeneficiario(
        cliente_id,
        beneficiario_id,
      );
      if (!vinculo) {
        throw new AppError('El beneficiario no está asignado al cliente', 400);
      }
    }
  }

  getAll(filters = {}) {
    return this.solicitudRepository.findAll({
      activeOnly: this.parseActiveFilter(filters.active),
      clienteId: filters.cliente_id || null,
      empresaAustralId: filters.empresa_austral_id || null,
      asociadoId: filters.asociado_id || null,
      beneficiarioId: filters.beneficiario_id || null,
      estadoId: this.parseOptionalInt(filters.estado_id),
    });
  }

  async getById(id) {
    const solicitud = await this.solicitudRepository.findById(id);
    if (!solicitud) {
      throw new AppError('Solicitud no encontrada', 404);
    }

    const [detalleCliente, deposito, comisiones, comentarios, historial] = await Promise.all([
      this.solicitudDetalleClienteRepository.findBySolicitudId(id),
      this.solicitudDepositoRepository.findBySolicitudId(id),
      this.solicitudComisionRepository.findBySolicitudId(id),
      this.solicitudComentarioRepository.findAll({ solicitudId: id }),
      this.solicitudHistorialRepository.findAll({ solicitudId: id }),
    ]);

    return {
      ...solicitud,
      detalle_cliente: detalleCliente || null,
      deposito: deposito || null,
      comisiones: comisiones || null,
      comentarios,
      historial,
    };
  }

  async create(payload, createdBy) {
    await this.validateRelaciones(payload);

    const [solicitud] = await this.solicitudRepository.create({
      cliente_id: payload.cliente_id || null,
      empresa_austral_id: payload.empresa_austral_id || null,
      asociado_id: payload.asociado_id || null,
      beneficiario_id: payload.beneficiario_id || null,
      estado_id: 1,
      etapa_actual: 'registro',
      created_by: createdBy,
    });

    return this.getById(solicitud.id);
  }
}

module.exports = SolicitudService;
