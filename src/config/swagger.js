const swaggerUi = require('swagger-ui-express');

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Austral API',
    version: '1.0.0',
    description:
      'Documentación de la API del backend Austral. Usa **Authorize** con el token JWT (Bearer) para probar endpoints protegidos.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local' },
    { url: 'http://localhost:3000', description: 'Docker' },
  ],
  tags: [
    { name: 'Health', description: 'Estado del servicio' },
    { name: 'Auth', description: 'Registro, login y logout' },
    { name: 'Users', description: 'Gestión de usuarios' },
    { name: 'Roles', description: 'Catálogo de roles' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtenido en POST /auth/login o POST /auth/register',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Credenciales inválidas' },
          details: { type: 'array', items: { type: 'string' }, nullable: true },
        },
      },
      UserPublic: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          username: { type: 'string', example: 'admin' },
          email: { type: 'string', format: 'email', example: 'admin@austral.com' },
          is_active: { type: 'boolean', example: true },
          roles: { type: 'array', items: { type: 'string' }, example: ['ADMIN'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Role: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'ADMIN' },
          description: { type: 'string', example: 'Administrador del sistema' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 3, example: 'maria' },
          email: { type: 'string', format: 'email', example: 'maria@austral.com' },
          password: { type: 'string', minLength: 8, example: 'MiPassword1!' },
        },
      },
      LoginWithUsername: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'admin' },
          password: { type: 'string', example: 'Admin123!' },
        },
      },
      LoginWithEmail: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@austral.com' },
          password: { type: 'string', example: 'Admin123!' },
        },
      },
      AuthData: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/UserPublic' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          expires_at: { type: 'string', format: 'date-time' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object', nullable: true },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'API en línea',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Austral API is running' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        description: 'Crea un usuario con rol USER y devuelve JWT + sesión.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario registrado',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/AuthData' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { description: 'Validación fallida', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Email o username duplicado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        description: 'Envía **username** o **email** (uno solo) junto con password.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/LoginWithUsername' },
                  { $ref: '#/components/schemas/LoginWithEmail' },
                ],
              },
              examples: {
                conUsername: {
                  summary: 'Login con username',
                  value: { username: 'admin', password: 'Admin123!' },
                },
                conEmail: {
                  summary: 'Login con email',
                  value: { email: 'admin@austral.com', password: 'Admin123!' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login exitoso',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/AuthData' },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Usuario inactivo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Cerrar sesión',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Sesión cerrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Listar usuarios',
        description: 'Requiere rol **ADMIN**.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de usuarios',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/UserPublic' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Sin permisos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/roles': {
      get: {
        tags: ['Roles'],
        summary: 'Listar roles',
        description: 'Requiere rol **ADMIN**.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de roles',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Role' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Sin permisos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Austral API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }));

  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
  });
};

module.exports = { setupSwagger, swaggerSpec };
