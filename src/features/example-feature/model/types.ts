/**
 * Types and interfaces for the example feature
 */

export type ExampleStatus = 'idle' | 'loading' | 'success' | 'error'

export interface ExampleConfig {
  /** Enable debug mode */
  debug?: boolean
  /** Maximum items to display */
  maxItems?: number
  /** Auto-refresh interval in ms */
  refreshInterval?: number
}

export interface ExampleData {
  id: string
  title: string
  description: string
  status: ExampleStatus
  createdAt: Date
  metadata?: Record<string, unknown>
}

export interface ExampleState {
  data: ExampleData[]
  status: ExampleStatus
  error?: Error | null
}
