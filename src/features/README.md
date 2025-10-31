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

**Fase 1 ACTIVA:** A partir de ahora, todas las nuevas funcionalidades deben crearse bajo `features/` siguiendo la estructura documentada.

- ✅ **Documentación completa:** Ver [`docs/phase1-new-features-guide.md`](../../docs/phase1-new-features-guide.md)
- ✅ **Lint rules configuradas:** ESLint validará automáticamente los imports de barrels
- ✅ **Feature de ejemplo disponible:** Ver [`example-feature/`](./example-feature) como referencia
- ⏳ **Código legacy:** Permanece en su ubicación actual hasta Fase 2

### Próximos Pasos para Desarrolladores

1. **¿Vas a crear nueva funcionalidad?**
   - Lee [`docs/phase1-new-features-guide.md`](../../docs/phase1-new-features-guide.md)
   - Verifica que cumple los criterios de "nueva feature"
   - Usa `example-feature/` como plantilla
   - Sigue la estructura obligatoria documentada

2. **¿Necesitas modificar código existente?**
   - Continúa trabajando en las ubicaciones actuales (`src/components`, `src/hooks`, etc.)
   - NO muevas código todavía, eso será parte de Fase 2
   - Si necesitas código legacy desde una nueva feature, importa normalmente

3. **Validación automática**
   - `pnpm lint` verificará que respetes los barrels
   - El linter bloqueará imports directos a subdirectorios de features
   - Los tests deben pasar antes de hacer commit

### Recursos

- **Plan completo:** [`docs/migration-to-features.md`](../../docs/migration-to-features.md)
- **Guía Phase 1:** [`docs/phase1-new-features-guide.md`](../../docs/phase1-new-features-guide.md)
- **Feature ejemplo:** [`example-feature/`](./example-feature)
- **Shared resources:** [`../shared/README.md`](../shared/README.md)
