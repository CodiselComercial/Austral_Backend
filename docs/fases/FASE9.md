# Austral Backend — Fase 9 (Teniente)

## Qué se implementó

### 26 — pagos_teniente

Entrega física de efectivo por teniente, vinculada a un `pagos_beneficiarios` existente.

Incluye:

- **Código de verificación** de 6 dígitos (generado al crear, solo visible en la respuesta de creación)
- **Validación de código** con límite de intentos (`max_intentos`, default 3) y bloqueo temporal (30 min)
- **Geolocalización** obligatoria al registrar la entrega (`latitud`, `longitud`)
- Datos del receptor (tipo, nombre, identificación, firma, foto comprobante)

### 27 — pagos_teniente_historial

Auditoría de eventos: creación, validaciones de código, entregas, actualizaciones y desactivaciones.

## Migraciones

- `026_create_pagos_teniente.js`
- `027_create_pagos_teniente_historial.js`

## Endpoints

Roles: **ADMIN** y **TENIENTE** (salvo donde se indica).

### Pagos teniente — `/pagos-teniente`

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/` | ADMIN, TENIENTE | Listar (`?solicitud_id`, `?beneficiario_id`, `?estado_id`, `?entregado_por`, `?active`) |
| GET | `/:id` | ADMIN, TENIENTE | Detalle |
| POST | `/` | ADMIN | Crear pago teniente (genera código) |
| PUT | `/:id` | ADMIN, TENIENTE | Actualizar datos |
| POST | `/:id/validar-codigo` | ADMIN, TENIENTE | Validar código de verificación |
| POST | `/:id/entregar` | ADMIN, TENIENTE | Registrar entrega con geolocalización |
| DELETE | `/:id` | ADMIN | Desactivar (soft delete) |

**TENIENTE** solo ve y opera pagos donde `entregado_por` = su `user_id`.

### Pagos teniente historial — `/pagos-teniente-historial`

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/` | ADMIN, TENIENTE | Listar (`?pago_teniente_id`, `?evento`) |
| GET | `/:id` | ADMIN, TENIENTE | Detalle |
| POST | `/` | ADMIN | Crear registro manual |

El historial se genera automáticamente al crear, validar código, entregar, actualizar o desactivar un pago teniente.

## Reglas de negocio

- Solo sobre solicitudes **activas** (`SolicitudGuardService`).
- **409** si ya existe pago teniente para el mismo `pago_beneficiario_id` (unique).
- El `beneficiario_id` debe coincidir con el del pago a beneficiario.
- `entregado_por` debe ser el `user_id` de un teniente activo.
- Código incorrecto: incrementa `intentos_fallidos`; al alcanzar `max_intentos` bloquea 30 minutos (**429**).
- **Entrega**: requiere `latitud` y `longitud`; cambia estado a **PAGADO** (id 4).
- Si no hubo validación exitosa en los últimos 30 min, la entrega debe incluir `codigo` o validar antes con `/validar-codigo`.
- El código de verificación **no** se expone en GET (solo al crear).

## Eventos de historial

`CREACION`, `VALIDACION_CODIGO`, `ENTREGA`, `ACTUALIZACION`, `DESACTIVACION`, `CAMBIO_ESTADO`

## GET `/solicitudes/:id`

Ahora incluye también:

- `pagos_teniente[]`

## Ejemplo flujo

```json
POST /pagos-teniente
{
  "pago_beneficiario_id": "<uuid>",
  "beneficiario_id": "<uuid>",
  "entregado_por": "<user_id del teniente>"
}
```

Respuesta incluye `codigo_verificacion` (comunicar al beneficiario).

```json
POST /pagos-teniente/{id}/validar-codigo
{
  "codigo": "482913"
}
```

```json
POST /pagos-teniente/{id}/entregar
{
  "receptor_tipo": "beneficiario",
  "receptor_nombre": "Juan Pérez",
  "identificacion_receptor": "INE123456",
  "receptor_firma_url": "https://...",
  "foto_comprobante_url": "https://...",
  "latitud": 19.432608,
  "longitud": -99.133209,
  "observaciones": "Entrega en domicilio"
}
```

## Pendiente (fase 10+)

Cancelaciones, gastos, movimientos, transacciones, cortes, evidencias.
