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
