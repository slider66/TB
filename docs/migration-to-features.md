# Plan de migración a arquitectura por features

Este documento describe cómo transicionar gradualmente la carpeta `src/` hacia una arquitectura orientada a features sin interrumpir el desarrollo actual ni introducir regresiones.

## Resumen de la estructura objetivo

```
src/
├─ features/          # Vertical slices con UI + lógica + datos de cada feature
├─ shared/            # Utilidades y componentes transversales consolidados
├─ pages/             # Entradas de routing (mantienen composición mínima)
├─ styles/            # Tokens, capas globales (Tailwind, CSS vars)
└─ test/              # Configuración, mocks globales y setup de testing
```

## Fases de migración

### Fase 0 · Preparación

- Identificar feature owners y responsables por slice.
- Mapear componentes críticos en `src/components`, `src/hooks`, `src/lib`.
- Definir criterios de aceptación por feature (event storming ligero).
- Añadir lint rules/TSConfig paths necesarios (sin mover archivos).

**Salida requerida:** README acordados, checklist completada, y validación del equipo.

### Fase 1 · Nuevas features ya nacen en `features/`

- Todo desarrollo nuevo se crea bajo `features/<feature>/`.
- Se documenta en el README de la feature qué expone el barrel `index.ts`.
- Se añaden pruebas co-localizadas (`__tests__/`) para el código nuevo.

**Validador:** ningún import nuevo apunta a `src/components` o `src/hooks` genéricos.

### Fase 2 · Refactor progresivo de features existentes

- Seleccionar un dominio concreto (p.ej. autenticación) y moverlo completo.
- Sustituir imports en `pages/` para consumir desde el barrel de la feature.
- Promover a `shared/` únicamente los componentes/herramientas usados por ≥2 features.
- Mantener wrappers temporales en `src/components` que re-exporten desde la nueva ubicación hasta completar el barrido.

**Validador:** `pages/` y otras features sólo importan desde `features/<feature>` o `shared/`.

### Fase 3 · Limpieza y consolidación

- Eliminar wrappers temporales y carpetas legacy vacías (`components`, `hooks`).
- Actualizar documentación y diagramas.
- Ejecutar smoke tests y regresiones clave antes del release.

**Validador:** `src/components`, `src/hooks` quedan vacíos o removidos; imports verificados con lint personalizado.

## Checklist de habilitación

- [ ] Revisar READMEs en `src/features` y `src/shared` con todo el equipo.
- [ ] Alinear naming conventions (`kebab-case` para folders, `PascalCase` para componentes).
- [ ] Configurar alias de imports en bundler/TS para `@features/*` y `@shared/*`.
- [ ] Definir métrica de avance (p.ej. % de imports migrados).
- [ ] Documentar dependencias externas críticas por feature (API, auth, storage).
- [ ] Acordar ventanas de freeze para refactors de alto impacto.

## Ejemplos de re-exports

### Barrel de una feature (`features/case-tracking/index.ts`)

```ts
export { CaseTrackingPage } from './ui/CaseTrackingPage'
export { useCaseTimeline } from './hooks/useCaseTimeline'
export { fetchCaseSummary } from './services/fetchCaseSummary'
export type { CaseId, CaseSummary } from './model/types'
```

### Uso desde `pages/CaseDetailPage.tsx`

```tsx
import { CaseTrackingPage } from '@features/case-tracking'

export function CaseDetailPage() {
  return <CaseTrackingPage />
}
```

### Re-export temporal desde legacy (`components/CaseSummary.jsx`)

```tsx
// TODO: eliminar una vez que todos los imports apunten a @features/case-tracking
export { CaseSummaryCard } from '@features/case-tracking/ui/CaseSummaryCard'
```

## Validaciones y restricciones actuales

1. **No mover código todavía:** cualquier refactor físico requiere una PR dedicada con test coverage actualizado. Esta guía sólo habilita el andamiaje.
2. **Imports existentes inmutables:** hasta acordar la ventana de migración, no modificar rutas de import en `main.jsx`, `App.jsx` ni en `pages/`.
3. **Pruebas obligatorias:** antes de mover una feature, deben existir pruebas mínimas que garanticen estado estable (unitarias o de integración según aplique).
4. **Revisión cruzada:** cada migración de feature debe aprobarla al menos una persona ajena a la feature para garantizar consistencia.
5. **Documentación sincronizada:** cualquier movimiento debe reflejarse en el README de la feature y, si afecta a `shared/`, justificar por qué el recurso es transversal.

> **Siguiente paso recomendado:** programar una sesión corta de alineación para revisar y ajustar este plan antes de ejecutar la Fase 1.
