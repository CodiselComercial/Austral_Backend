# Austral Backend — Fase 4 (Clientes)

## Qué se implementó

- **clientes** — CRUD con soft delete (sin usuario vinculado)
- **cliente_asociados** — Asignación cliente ↔ asociado con soft delete
- **cuentas_bancarias_clientes** — CRUD con lógica financiera inicial
- **cliente_beneficiarios** — Asignación cliente ↔ beneficiario

## Endpoints (todos requieren ADMIN)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/clientes` | Listar (`?active=true\|false`) |
| GET | `/clientes/:id` | Detalle |
| POST | `/clientes` | Crear cliente |
| PUT | `/clientes/:id` | Actualizar datos del cliente |
| DELETE | `/clientes/:id` | Desactivar cliente |
| GET | `/cliente-asociados` | Listar (`?active`, `?cliente_id`, `?asociado_id`) |
| GET | `/cliente-asociados/:id` | Detalle (incluye nombres de cliente y asociado) |
| POST | `/cliente-asociados` | Asignar asociado a cliente |
| DELETE | `/cliente-asociados/:id` | Desactivar vínculo |
| GET | `/cuentas-bancarias-clientes` | Listar (`?active`, `?cliente_id`, `?asociado_id`) |
| GET | `/cuentas-bancarias-clientes/:id` | Detalle |
| POST | `/cuentas-bancarias-clientes` | Crear cuenta |
| PUT | `/cuentas-bancarias-clientes/:id` | Actualizar (alias, número, asociado, límite) |
| DELETE | `/cuentas-bancarias-clientes/:id` | Desactivar cuenta |
| GET | `/cliente-beneficiarios` | Listar (`?cliente_id`, `?beneficiario_id`) |
| GET | `/cliente-beneficiarios/:id` | Detalle |
| POST | `/cliente-beneficiarios` | Asignar beneficiario a cliente |
| DELETE | `/cliente-beneficiarios/:id` | Eliminar asignación |

## Lógica de negocio

### Clientes
- Datos de empresa, contacto y domicilio fiscal según `BD.TXT`.
- `comision` entre 0 y 100 (default 0).
- `pais` default **México**.
- No se desactiva un cliente con **cuentas bancarias activas**.

### Cliente ↔ Asociado
- Cliente y asociado deben estar **activos** al asignar.
- Unicidad `(cliente_id, asociado_id)`; si existía inactivo, se **reactiva**.
- Soft delete del vínculo.

### Cuentas bancarias clientes
- `saldo_disponible`, `saldo_bloqueado` y `limite_credito` inician en **0**.
- **No** se modifican saldos vía PUT (quedan para movimientos en fases posteriores).
- `numero_cuenta` único en el sistema.
- Si se indica `asociado_id`, debe existir vínculo activo en `cliente_asociados`.
- No se desactiva cuenta con saldo distinto de cero.

### Cliente ↔ Beneficiario
- Cliente y beneficiario deben estar **activos**.
- Unicidad `(cliente_id, beneficiario_id)`.
- DELETE elimina la fila (tabla sin soft delete).

## Migraciones

- `012_create_clientes.js`
- `013_create_cliente_asociados.js`
- `014_create_cuentas_bancarias_clientes.js`
- `015_create_cliente_beneficiarios.js`

## Ejemplo crear cliente

```json
POST /clientes
{
  "empresa": "Comercializadora Norte SA",
  "nombre_contacto": "María",
  "apellido_p_contacto": "García",
  "apellido_m_contacto": "Luna",
  "telefono1": "5512345678",
  "correo1": "contacto@norte.com",
  "calle": "Av. Reforma",
  "num_exterior": "100",
  "colonia": "Centro",
  "ciudad": "Monterrey",
  "estado": "Nuevo León",
  "codigo_postal": "64000",
  "rfc": "CNO850101ABC",
  "comision": 2.5
}
```

## Ejemplo flujo completo

```json
POST /cliente-asociados
{ "cliente_id": "<uuid-cliente>", "asociado_id": "<uuid-asociado>" }

POST /cuentas-bancarias-clientes
{
  "cliente_id": "<uuid-cliente>",
  "asociado_id": "<uuid-asociado>",
  "alias": "Cuenta Operativa",
  "numero_cuenta": "CLI-0001"
}

POST /cliente-beneficiarios
{ "cliente_id": "<uuid-cliente>", "beneficiario_id": "<uuid-beneficiario>" }
```

## Levantar

```bash
npm run docker:up
# o local:
npm run setup && npm run dev
```

Swagger: http://localhost:3000/api-docs

## Pendiente (fase 5+)

cuentas bancarias beneficiarios, solicitudes, pagos, gastos, movimientos, transacciones, cortes, evidencias.
