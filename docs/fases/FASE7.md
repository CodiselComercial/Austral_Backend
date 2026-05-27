# Austral Backend — Fase 7 (Banco)

## Qué se implementó

### 22 — Validación banco

Servicio `SolicitudService` con métodos transaccionales:

- `verifySolicitud(id, payload, user, meta)`
- `rejectSolicitudBanco(id, payload, user, meta)`

Cada operación ejecuta **en una sola transacción SQL**:

1. Valida solicitud activa y en estado **APROBADO** (`estado_id = 2`) — aprobada previamente por el agente
2. Valida que exista registro en `solicitud_deposito`
3. Actualiza `solicitudes.estado_id`, `etapa_actual` y `updated_by`
4. Inserta registro en `solicitud_historial` (con `motivo`, `ip_address`, `user_agent`)
5. Inserta comentario en `solicitud_comentarios` **solo si** se envía `comentario`

| Acción | Estado previo | `estado_id` | `etapa_actual` |
|--------|---------------|-------------|----------------|
| Verificar | APROBADO (2) | 2 (APROBADO) | `verificado_banco` |
| Rechazar banco | APROBADO (2) | 3 (RECHAZADO) | `rechazado_banco` |

## Flujo completo hasta aquí

```
registro (PENDIENTE)
  → aprobar agente → aprobado (APROBADO)
  → verificar banco → verificado_banco (APROBADO)
  → rechazar-banco → rechazado_banco (RECHAZADO)
```

## Endpoints (requieren ADMIN)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/solicitudes/:id/verificar` | Verificar depósito en banco |
| POST | `/solicitudes/:id/rechazar-banco` | Rechazar en validación bancaria |

### Body opcional

```json
{
  "motivo": "Depósito confirmado en cuenta",
  "comentario": "Verificado contra estado de cuenta"
}
```

## Ejemplo

```json
POST /solicitudes/<uuid>/verificar
{
  "motivo": "Referencia DEP-001 encontrada",
  "comentario": "Monto y fecha coinciden"
}
```

## Archivos tocados

- `src/modules/solicitudes/solicitud.service.js` — `processWorkflowTransition`, métodos banco
- `src/modules/solicitudes/solicitud.controller.js`
- `src/modules/solicitudes/solicitud.routes.js`
- `src/config/swagger.js`

## Pendiente (fase 8+)

Pagos, retornos, cancelaciones, gastos, movimientos, transacciones, cortes, evidencias.
