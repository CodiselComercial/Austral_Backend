const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const roleRoutes = require('./modules/roles/role.routes');
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
