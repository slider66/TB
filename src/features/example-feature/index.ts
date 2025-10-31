/**
 * Example Feature - Public API
 * 
 * Este es un ejemplo de cómo debe estructurarse el barrel export de una feature.
 * Solo se exportan los elementos que forman parte de la API pública de la feature.
 */

// Componentes principales (UI pública)
export { ExampleWidget } from './ui/ExampleWidget'
export { ExampleDashboard } from './ui/ExampleDashboard'

// Hooks expuestos
export { useExampleData } from './hooks/useExampleData'
export { useExampleActions } from './hooks/useExampleActions'

// Tipos y interfaces públicas
export type {
  ExampleConfig,
  ExampleData,
  ExampleStatus
} from './model/types'

// Servicios si son necesarios externamente (poco común)
// export { exampleService } from './services/exampleService'
