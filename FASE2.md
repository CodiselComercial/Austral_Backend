# Austral Backend — Fase 2 (Catálogos base)

## Qué se implementó

- **empresas_austral** — CRUD con soft delete
- **empresas_internas** — CRUD con soft delete
- **cuentas_empresa_austral** — CRUD con lógica financiera inicial

## Endpoints (todos requieren ADMIN)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/empresas-austral` | Listar (`?active=true\|false`) |
| GET | `/empresas-austral/:id` | Detalle |
| POST | `/empresas-austral` | Crear |
| PUT | `/empresas-austral/:id` | Actualizar nombre |
| DELETE | `/empresas-austral/:id` | Desactivar (soft) |
| GET | `/empresas-internas` | Listar (`?active=true\|false`) |
| GET | `/empresas-internas/:id` | Detalle |
| POST | `/empresas-internas` | Crear |
| PUT | `/empresas-internas/:id` | Actualizar nombre |
| DELETE | `/empresas-internas/:id` | Desactivar (soft) |
| GET | `/cuentas-empresa-austral` | Listar (`?active`, `?empresa_austral_id`) |
| GET | `/cuentas-empresa-austral/:id` | Detalle (incluye `empresa_austral_nombre`) |
| POST | `/cuentas-empresa-austral` | Crear cuenta |
| PUT | `/cuentas-empresa-austral/:id` | Actualizar datos bancarios |
| DELETE | `/cuentas-empresa-austral/:id` | Desactivar cuenta |

## Lógica financiera (cuentas_empresa_austral)

- `saldo_actual` y `saldo_disponible` inician en **0** o en `saldo_inicial` al crear.
- **No** se pueden modificar saldos vía PUT (quedan para movimientos/transacciones en fases posteriores).
- No se desactiva una cuenta con saldo distinto de cero.
- No se desactiva una empresa Austral si tiene cuentas activas.
- Validación de unicidad: `numero_clabe`, `clave_interbancaria`, `tarjeta`.
- La cuenta debe pertenecer a una `empresa_austral` activa.

## Migraciones nuevas

- `006_create_empresas_austral.js`
- `007_create_empresas_internas.js`
- `008_create_cuentas_empresa_austral.js`

## Levantar

```bash
npm run docker:up
# o local:
npm run setup && npm run dev
```

Swagger: http://localhost:3000/api-docs

## Pendiente (fase 3+)

asociados, clientes, beneficiarios, solicitudes, pagos, gastos, movimientos, transacciones, cortes, evidencias.
