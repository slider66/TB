import React from 'react'

/**
 * ExampleList - Internal component
 * Displays a list of items with action buttons
 */
export function ExampleList({ items, onUpdate, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
        <p className="text-lg mb-2">No hay items</p>
        <p className="text-sm">Crea tu primer item para comenzar</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex-1">
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate(item.id)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Actualizar
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
