import React from 'react'
import { useExampleData } from '../hooks/useExampleData'
import { ExampleCard } from '../components/ExampleCard'

/**
 * Example Widget - Public UI component
 * This component is exported via the barrel and can be used externally
 */
export function ExampleWidget({ config }) {
  const { data, status, error, refetch } = useExampleData(config)

  if (status === 'loading') {
    return <div className="text-gray-500">Cargando datos...</div>
  }

  if (status === 'error') {
    return (
      <div className="text-red-500">
        Error: {error?.message || 'Ha ocurrido un error'}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Example Widget</h3>
        <button
          onClick={refetch}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Actualizar
        </button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map(item => (
          <ExampleCard key={item.id} data={item} />
        ))}
      </div>

      {data.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No hay datos disponibles
        </p>
      )}
    </div>
  )
}
