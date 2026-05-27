# Austral Backend — Fase 5 (Solicitudes — CORE)

## Qué se implementó

- **solicitudes** — Crear, listar, obtener por ID (sin aprobaciones ni update/delete aún)
- **solicitud_detalle_cliente** — CRUD (1 registro por solicitud)
- **solicitud_deposito** — CRUD (1 registro por solicitud)
- **solicitud_comentarios** — Crear, listar, obtener, actualizar
- **solicitud_historial** — Crear, listar, obtener (append-only, sin update/delete)
- **solicitud_comisiones** — CRUD (1 registro por solicitud)

## Endpoints (todos requieren ADMIN)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/solicitudes` | Listar (`?active`, `?cliente_id`, `?empresa_austral_id`, `?asociado_id`, `?beneficiario_id`, `?estado_id`) |
| GET | `/solicitudes/:id` | Detalle completo (incluye detalle_cliente, deposito, comisiones, comentarios, historial) |
| POST | `/solicitudes` | Crear solicitud |
| GET | `/solicitud-detalle-cliente` | Listar (`?solicitud_id`) |
| GET | `/solicitud-detalle-cliente/:id` | Detalle |
| POST | `/solicitud-detalle-cliente` | Crear detalle de cliente |
| PUT | `/solicitud-detalle-cliente/:id` | Actualizar detalle |
| GET | `/solicitud-deposito` | Listar (`?solicitud_id`) |
| GET | `/solicitud-deposito/:id` | Detalle |
| POST | `/solicitud-deposito` | Registrar depósito |
| PUT | `/solicitud-deposito/:id` | Actualizar depósito |
| GET | `/solicitud-comentarios` | Listar (`?solicitud_id`) |
| GET | `/solicitud-comentarios/:id` | Detalle |
| POST | `/solicitud-comentarios` | Crear comentario |
| PUT | `/solicitud-comentarios/:id` | Actualizar comentario (solo autor) |
| GET | `/solicitud-historial` | Listar (`?solicitud_id`) |
| GET | `/solicitud-historial/:id` | Detalle |
| POST | `/solicitud-historial` | Registrar cambio de estado manual |
| GET | `/solicitud-comisiones` | Listar (`?solicitud_id`) |
| GET | `/solicitud-comisiones/:id` | Detalle |
| POST | `/solicitud-comisiones` | Registrar comisiones |
| PUT | `/solicitud-comisiones/:id` | Actualizar comisiones |

## Lógica de negocio

### Solicitudes (cabecera)
- Al crear: `estado_id = 1` (PENDIENTE), `etapa_actual = 'registro'`, `created_by` = usuario autenticado.
- **Sin flujo de aprobaciones** en esta fase (no hay endpoints de aprobar/rechazar).
- Validación de FKs activos: cliente, empresa Austral, asociado, beneficiario.
- Si se indica `cliente_id` + `asociado_id`, debe existir vínculo activo en `cliente_asociados`.
- Si se indica `cliente_id` + `beneficiario_id`, debe existir asignación en `cliente_beneficiarios`.
- Requiere al menos un FK en el body (`cliente_id`, `empresa_austral_id`, `asociado_id` o `beneficiario_id`).
- Soft delete vía `deactivated_at` (sin endpoint DELETE en esta fase).

### Tablas 1:1 (detalle, depósito, comisiones)
- Una sola fila por `solicitud_id` (unique en BD).
- Solo se pueden crear sobre solicitudes **activas** (sin `deactivated_at`).

### Depósito
- `cuenta_empresa_austral_id` debe existir y estar activa.
- `monto_depositado` > 0, `fecha_deposito` obligatoria.

### Comentarios
- `escrito_por` se toma del usuario autenticado.
- `rol` opcional; si no se envía, se infiere del rol del usuario (default ADMIN).
- Solo el autor puede editar su comentario.

### Historial
- Registro append-only para trazabilidad.
- Valida `estado_nuevo_id` y `estado_anterior_id` contra `cat_estados`.
- Captura `ip_address` y `user_agent` del request.

### Comisiones
- Porcentajes 0–100; montos opcionales.
- Flags `pagado_asociado` / `pagado_cliente` (sin lógica de pago aún).

## Migraciones

- `016_create_solicitudes.js`
- `017_create_solicitud_detalle_cliente.js`
- `018_create_solicitud_deposito.js`
- `019_create_solicitud_comentarios.js`
- `020_create_solicitud_historial.js`
- `021_create_solicitud_comisiones.js`

## Ejemplo flujo completo

```json
POST /solicitudes
{
  "cliente_id": "<uuid-cliente>",
  "empresa_austral_id": "<uuid-empresa>",
  "asociado_id": "<uuid-asociado>",
  "beneficiario_id": "<uuid-beneficiario>"
}

POST /solicitud-detalle-cliente
{
  "solicitud_id": "<uuid-solicitud>",
  "empresa_cliente": "Comercializadora Norte SA",
  "nombre_contacto": "María",
  "apellido_p_contacto": "García",
  "telefono": "5512345678",
  "email": "contacto@norte.com"
}

POST /solicitud-deposito
{
  "solicitud_id": "<uuid-solicitud>",
  "cuenta_empresa_austral_id": "<uuid-cuenta>",
  "monto_depositado": 50000.00,
  "fecha_deposito": "2026-05-26T10:00:00.000Z",
  "referencia_deposito": "DEP-001"
}

POST /solicitud-comisiones
{
  "solicitud_id": "<uuid-solicitud>",
  "comision_asociado": 2.5,
  "comision_cliente": 1.0
}

POST /solicitud-comentarios
{
  "solicitud_id": "<uuid-solicitud>",
  "comentario": "Solicitud registrada correctamente"
}

POST /solicitud-historial
{
  "solicitud_id": "<uuid-solicitud>",
  "estado_anterior_id": null,
  "estado_nuevo_id": 1,
  "motivo": "Registro inicial"
}
```

## Levantar

```bash
npm run docker:up
# o local:
npm run setup && npm run dev
```

Swagger: http://localhost:3000/api-docs

Schemas documentados en Swagger: `Solicitud`, `SolicitudDetalle`, `CreateSolicitudRequest`, `SolicitudDetalleCliente`, `SolicitudDeposito`, `SolicitudComentario`, `SolicitudHistorial`, `SolicitudComision` y sus variantes Create/Update.

## Pendiente (fase 6+)

beneficiarios_retornos, solicitud_retorno, solicitud_cancelaciones, solicitud_gastos, aprobaciones, pagos, gastos, movimientos, transacciones, cortes, evidencias.
