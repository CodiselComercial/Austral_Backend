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
    { url: 'http://localhost:3000', description: 'Local (npm run dev)' },
    { url: 'http://localhost:3001', description: 'Docker (npm run docker:up)' },
  ],
  tags: [
    { name: 'Health', description: 'Estado del servicio' },
    { name: 'Auth', description: 'Registro, login y logout' },
    { name: 'Users', description: 'Gestión de usuarios' },
    { name: 'Roles', description: 'Catálogo de roles' },
    { name: 'Empresas Austral', description: 'Catálogo de empresas Austral' },
    { name: 'Empresas Internas', description: 'Catálogo de empresas internas' },
    { name: 'Cuentas Empresa Austral', description: 'Cuentas bancarias por empresa Austral' },
    { name: 'Asociados', description: 'Asociados comerciales del sistema' },
    { name: 'Tenientes', description: 'Tenientes operativos' },
    { name: 'Beneficiarios', description: 'Beneficiarios de pagos y retornos' },
    { name: 'Clientes', description: 'Clientes del sistema' },
    { name: 'Cliente Asociados', description: 'Vínculo cliente ↔ asociado' },
    { name: 'Cuentas Bancarias Clientes', description: 'Cuentas bancarias por cliente' },
    { name: 'Cliente Beneficiarios', description: 'Vínculo cliente ↔ beneficiario' },
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
      EmpresaAustral: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombre: { type: 'string', example: 'Austral Operaciones' },
          created_by: { type: 'string', format: 'uuid' },
          is_active: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          deactivated_at: { type: 'string', format: 'date-time', nullable: true },
          deactivated_by: { type: 'string', format: 'uuid', nullable: true },
        },
      },
      EmpresaInterna: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombre: { type: 'string', example: 'División Norte' },
          created_by: { type: 'string', format: 'uuid' },
          is_active: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          deactivated_at: { type: 'string', format: 'date-time', nullable: true },
          deactivated_by: { type: 'string', format: 'uuid', nullable: true },
        },
      },
      CuentaEmpresaAustral: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombre_cuenta: { type: 'string', example: 'Santander Operativa' },
          empresa_austral_id: { type: 'string', format: 'uuid' },
          empresa_austral_nombre: { type: 'string', example: 'Austral Operaciones', nullable: true },
          banco: { type: 'string', example: 'Santander' },
          numero_clabe: { type: 'string', example: '014180655555555555' },
          clave_interbancaria: { type: 'string', example: '014180655555555555' },
          tarjeta: { type: 'string', example: '4111111111111111', nullable: true },
          saldo_actual: { type: 'string', example: '0.00' },
          saldo_disponible: { type: 'string', example: '0.00' },
          created_by: { type: 'string', format: 'uuid' },
          is_active: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          deactivated_at: { type: 'string', format: 'date-time', nullable: true },
          deactivated_by: { type: 'string', format: 'uuid', nullable: true },
        },
      },
      CreateEmpresaAustralRequest: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', maxLength: 150, example: 'Austral Operaciones' },
        },
      },
      CreateEmpresaInternaRequest: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', maxLength: 150, example: 'División Norte' },
        },
      },
      CreateCuentaEmpresaAustralRequest: {
        type: 'object',
        required: ['nombre_cuenta', 'empresa_austral_id', 'banco', 'numero_clabe', 'clave_interbancaria'],
        properties: {
          nombre_cuenta: { type: 'string', maxLength: 150, example: 'Santander Operativa' },
          empresa_austral_id: { type: 'string', format: 'uuid' },
          banco: { type: 'string', maxLength: 100, example: 'Santander' },
          numero_clabe: { type: 'string', maxLength: 50, example: '014180655555555555' },
          clave_interbancaria: { type: 'string', maxLength: 50, example: '014180655555555555' },
          tarjeta: { type: 'string', maxLength: 50, nullable: true },
          saldo_inicial: { type: 'number', format: 'float', minimum: 0, example: 0 },
        },
      },
      UpdateCuentaEmpresaAustralRequest: {
        type: 'object',
        properties: {
          nombre_cuenta: { type: 'string', maxLength: 150 },
          banco: { type: 'string', maxLength: 100 },
          numero_clabe: { type: 'string', maxLength: 50 },
          clave_interbancaria: { type: 'string', maxLength: 50 },
          tarjeta: { type: 'string', maxLength: 50, nullable: true },
        },
      },
      PersonaUserCredentials: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 3, example: 'jperez' },
          email: { type: 'string', format: 'email', example: 'jperez@austral.com' },
          password: { type: 'string', minLength: 8, example: 'MiPassword1!' },
        },
      },
      Asociado: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombre: { type: 'string' },
          apellido_p: { type: 'string' },
          apellido_m: { type: 'string', nullable: true },
          celular: { type: 'string' },
          correo: { type: 'string', format: 'email' },
          comision: { type: 'string', example: '5.00' },
          user_id: { type: 'string', format: 'uuid' },
          username: { type: 'string' },
          user_email: { type: 'string', format: 'email' },
          is_active: { type: 'boolean' },
        },
      },
      CreateAsociadoRequest: {
        allOf: [
          { $ref: '#/components/schemas/PersonaUserCredentials' },
          {
            type: 'object',
            required: ['nombre', 'apellido_p', 'celular', 'correo', 'comision'],
            properties: {
              nombre: { type: 'string', maxLength: 150 },
              apellido_p: { type: 'string', maxLength: 150 },
              apellido_m: { type: 'string', maxLength: 150, nullable: true },
              celular: { type: 'string', maxLength: 20 },
              correo: { type: 'string', format: 'email', maxLength: 150 },
              comision: { type: 'number', minimum: 0, maximum: 100, example: 5 },
            },
          },
        ],
      },
      Teniente: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombre: { type: 'string' },
          telefono: { type: 'string' },
          user_id: { type: 'string', format: 'uuid' },
          username: { type: 'string' },
          user_email: { type: 'string', format: 'email' },
          created_by: { type: 'string', format: 'uuid', nullable: true },
          is_active: { type: 'boolean' },
        },
      },
      CreateTenienteRequest: {
        allOf: [
          { $ref: '#/components/schemas/PersonaUserCredentials' },
          {
            type: 'object',
            required: ['nombre', 'telefono'],
            properties: {
              nombre: { type: 'string', maxLength: 150 },
              telefono: { type: 'string', maxLength: 20 },
            },
          },
        ],
      },
      Beneficiario: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombre: { type: 'string' },
          apellido_p: { type: 'string' },
          apellido_m: { type: 'string', nullable: true },
          user_id: { type: 'string', format: 'uuid' },
          username: { type: 'string' },
          user_email: { type: 'string', format: 'email' },
          is_active: { type: 'boolean' },
        },
      },
      CreateBeneficiarioRequest: {
        allOf: [
          { $ref: '#/components/schemas/PersonaUserCredentials' },
          {
            type: 'object',
            required: ['nombre', 'apellido_p'],
            properties: {
              nombre: { type: 'string', maxLength: 150 },
              apellido_p: { type: 'string', maxLength: 150 },
              apellido_m: { type: 'string', maxLength: 150, nullable: true },
            },
          },
        ],
      },
      Cliente: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          empresa: { type: 'string', example: 'Comercializadora Norte SA' },
          nombre_contacto: { type: 'string' },
          apellido_p_contacto: { type: 'string' },
          apellido_m_contacto: { type: 'string', nullable: true },
          telefono1: { type: 'string' },
          correo1: { type: 'string', format: 'email' },
          ciudad: { type: 'string' },
          estado: { type: 'string' },
          comision: { type: 'string', example: '0.00' },
          is_active: { type: 'boolean' },
        },
      },
      CreateClienteRequest: {
        type: 'object',
        required: [
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
        ],
        properties: {
          empresa: { type: 'string', maxLength: 150 },
          nombre_contacto: { type: 'string', maxLength: 150 },
          apellido_p_contacto: { type: 'string', maxLength: 150 },
          apellido_m_contacto: { type: 'string', maxLength: 150, nullable: true },
          telefono1: { type: 'string', maxLength: 20 },
          telefono2: { type: 'string', maxLength: 20, nullable: true },
          correo1: { type: 'string', format: 'email', maxLength: 150 },
          correo2: { type: 'string', format: 'email', maxLength: 150, nullable: true },
          calle: { type: 'string', maxLength: 150 },
          num_exterior: { type: 'string', maxLength: 20 },
          num_interior: { type: 'string', maxLength: 20, nullable: true },
          colonia: { type: 'string', maxLength: 150, nullable: true },
          municipio: { type: 'string', maxLength: 150, nullable: true },
          ciudad: { type: 'string', maxLength: 150 },
          estado: { type: 'string', maxLength: 150 },
          pais: { type: 'string', maxLength: 100, example: 'México' },
          codigo_postal: { type: 'string', maxLength: 10 },
          rfc: { type: 'string', maxLength: 13, nullable: true },
          comision: { type: 'number', minimum: 0, maximum: 100, example: 0 },
        },
      },
      CreateClienteAsociadoRequest: {
        type: 'object',
        required: ['cliente_id', 'asociado_id'],
        properties: {
          cliente_id: { type: 'string', format: 'uuid' },
          asociado_id: { type: 'string', format: 'uuid' },
        },
      },
      CreateCuentaBancariaClienteRequest: {
        type: 'object',
        required: ['cliente_id', 'numero_cuenta'],
        properties: {
          cliente_id: { type: 'string', format: 'uuid' },
          asociado_id: { type: 'string', format: 'uuid', nullable: true },
          alias: { type: 'string', maxLength: 100, example: 'Cuenta Principal' },
          numero_cuenta: { type: 'string', maxLength: 50 },
          limite_credito: { type: 'number', minimum: 0, example: 0 },
        },
      },
      CreateClienteBeneficiarioRequest: {
        type: 'object',
        required: ['cliente_id', 'beneficiario_id'],
        properties: {
          cliente_id: { type: 'string', format: 'uuid' },
          beneficiario_id: { type: 'string', format: 'uuid' },
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
    '/empresas-austral': {
      get: {
        tags: ['Empresas Austral'],
        summary: 'Listar empresas Austral',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'active', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Empresas Austral'],
        summary: 'Crear empresa Austral',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateEmpresaAustralRequest' } },
          },
        },
        responses: { 201: { description: 'Creada' } },
      },
    },
    '/empresas-austral/{id}': {
      get: {
        tags: ['Empresas Austral'],
        summary: 'Obtener por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'OK' }, 404: { description: 'No encontrada' } },
      },
      put: {
        tags: ['Empresas Austral'],
        summary: 'Actualizar',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateEmpresaAustralRequest' } },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        tags: ['Empresas Austral'],
        summary: 'Desactivar',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'OK' }, 400: { description: 'Tiene cuentas activas' } },
      },
    },
    '/empresas-internas': {
      get: {
        tags: ['Empresas Internas'],
        summary: 'Listar empresas internas',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'active', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Empresas Internas'],
        summary: 'Crear empresa interna',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateEmpresaInternaRequest' } },
          },
        },
        responses: { 201: { description: 'Creada' } },
      },
    },
    '/empresas-internas/{id}': {
      get: {
        tags: ['Empresas Internas'],
        summary: 'Obtener por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'OK' } },
      },
      put: {
        tags: ['Empresas Internas'],
        summary: 'Actualizar',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateEmpresaInternaRequest' } },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        tags: ['Empresas Internas'],
        summary: 'Desactivar',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/cuentas-empresa-austral': {
      get: {
        tags: ['Cuentas Empresa Austral'],
        summary: 'Listar cuentas',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'active', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
          { name: 'empresa_austral_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Cuentas Empresa Austral'],
        summary: 'Crear cuenta',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateCuentaEmpresaAustralRequest' } },
          },
        },
        responses: { 201: { description: 'Creada' } },
      },
    },
    '/cuentas-empresa-austral/{id}': {
      get: {
        tags: ['Cuentas Empresa Austral'],
        summary: 'Obtener por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'OK' } },
      },
      put: {
        tags: ['Cuentas Empresa Austral'],
        summary: 'Actualizar (sin modificar saldos)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateCuentaEmpresaAustralRequest' } },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        tags: ['Cuentas Empresa Austral'],
        summary: 'Desactivar (solo saldo 0)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'OK' }, 400: { description: 'Saldo distinto de cero' } },
      },
    },
    '/asociados': {
      get: {
        tags: ['Asociados'],
        summary: 'Listar asociados',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'active', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Asociados'],
        summary: 'Crear asociado (crea usuario + rol ASOCIADO)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAsociadoRequest' } } },
        },
        responses: { 201: { description: 'Creado' } },
      },
    },
    '/asociados/{id}': {
      get: { tags: ['Asociados'], summary: 'Obtener por ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Asociados'], summary: 'Actualizar', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      delete: { tags: ['Asociados'], summary: 'Desactivar asociado y usuario', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
    },
    '/tenientes': {
      get: {
        tags: ['Tenientes'],
        summary: 'Listar tenientes',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'active', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Tenientes'],
        summary: 'Crear teniente (crea usuario + rol TENIENTE)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTenienteRequest' } } },
        },
        responses: { 201: { description: 'Creado' } },
      },
    },
    '/tenientes/{id}': {
      get: { tags: ['Tenientes'], summary: 'Obtener por ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Tenientes'], summary: 'Actualizar', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      delete: { tags: ['Tenientes'], summary: 'Desactivar teniente y usuario', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
    },
    '/beneficiarios': {
      get: {
        tags: ['Beneficiarios'],
        summary: 'Listar beneficiarios',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'active', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Beneficiarios'],
        summary: 'Crear beneficiario (crea usuario + rol BENEFICIARIO)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateBeneficiarioRequest' } } },
        },
        responses: { 201: { description: 'Creado' } },
      },
    },
    '/beneficiarios/{id}': {
      get: { tags: ['Beneficiarios'], summary: 'Obtener por ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Beneficiarios'], summary: 'Actualizar', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      delete: { tags: ['Beneficiarios'], summary: 'Desactivar beneficiario y usuario', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
    },
    '/clientes': {
      get: {
        tags: ['Clientes'],
        summary: 'Listar clientes',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'active', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } }],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Crear cliente',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClienteRequest' } } },
        },
        responses: { 201: { description: 'Creado' } },
      },
    },
    '/clientes/{id}': {
      get: { tags: ['Clientes'], summary: 'Obtener por ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Clientes'], summary: 'Actualizar', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      delete: { tags: ['Clientes'], summary: 'Desactivar (sin cuentas activas)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' }, 400: { description: 'Tiene cuentas activas' } } },
    },
    '/cliente-asociados': {
      get: {
        tags: ['Cliente Asociados'],
        summary: 'Listar vínculos cliente-asociado',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'active', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
          { name: 'cliente_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'asociado_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Cliente Asociados'],
        summary: 'Asignar asociado a cliente',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClienteAsociadoRequest' } } },
        },
        responses: { 201: { description: 'Asignado' } },
      },
    },
    '/cliente-asociados/{id}': {
      get: { tags: ['Cliente Asociados'], summary: 'Obtener por ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      delete: { tags: ['Cliente Asociados'], summary: 'Desactivar vínculo', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
    },
    '/cuentas-bancarias-clientes': {
      get: {
        tags: ['Cuentas Bancarias Clientes'],
        summary: 'Listar cuentas de clientes',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'active', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
          { name: 'cliente_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'asociado_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Cuentas Bancarias Clientes'],
        summary: 'Crear cuenta bancaria de cliente',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCuentaBancariaClienteRequest' } } },
        },
        responses: { 201: { description: 'Creada' } },
      },
    },
    '/cuentas-bancarias-clientes/{id}': {
      get: { tags: ['Cuentas Bancarias Clientes'], summary: 'Obtener por ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      put: { tags: ['Cuentas Bancarias Clientes'], summary: 'Actualizar (sin modificar saldos)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' } } },
      delete: { tags: ['Cuentas Bancarias Clientes'], summary: 'Desactivar (solo saldo 0)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'OK' }, 400: { description: 'Saldo distinto de cero' } } },
    },
    '/cliente-beneficiarios': {
      get: {
        tags: ['Cliente Beneficiarios'],
        summary: 'Listar asignaciones cliente-beneficiario',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'cliente_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'beneficiario_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Cliente Beneficiarios'],
        summary: 'Asignar beneficiario a cliente',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClienteBeneficiarioRequest' } } },
        },
        responses: { 201: { description: 'Asignado' } },
      },
    },
    '/cliente-beneficiarios/{id}': {
      get: { tags: ['Cliente Beneficiarios'], summary: 'Obtener por ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      delete: { tags: ['Cliente Beneficiarios'], summary: 'Eliminar asignación', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
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
