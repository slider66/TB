# Fase 1: Guía para Nuevas Features

Este documento detalla los criterios y procedimientos para implementar nuevas funcionalidades bajo la arquitectura de features desde el inicio del desarrollo.

## ¿Qué es una "Nueva Feature"?

Una nueva feature es cualquier funcionalidad que cumpla **al menos uno** de estos criterios:

### 1. Nueva Funcionalidad de Negocio

Cualquier capacidad nueva que añada valor al usuario final o stakeholder:

- Nueva página o sección del producto
- Nuevo flujo de trabajo completo (wizard, proceso multi-paso)
- Nueva capacidad de gestión o administración
- Nueva integración con servicios externos

**Ejemplos:**

- Sistema de notificaciones push
- Módulo de reportes avanzados
- Gestión de plantillas de documentos
- Dashboard de analíticas

### 2. Bounded Context Identificable

Una funcionalidad que tiene límites claros y puede describirse como un dominio:

- Tiene su propio modelo de datos
- Tiene reglas de negocio específicas
- Puede evolucionar independientemente
- Tiene un conjunto identificable de casos de uso

**Ejemplos:**

- Sistema de facturación
- Gestión de permisos y roles
- Motor de búsqueda avanzada
- Sistema de comentarios y colaboración

### 3. Requisito de Aislamiento

Funcionalidad que se beneficia de estar aislada:

- Puede tener su propio equipo responsable
- Requiere despliegue o testing independiente
- Tiene dependencias externas específicas
- Necesita versionado independiente

**Ejemplos:**

- Integración con API de terceros
- Motor de procesamiento de documentos
- Sistema de colas y workers
- Módulo de exportación/importación

## ¿Qué NO es una Nueva Feature?

### Componentes UI Reutilizables

Componentes que no tienen lógica de negocio propia:

- Botones, inputs, modales genéricos
- Layouts y estructuras de página
- Elementos de diseño system
  → **Ubicación correcta:** `src/shared/components/`

### Utilidades y Helpers Transversales

Funciones auxiliares sin dominio específico:

- Formateo de fechas, números, texto
- Validadores genéricos
- Helpers de transformación de datos
  → **Ubicación correcta:** `src/shared/utils/`

### Hooks Genéricos

Hooks que resuelven problemas técnicos comunes:

- useDebounce, useThrottle
- useLocalStorage, useMediaQuery
- useFetch genérico
  → **Ubicación correcta:** `src/shared/hooks/`

### Configuración y Setup

Archivos de configuración global:

- Clientes de APIs globales (Supabase, etc.)
- Configuración de rutas
- Tokens de diseño y estilos base
  → **Ubicación correcta:** `src/lib/`, `src/styles/`

## Checklist para Crear una Nueva Feature

Antes de crear una nueva feature, verifica:

- [ ] ✅ La funcionalidad tiene un propósito de negocio claro
- [ ] ✅ Puedes describirla en 1-2 frases sin mencionar tecnología
- [ ] ✅ Tiene un conjunto identificable de casos de uso
- [ ] ✅ Justifica tener su propio directorio vertical
- [ ] ✅ No es simplemente un componente UI reutilizable
- [ ] ✅ No es una utilidad técnica transversal

## Estructura Obligatoria de una Nueva Feature

Toda nueva feature **debe** seguir esta estructura:

```
src/features/<feature-name>/
├── index.ts              # ✅ OBLIGATORIO: Barrel de exports públicos
├── README.md             # ✅ OBLIGATORIO: Documentación de la feature
├── components/           # Componentes internos (no exportados)
├── hooks/                # Hooks específicos de la feature
├── services/             # Lógica de negocio y acceso a datos
├── model/                # Tipos, interfaces, validaciones
├── utils/                # Utilidades internas de la feature
├── __tests__/            # ✅ OBLIGATORIO: Pruebas de la feature
└── ui/                   # Componentes públicos (exportados vía barrel)
```

### Archivos Obligatorios

#### 1. `index.ts` - Barrel de Exports

```typescript
// ✅ CORRECTO: Export explícito desde barrel
export { FeatureMainComponent } from './ui/FeatureMainComponent'
export { useFeatureData } from './hooks/useFeatureData'
export type { FeatureConfig, FeatureData } from './model/types'

// ❌ INCORRECTO: Export * from
// export * from './ui'

// ❌ INCORRECTO: Export de componentes internos
// export { InternalHelper } from './components/InternalHelper'
```

#### 2. `README.md` - Documentación

```markdown
# Feature: <nombre>

## Propósito

Breve descripción del objetivo de negocio.

## API Pública

Lista de exports del barrel:

- `FeatureMainComponent`: Componente principal
- `useFeatureData`: Hook para acceder a datos
- Tipos: `FeatureConfig`, `FeatureData`

## Dependencias

- `@shared/components/Button`
- `@shared/hooks/useAuth`
- API externa: `example.com/api`

## Casos de Uso

1. Usuario hace X
2. Sistema responde Y
3. ...

## Notas de Implementación

Decisiones técnicas relevantes, limitaciones conocidas, etc.
```

#### 3. `__tests__/` - Pruebas

Al menos un test que verifique la funcionalidad principal:

```javascript
// __tests__/FeatureMainComponent.test.jsx
import { render, screen } from '@testing-library/react'
import { FeatureMainComponent } from '../'

describe('FeatureMainComponent', () => {
  it('renders without crashing', () => {
    render(<FeatureMainComponent />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
```

## Reglas de Imports

### ✅ Permitido

```javascript
// Desde pages/
import { FeatureMain } from '@/features/feature-name'
import { SharedButton } from '@/shared/components/Button'

// Dentro de la feature (rutas relativas)
import { InternalComponent } from '../components/InternalComponent'
import { helper } from '../utils/helper'

// Desde shared
import { formatDate } from '@/shared/utils/date'
```

### ❌ Prohibido (Enforced by ESLint)

```javascript
// ❌ Import directo saltando el barrel
import { InternalComponent } from '@/features/feature-name/components/InternalComponent'

// ❌ Import de componentes legacy sin barrel
import { OldComponent } from '@/components/OldComponent'

// ❌ Import entre features sin pasar por barrels
import { OtherFeature } from '@/features/other-feature/ui/OtherFeature'
```

## Flujo de Trabajo

### 1. Planificación (5-10 min)

- Definir el propósito de negocio
- Identificar los casos de uso principales
- Decidir las dependencias con shared/otras features
- Nombrar la feature (kebab-case)

### 2. Scaffolding (5 min)

```bash
mkdir -p src/features/<feature-name>/{ui,components,hooks,services,model,utils,__tests__}
touch src/features/<feature-name>/{index.ts,README.md}
```

### 3. Desarrollo (iterativo)

- Crear componentes internos primero
- Definir tipos y modelos
- Implementar servicios y hooks
- Exponer API pública vía barrel
- Escribir pruebas

### 4. Documentación (final)

- Completar README.md
- Documentar API pública en index.ts con JSDoc
- Añadir ejemplos de uso si es complejo

### 5. Integración

- Importar desde pages/ o features consumidoras
- Verificar que lint pasa
- Ejecutar tests
- Revisar bundle size si es relevante

## Ejemplos Reales

### Ejemplo 1: Feature de Notificaciones

```
src/features/notifications/
├── index.ts              # Exports: <NotificationCenter />, useNotifications()
├── README.md             # Documentación del sistema de notificaciones
├── ui/
│   └── NotificationCenter.jsx
├── components/
│   ├── NotificationItem.jsx
│   └── NotificationList.jsx
├── hooks/
│   ├── useNotifications.js
│   └── useNotificationSubscription.js
├── services/
│   ├── notificationService.js
│   └── notificationStorage.js
├── model/
│   └── types.ts
└── __tests__/
    ├── NotificationCenter.test.jsx
    └── notificationService.test.js
```

**Uso desde página:**

```javascript
// src/pages/DashboardPage.jsx
import { NotificationCenter } from '@/features/notifications'

export function DashboardPage() {
  return (
    <div>
      <NotificationCenter />
      {/* resto del contenido */}
    </div>
  )
}
```

### Ejemplo 2: Feature de Exportación de Datos

```
src/features/data-export/
├── index.ts              # Exports: <ExportWizard />, useExportJob()
├── README.md
├── ui/
│   ├── ExportWizard.jsx
│   └── ExportHistory.jsx
├── components/
│   ├── FormatSelector.jsx
│   ├── FieldMapper.jsx
│   └── ProgressTracker.jsx
├── hooks/
│   ├── useExportJob.js
│   └── useExportHistory.js
├── services/
│   ├── exportService.js
│   └── formatters/
│       ├── csvFormatter.js
│       └── jsonFormatter.js
├── model/
│   ├── types.ts
│   └── validation.js
└── __tests__/
    ├── exportService.test.js
    └── formatters.test.js
```

## Migración de Código Existente

Si necesitas extraer funcionalidad existente para convertirla en feature:

1. **NO lo hagas en Phase 1** - Phase 1 es solo para nuevo código
2. Espera a Phase 2 del plan de migración
3. Si es urgente, crea un issue documentando la necesidad
4. Mantén el código legacy funcionando mientras tanto

## Preguntas Frecuentes

### P: ¿Puedo crear subdirectorios dentro de la feature?

**R:** Sí, siempre que respetes la estructura base. Por ejemplo, `services/api/` o `components/forms/` está bien.

### P: ¿Puedo tener múltiples barrels (index.ts)?

**R:** No. Solo debe haber un barrel en la raíz de la feature. Si necesitas organización interna, usa carpetas pero exporta todo desde el barrel raíz.

### P: ¿Cuándo promover algo a shared/?

**R:** Cuando **2 o más features** necesiten el mismo código. Antes de eso, manténlo en la feature.

### P: ¿Puedo importar una feature desde otra?

**R:** Sí, pero solo a través del barrel y debe estar documentado en el README de ambas features como dependencia.

### P: ¿Cómo manejo código que aún no está en features/?

**R:** En Phase 1, puedes importar desde `src/components/`, `src/hooks/`, etc. El linter solo previene imports directos **dentro** de features.

## Validación

Antes de hacer commit:

```bash
# El linter verificará las reglas de imports
pnpm lint

# Los tests deben pasar
pnpm test:run

# Verifica que el barrel export esté completo
cat src/features/<feature-name>/index.ts
```

## Soporte

Si tienes dudas sobre si algo califica como nueva feature:

1. Revisa esta guía y el checklist
2. Consulta `docs/migration-to-features.md`
3. Si aún no está claro, pregunta al equipo en planning/standup

---

**Última actualización:** Fase 1 - Octubre 2025
