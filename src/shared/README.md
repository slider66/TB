# Recursos compartidos

`shared/` concentra utilidades transversales que no pertenecen a una feature concreta pero que aportan valor a varias. Sirve para evitar duplicidad y definir patrones reutilizables estables.

## Estructura recomendada

```
shared/
├─ api/           # Clientes http genéricos, adaptadores supabase, mocks
├─ config/        # Configuración global (feature flags, constants)
├─ hooks/         # Hooks reutilizables desacoplados del dominio
├─ lib/           # Funciones puras, formateadores, helpers
├─ ui/            # Componentes atómicos sin dependencia de negocio
├─ validation/    # Esquemas y validaciones comunes (p.ej. zod)
├─ testing/       # Builders, fixtures y utilidades para pruebas
└─ index.ts       # Re-exports organizados por categoría
```

### Criterios de inclusión

- **Sin contexto de dominio**: si el módulo necesita información específica de una feature (por ejemplo, `caseId`, supuestos de negocio), debe permanecer en esa feature.
- **Estabilidad primero**: sólo promover a `shared/` aquello que ya está consolidado y probado en varias partes de la aplicación.
- **Exportaciones explícitas**: los consumidores importan desde `shared` a través de `index.ts` o sub-barrels internos.
- **Disciplina de dependencias**: los módulos en `shared/` no pueden depender de código dentro de `features/` para evitar ciclos.

### Relación con otras carpetas

- `pages/` y las features consumen `shared/` como capa de componentes base o helpers.
- `styles/` mantiene tokens y estilos globales, la UI compartida debe basarse en ellos.
- `test/` aporta configuración; builders reutilizables viven en `shared/testing`.

> **Nota:** Aún no se ha movido ningún archivo hacia esta estructura. El plan por fases está descrito en `docs/migration-to-features.md` y debe seguirse antes de cualquier refactor.
