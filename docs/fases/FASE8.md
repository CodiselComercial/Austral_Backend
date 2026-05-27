# Austral Backend — Fase 8 (Retornos)

## Qué se implementó

### 23 — beneficiarios_retornos

Montos y datos de pago por beneficiario en una solicitud (N registros por solicitud).

### 24 — pagos_beneficiarios

Registro de pagos ejecutados desde cuenta empresa Austral hacia beneficiarios (unique por solicitud + beneficiario).

### 25 — solicitud_retorno

Datos de devolución de la solicitud (1 registro por solicitud).

## Migraciones

- `022_create_cuentas_bancarias_beneficiarios.js` — tabla soporte FK
- `023_create_beneficiarios_retornos.js`
- `024_create_pagos_beneficiarios.js`
- `025_create_solicitud_retorno.js`

## Endpoints (requieren ADMIN)

### Beneficiarios retornos — `/beneficiarios-retornos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listar (`?solicitud_id`, `?beneficiario_id`) |
| GET | `/:id` | Detalle |
| POST | `/` | Crear retorno |
| PUT | `/:id` | Actualizar retorno |

Requiere `beneficiario_id` **o** `nombre_beneficiario`. Métodos de pago: `TRANSFERENCIA`, `SPEI`, `EFECTIVO`, `TARJETA`, `CHEQUE`.

### Pagos beneficiarios — `/pagos-beneficiarios`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listar (`?solicitud_id`, `?beneficiario_id`, `?estado_id`) |
| GET | `/:id` | Detalle |
| POST | `/` | Registrar pago (`pagado_por` = usuario autenticado) |
| PUT | `/:id` | Actualizar pago |

### Solicitud retorno — `/solicitud-retorno`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listar (`?solicitud_id`) |
| GET | `/:id` | Detalle |
| POST | `/` | Crear retorno (1 por solicitud) |
| PUT | `/:id` | Actualizar retorno |

Métodos de devolución: `TRANSFERENCIA`, `SPEI`, `EFECTIVO`, `TARJETA`, `CHEQUE`, `CLABE`.

## Reglas de negocio

- Solo sobre solicitudes **activas** (`SolicitudGuardService`).
- `beneficiarios_retornos`: valida beneficiario activo, cuenta bancaria del beneficiario (si se indica), `estado_pago_id` contra `cat_estados`.
- `pagos_beneficiarios`: valida beneficiario y cuenta empresa activos; **409** si ya existe pago para el mismo par solicitud/beneficiario.
- `solicitud_retorno`: **409** si ya existe retorno para la solicitud; valida cuenta empresa si se indica.

## GET `/solicitudes/:id`

Ahora incluye también:

- `beneficiarios_retornos[]`
- `pagos_beneficiarios[]`
- `retorno` (objeto o null)

## Ejemplo flujo

```json
POST /beneficiarios-retornos
{
  "solicitud_id": "<uuid>",
  "beneficiario_id": "<uuid>",
  "monto_beneficiario": 15000.00,
  "metodo_pago": "SPEI",
  "cuenta_bancaria_beneficiario_id": "<uuid>"
}

POST /pagos-beneficiarios
{
  "solicitud_id": "<uuid>",
  "beneficiario_id": "<uuid>",
  "cuenta_empresa_austral_id": "<uuid>",
  "monto_pagado": 15000.00
}

POST /solicitud-retorno
{
  "solicitud_id": "<uuid>",
  "metodo_devolucion": "SPEI",
  "cuenta_empresa_austral_id": "<uuid>",
  "monto_retorno": 500.00
}
```

## Pendiente (fase 9+)

Cancelaciones, gastos, movimientos, transacciones, cortes, evidencias.
