# Feature: Example Feature

## Propósito

Este es un ejemplo de referencia que muestra la estructura correcta de una feature bajo la arquitectura Phase 1. Sirve como plantilla para nuevas features.

## API Pública

Exports disponibles desde `@/features/example-feature`:

### Componentes

- `ExampleWidget`: Componente principal para mostrar datos
- `ExampleDashboard`: Dashboard completo de la feature

### Hooks

- `useExampleData()`: Hook para acceder a los datos de la feature
- `useExampleActions()`: Hook para ejecutar acciones de la feature

### Tipos

- `ExampleConfig`: Configuración de la feature
- `ExampleData`: Estructura de datos principal
- `ExampleStatus`: Estados posibles de la feature

## Dependencias

### Internas

- `@/shared/components/Button` (si existiera)
- `@/shared/utils/validation` (si existiera)

### Externas

- Ninguna por ahora

## Casos de Uso

1. **Visualización de datos**
   - Usuario accede a la página que contiene ExampleWidget
   - El hook useExampleData carga los datos
   - ExampleWidget los muestra formateados

2. **Ejecución de acciones**
   - Usuario interactúa con controles en ExampleDashboard
   - useExampleActions provee funciones para modificar estado
   - Los cambios se reflejan automáticamente

## Estructura Interna

```
example-feature/
├── index.ts              # Barrel exports (API pública)
├── README.md             # Este archivo
├── ui/                   # Componentes exportados
│   ├── ExampleWidget.jsx
│   └── ExampleDashboard.jsx
├── components/           # Componentes internos
│   ├── ExampleCard.jsx
│   └── ExampleList.jsx
├── hooks/                # Hooks de la feature
│   ├── useExampleData.js
│   └── useExampleActions.js
├── services/             # Lógica de negocio
│   └── exampleService.js
├── model/                # Tipos y validaciones
│   └── types.ts
├── utils/                # Utilidades internas
│   └── formatters.js
└── __tests__/            # Tests de la feature
    └── ExampleWidget.test.jsx
```

## Notas de Implementación

- Esta es una feature de ejemplo, no tiene funcionalidad real
- Los archivos contienen código mínimo para demostrar la estructura
- En producción, cada archivo tendría implementación completa
- Los tests son obligatorios para features reales

## Ejemplo de Uso

```jsx
// En src/pages/ExamplePage.jsx
import { ExampleDashboard, useExampleData } from '@/features/example-feature'

export function ExamplePage() {
  const { data, loading } = useExampleData()

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <h1>Página de Ejemplo</h1>
      <ExampleDashboard data={data} />
    </div>
  )
}
```

## Estado

- ✅ Estructura creada
- ✅ Documentación completa
- ✅ Tests básicos incluidos
- ⚠️ Esta es una feature de ejemplo - no usar en producción

---

**Creado:** Fase 1 - Octubre 2025
**Mantenedor:** Equipo de Arquitectura
