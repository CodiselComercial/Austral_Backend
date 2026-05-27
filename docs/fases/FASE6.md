# Austral Backend — Fase 6 (Workflow)

## Qué se implementó

### 21 — Aprobación agente

Servicio `SolicitudService` con métodos transaccionales:

- `approveSolicitud(id, payload, user, meta)`
- `rejectSolicitud(id, payload, user, meta)`

Cada operación ejecuta **en una sola transacción SQL**:

1. Valida solicitud activa y en estado **PENDIENTE** (`estado_id = 1`)
2. Actualiza `solicitudes.estado_id`, `etapa_actual` y `updated_by`
3. Inserta registro en `solicitud_historial` (con `motivo`, `ip_address`, `user_agent`)
4. Inserta comentario en `solicitud_comentarios` **solo si** se envía `comentario`

| Acción | `estado_id` | `etapa_actual` |
|--------|-------------|----------------|
| Aprobar | 2 (APROBADO) | `aprobado` |
| Rechazar | 3 (RECHAZADO) | `rechazado` |

## Endpoints (requieren ADMIN)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/solicitudes/:id/aprobar` | Aprobar solicitud pendiente |
| POST | `/solicitudes/:id/rechazar` | Rechazar solicitud pendiente |

### Body opcional

```json
{
  "motivo": "Documentación completa",
  "comentario": "Aprobada por el agente"
}
```

- `motivo` → `solicitud_historial.motivo`
- `comentario` → nueva fila en `solicitud_comentarios`

## Ejemplo

```json
POST /solicitudes/<uuid>/aprobar
{
  "motivo": "Depósito verificado",
  "comentario": "OK para continuar flujo"
}
```

Respuesta: solicitud completa (`getById`) con historial y comentarios actualizados.

## Archivos tocados

- `src/modules/solicitudes/solicitud.service.js` — lógica transaccional
- `src/modules/solicitudes/solicitud.repository.js` — `updateEstado()`
- `src/modules/solicitudes/solicitud.controller.js`
- `src/modules/solicitudes/solicitud.routes.js`
- `src/modules/solicitudes/solicitud.validation.js`
- `src/config/swagger.js`

## Pendiente (fase 6+)

Otros pasos del workflow: cancelaciones, retornos, pagos, gastos, movimientos, transacciones, cortes, evidencias.
