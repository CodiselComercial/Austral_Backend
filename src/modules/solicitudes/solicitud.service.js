const db = require('../../config/database');
const AppError = require('../../shared/errors/AppError');
const SolicitudGuardService = require('../../shared/solicitudGuard.service');
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
const BeneficiarioRetornoRepository = require('../beneficiarios-retornos/beneficiarioRetorno.repository');
const PagoBeneficiarioRepository = require('../pagos-beneficiarios/pagoBeneficiario.repository');
const SolicitudRetornoRepository = require('../solicitud-retorno/solicitudRetorno.repository');
const PagoTenienteRepository = require('../pagos-teniente/pagoTeniente.repository');

const ESTADO_PENDIENTE = 1;
const ESTADO_APROBADO = 2;
const ESTADO_RECHAZADO = 3;

class SolicitudService {
  constructor(
    solicitudRepository = new SolicitudRepository(),
    solicitudGuard = new SolicitudGuardService(),
    database = db,
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
    beneficiarioRetornoRepository = new BeneficiarioRetornoRepository(),
    pagoBeneficiarioRepository = new PagoBeneficiarioRepository(),
    solicitudRetornoRepository = new SolicitudRetornoRepository(),
    pagoTenienteRepository = new PagoTenienteRepository(),
  ) {
    this.solicitudRepository = solicitudRepository;
    this.solicitudGuard = solicitudGuard;
    this.db = database;
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
    this.beneficiarioRetornoRepository = beneficiarioRetornoRepository;
    this.pagoBeneficiarioRepository = pagoBeneficiarioRepository;
    this.solicitudRetornoRepository = solicitudRetornoRepository;
    this.pagoTenienteRepository = pagoTenienteRepository;
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

  normalizeOptionalString(value) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    return value;
  }

  resolveComentarioRol(user) {
    if (user.roles?.includes('ADMIN')) return 'ADMIN';
    if (user.roles?.length > 0) return user.roles[0];
    return 'ADMIN';
  }

  async processWorkflowTransition(
    solicitudId,
    { requiredEstadoId, invalidEstadoMessage, nuevoEstadoId, etapaActual, requireDeposito = false },
    payload,
    user,
    meta = {},
  ) {
    return this.db.transaction(async (trx) => {
      const solicitud = await this.solicitudGuard.assertSolicitudActiva(solicitudId, trx);

      if (solicitud.estado_id !== requiredEstadoId) {
        throw new AppError(invalidEstadoMessage, 400);
      }

      if (requireDeposito) {
        const deposito = await this.solicitudDepositoRepository.findBySolicitudId(solicitudId, trx);
        if (!deposito) {
          throw new AppError('La solicitud no tiene depósito registrado', 400);
        }
      }

      await this.solicitudRepository.updateEstado(
        solicitudId,
        {
          estado_id: nuevoEstadoId,
          etapa_actual: etapaActual,
          updated_by: user.id,
        },
        trx,
      );

      await this.solicitudHistorialRepository.create(
        {
          solicitud_id: solicitudId,
          estado_anterior_id: solicitud.estado_id,
          estado_nuevo_id: nuevoEstadoId,
          cambiado_por: user.id,
          motivo: this.normalizeOptionalString(payload.motivo),
          ip_address: meta.ip_address || null,
          user_agent: meta.user_agent || null,
        },
        trx,
      );

      const comentario = this.normalizeOptionalString(payload.comentario);
      if (comentario) {
        await this.solicitudComentarioRepository.create(
          {
            solicitud_id: solicitudId,
            escrito_por: user.id,
            rol: this.resolveComentarioRol(user),
            comentario,
          },
          trx,
        );
      }
    });
  }

  async processAgentDecision(solicitudId, nuevoEstadoId, etapaActual, payload, user, meta = {}) {
    return this.processWorkflowTransition(
      solicitudId,
      {
        requiredEstadoId: ESTADO_PENDIENTE,
        invalidEstadoMessage: 'Solo se pueden procesar solicitudes en estado pendiente',
        nuevoEstadoId,
        etapaActual,
      },
      payload,
      user,
      meta,
    );
  }

  async approveSolicitud(id, payload = {}, user, meta = {}) {
    await this.processAgentDecision(id, ESTADO_APROBADO, 'aprobado', payload, user, meta);
    return this.getById(id);
  }

  async rejectSolicitud(id, payload = {}, user, meta = {}) {
    await this.processAgentDecision(id, ESTADO_RECHAZADO, 'rechazado', payload, user, meta);
    return this.getById(id);
  }

  async verifySolicitud(id, payload = {}, user, meta = {}) {
    await this.processWorkflowTransition(
      id,
      {
        requiredEstadoId: ESTADO_APROBADO,
        invalidEstadoMessage: 'Solo se pueden verificar solicitudes aprobadas por el agente',
        nuevoEstadoId: ESTADO_APROBADO,
        etapaActual: 'verificado_banco',
        requireDeposito: true,
      },
      payload,
      user,
      meta,
    );
    return this.getById(id);
  }

  async rejectSolicitudBanco(id, payload = {}, user, meta = {}) {
    await this.processWorkflowTransition(
      id,
      {
        requiredEstadoId: ESTADO_APROBADO,
        invalidEstadoMessage: 'Solo se pueden rechazar en banco solicitudes aprobadas por el agente',
        nuevoEstadoId: ESTADO_RECHAZADO,
        etapaActual: 'rechazado_banco',
        requireDeposito: true,
      },
      payload,
      user,
      meta,
    );
    return this.getById(id);
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

    const [
      detalleCliente,
      deposito,
      comisiones,
      comentarios,
      historial,
      beneficiariosRetornos,
      pagosBeneficiarios,
      retorno,
      pagosTeniente,
    ] = await Promise.all([
      this.solicitudDetalleClienteRepository.findBySolicitudId(id),
      this.solicitudDepositoRepository.findBySolicitudId(id),
      this.solicitudComisionRepository.findBySolicitudId(id),
      this.solicitudComentarioRepository.findAll({ solicitudId: id }),
      this.solicitudHistorialRepository.findAll({ solicitudId: id }),
      this.beneficiarioRetornoRepository.findAll({ solicitudId: id }),
      this.pagoBeneficiarioRepository.findAll({ solicitudId: id }),
      this.solicitudRetornoRepository.findBySolicitudId(id),
      this.pagoTenienteRepository.findAll({ solicitudId: id }),
    ]);

    return {
      ...solicitud,
      detalle_cliente: detalleCliente || null,
      deposito: deposito || null,
      comisiones: comisiones || null,
      comentarios,
      historial,
      beneficiarios_retornos: beneficiariosRetornos,
      pagos_beneficiarios: pagosBeneficiarios,
      retorno: retorno || null,
      pagos_teniente: pagosTeniente,
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
