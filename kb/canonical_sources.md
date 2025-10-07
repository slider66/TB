# Fuentes canónicas del proyecto

> Lista las rutas y piezas de documentación/código consideradas referencia oficial. Actualiza este documento cuando se modifique algún contrato o requisito.

## Requisitos y alcance
- `docs/requisitos.md` — Requisitos funcionales, backlog y estándares.

## Onboarding y configuración
- `README.md` — Resumen del proyecto, instalación y scripts clave.
- `.env.example` — Variables de entorno obligatorias por entorno.

## Contratos MCP / Integraciones
- `openapi/mcp.yaml` — Contrato HTTP oficial para tools MCP y Edge Functions.
- `docs/visual-studio-mcp.md` — Guía para integrar MCP desde Visual Studio.
- `api/mcp.http` — Ejemplos de invocaciones HTTP (local/prod) para pruebas manuales.

## Seguridad y cumplimiento
- `docs/PLACEHOLDERS.md` — Política de placeholders y nombres explícitos.
- _(añadir futuros documentos de hardening, RGPD, etc.)_

## Base de datos y RLS
- `supabase/migrations/20250923184815_remote_schema.sql` — Esquema y políticas RLS actuales (fuente principal).
- `supabase/migrations/remote_export_20250923_223332.sql` — Export histórico (referencia secundaria).
- `supabase/migrations/remote_export_20250923_223340.sql` — Export histórico (referencia secundaria).

## Infraestructura
- _(añadir entradas cuando existan diagramas, runbooks o manuales de despliegue oficiales)._ 

## Notas
- Cada vez que una de estas fuentes cambie, revisa si hay que actualizar esta lista (nuevas tools MCP, nuevas guías, etc.).
- Si aparece una nueva fuente canónica en otra carpeta (por ejemplo `kb/`), enlázala aquí para que las IAs sepan dónde consultar la información más reciente.
