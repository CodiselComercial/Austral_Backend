const createApp = require('./app');
const env = require('./config/env');
const db = require('./config/database');

const startServer = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('Conexión a base de datos establecida');

    const app = createApp();

    app.listen(env.port, () => {
      console.log(`Servidor corriendo en http://localhost:${env.port}`);
      console.log(`Swagger UI: http://localhost:${env.port}/api-docs`);
      console.log(`OpenAPI JSON: http://localhost:${env.port}/api-docs.json`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
