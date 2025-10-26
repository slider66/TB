# Arquitectura basada en features

Este directorio agrupará todo el código orientado a una funcionalidad concreta del producto. El objetivo es encapsular UI, lógica, datos y pruebas de cada feature en un único vertical que pueda evolucionar de forma independiente.

## Estructura objetivo en `src/`

```
src/
├─ features/          # Vertical slices por feature
│  └─ <feature>/      # p.ej. case-management, onboarding
├─ shared/            # Recursos transversales reutilizables
├─ pages/             # Entradas de router (rutas públicas/privadas)
├─ styles/            # Tokens globales y estilos base
└─ test/              # Configuración y utilidades de testing
```

Cada feature tendrá una estructura interna homogénea:

```
features/<feature>/
├─ api/           # Clientes/rest hooks específicos
├─ components/    # Componentes presentacionales de la feature
├─ hooks/         # Hooks de estado o sincronización
├─ model/         # Tipos, validaciones, transformadores
├─ services/      # Casos de uso, acceso a datos, side effects
├─ ui/            # Entradas públicas (widgets/patterns)
├─ utils/         # Helpers locales (se exportan sólo si se usan fuera)
├─ __tests__/     # Pruebas unitarias o de integración de la feature
├─ index.ts       # Punto de re-export controlado
└─ README.md      # Contexto corto, decisiones y diagramas (opcional)
```

### Reglas de organización

- **Dominio primero**: cada carpeta bajo `features/` responde a un objetivo de negocio (p.ej. `case-tracking`, `auth`). Evitar agrupar por tipo genérico.
- **Barrels controlados**: `index.ts` expone únicamente la API pública de la feature (componentes, hooks o servicios). Importaciones externas usan siempre esos barrels.
- **Separación UI/flujo**: los componentes presentacionales residen en `ui/` o `components/`, mientras que la coordinación de datos y efectos vive en `hooks/` o `services/`.
- **Dependencias**: una feature solo puede depender de:
  1. Sus propios módulos internos.
  2. `shared/` para utilidades cross-cutting aprobadas.
  3. Features de menor nivel declaradas explícitamente en el README de cada feature.
- **Pruebas co-localizadas**: las pruebas que ejercitan la feature van en `__tests__/` con el mismo árbol de imports, facilitando refactors verticales.

### Estado actual

No se ha movido código todavía. Esta guía servirá para preparar la transición. Cualquier iniciativa debe pasar primero por el plan de migración documentado en `docs/migration-to-features.md`.
