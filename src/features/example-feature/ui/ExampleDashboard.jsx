import React from 'react'
import { useExampleData } from '../hooks/useExampleData'
import { useExampleActions } from '../hooks/useExampleActions'
import { ExampleList } from '../components/ExampleList'

/**
 * Example Dashboard - Public UI component
 * Complete dashboard view for the example feature
 */
export function ExampleDashboard({ config }) {
  const { data, status, error, refetch } = useExampleData(config)
  const { createItem, updateItem, deleteItem } = useExampleActions()

  const handleCreate = async () => {
    await createItem({
      title: 'New Item',
      description: 'Created from dashboard',
      status: 'idle'
    })
    refetch()
  }

  const handleUpdate = async (id) => {
    await updateItem(id, { status: 'success' })
    refetch()
  }

  const handleDelete = async (id) => {
    await deleteItem(id)
    refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Example Dashboard</h2>
          <p className="text-gray-600">Gestiona tus items de ejemplo</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Crear Item
        </button>
      </div>

      {status === 'loading' && (
        <div className="text-center py-12 text-gray-500">
          Cargando dashboard...
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          Error: {error?.message || 'Ha ocurrido un error'}
        </div>
      )}

      {status === 'success' && (
        <ExampleList
          items={data}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
