# Austral Backend — Fase 1 (resumen)

## Qué se implementó

- Arquitectura **Express + Knex + PostgreSQL** (reemplazó NestJS starter).
- **Fase 1:** users, auth, roles, sessions, cat_estados.
- **Auth:** registro, login (username o email), logout, JWT + sesiones en BD, bcrypt.
- **Middleware:** `authenticate` + `authorize(['ADMIN'])`.
- **Swagger:** http://localhost:3000/api-docs
- **Docker:** API + PostgreSQL con migraciones y seeds automáticos.

## Endpoints

| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/health` | Público |
| POST | `/auth/register` | Público |
| POST | `/auth/login` | Público |
| POST | `/auth/logout` | Autenticado |
| GET | `/users` | ADMIN |
| GET | `/roles` | ADMIN |

## Levantar con Docker

```bash
npm run docker:up
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- Admin seed: `admin` / `Admin123!`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor local (sin Docker) |
| `npm run setup` | Migraciones + seeds |
| `npm run docker:up` | Build y levantar contenedores |
| `npm run docker:down` | Detener contenedores |
| `npm run docker:reset` | Borrar volúmenes y reiniciar |

## Estructura principal

```
src/
├── config/          env, database, swagger
├── database/        migrations + seeds
├── modules/         auth, users, roles, sessions (+ carpetas futuras)
├── middlewares/
├── utils/
├── app.js
└── server.js
```

## Pendiente (fase 2+)

asociados, clientes, beneficiarios, solicitudes, pagos, gastos, cuentas, transacciones, cortes, evidencias.
