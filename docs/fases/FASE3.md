# Austral Backend — Fase 3 (Personas del sistema)

## Qué se implementó

- **asociados** — CRUD con usuario vinculado (rol `ASOCIADO`)
- **tenientes** — CRUD con usuario vinculado (rol `TENIENTE`)
- **beneficiarios** — CRUD con usuario vinculado (rol `BENEFICIARIO`)

## Endpoints (todos requieren ADMIN)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/asociados` | Listar (`?active=true\|false`) |
| GET | `/asociados/:id` | Detalle (incluye `username`, `user_email`) |
| POST | `/asociados` | Crear asociado + usuario |
| PUT | `/asociados/:id` | Actualizar datos del asociado |
| DELETE | `/asociados/:id` | Desactivar asociado y usuario |
| GET | `/tenientes` | Listar (`?active=true\|false`) |
| GET | `/tenientes/:id` | Detalle |
| POST | `/tenientes` | Crear teniente + usuario |
| PUT | `/tenientes/:id` | Actualizar |
| DELETE | `/tenientes/:id` | Desactivar teniente y usuario |
| GET | `/beneficiarios` | Listar (`?active=true\|false`) |
| GET | `/beneficiarios/:id` | Detalle |
| POST | `/beneficiarios` | Crear beneficiario + usuario |
| PUT | `/beneficiarios/:id` | Actualizar |
| DELETE | `/beneficiarios/:id` | Desactivar beneficiario y usuario |

## Lógica de personas

- Al **crear**, se registra un `user` (username, email, password) y se asigna el rol correspondiente en la misma transacción.
- Cada persona tiene `user_id` único (1:1 con `users`).
- Al **desactivar**, se inactiva la persona y su usuario vinculado.
- **Asociados:** unicidad de `celular` y `correo`; `comision` entre 0 y 100.
- **Tenientes:** guarda `created_by` (admin que lo registró).

## Migraciones y seeds

- `009_create_asociados.js`
- `010_create_tenientes.js`
- `011_create_beneficiarios.js`
- `004_roles_personas.js` — roles ASOCIADO, TENIENTE, BENEFICIARIO

## Ejemplo crear asociado

```json
POST /asociados
{
  "nombre": "Juan",
  "apellido_p": "Pérez",
  "apellido_m": "López",
  "celular": "5512345678",
  "correo": "juan.perez@mail.com",
  "comision": 5.5,
  "username": "jperez",
  "email": "jperez@austral.com",
  "password": "MiPassword1!"
}
```

## Levantar

```bash
npm run docker:up
# o local:
npm run setup && npm run dev
```

Swagger: http://localhost:3000/api-docs

## Pendiente (fase 4+)

clientes, cuentas bancarias clientes/beneficiarios, solicitudes, pagos, gastos, movimientos, transacciones, cortes, evidencias.
