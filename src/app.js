const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const roleRoutes = require('./modules/roles/role.routes');
const empresaAustralRoutes = require('./modules/empresas-austral/empresaAustral.routes');
const empresaInternaRoutes = require('./modules/empresas-internas/empresaInterna.routes');
const cuentaEmpresaAustralRoutes = require('./modules/cuentas-empresa-austral/cuentaEmpresaAustral.routes');
const asociadoRoutes = require('./modules/asociados/asociado.routes');
const tenienteRoutes = require('./modules/tenientes/teniente.routes');
const beneficiarioRoutes = require('./modules/beneficiarios/beneficiario.routes');
const clienteRoutes = require('./modules/clientes/cliente.routes');
const clienteAsociadoRoutes = require('./modules/cliente-asociados/clienteAsociado.routes');
const cuentaBancariaClienteRoutes = require('./modules/cuentas-bancarias-clientes/cuentaBancariaCliente.routes');
const clienteBeneficiarioRoutes = require('./modules/cliente-beneficiarios/clienteBeneficiario.routes');
const solicitudRoutes = require('./modules/solicitudes/solicitud.routes');
const solicitudDetalleClienteRoutes = require('./modules/solicitud-detalle-cliente/solicitudDetalleCliente.routes');
const solicitudDepositoRoutes = require('./modules/solicitud-deposito/solicitudDeposito.routes');
const solicitudComentarioRoutes = require('./modules/solicitud-comentarios/solicitudComentario.routes');
const solicitudHistorialRoutes = require('./modules/solicitud-historial/solicitudHistorial.routes');
const solicitudComisionRoutes = require('./modules/solicitud-comisiones/solicitudComision.routes');
const beneficiarioRetornoRoutes = require('./modules/beneficiarios-retornos/beneficiarioRetorno.routes');
const pagoBeneficiarioRoutes = require('./modules/pagos-beneficiarios/pagoBeneficiario.routes');
const solicitudRetornoRoutes = require('./modules/solicitud-retorno/solicitudRetorno.routes');
const pagoTenienteRoutes = require('./modules/pagos-teniente/pagoTeniente.routes');
const pagoTenienteHistorialRoutes = require('./modules/pagos-teniente-historial/pagoTenienteHistorial.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const { setupSwagger } = require('./config/swagger');

const createApp = () => {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  setupSwagger(app);

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Austral API is running' });
  });

  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/roles', roleRoutes);
  app.use('/empresas-austral', empresaAustralRoutes);
  app.use('/empresas-internas', empresaInternaRoutes);
  app.use('/cuentas-empresa-austral', cuentaEmpresaAustralRoutes);
  app.use('/asociados', asociadoRoutes);
  app.use('/tenientes', tenienteRoutes);
  app.use('/beneficiarios', beneficiarioRoutes);
  app.use('/clientes', clienteRoutes);
  app.use('/cliente-asociados', clienteAsociadoRoutes);
  app.use('/cuentas-bancarias-clientes', cuentaBancariaClienteRoutes);
  app.use('/cliente-beneficiarios', clienteBeneficiarioRoutes);
  app.use('/solicitudes', solicitudRoutes);
  app.use('/solicitud-detalle-cliente', solicitudDetalleClienteRoutes);
  app.use('/solicitud-deposito', solicitudDepositoRoutes);
  app.use('/solicitud-comentarios', solicitudComentarioRoutes);
  app.use('/solicitud-historial', solicitudHistorialRoutes);
  app.use('/solicitud-comisiones', solicitudComisionRoutes);
  app.use('/beneficiarios-retornos', beneficiarioRetornoRoutes);
  app.use('/pagos-beneficiarios', pagoBeneficiarioRoutes);
  app.use('/solicitud-retorno', solicitudRetornoRoutes);
  app.use('/pagos-teniente', pagoTenienteRoutes);
  app.use('/pagos-teniente-historial', pagoTenienteHistorialRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Ruta no encontrada',
    });
  });

  app.use(errorHandler);

  return app;
};

module.exports = createApp;
