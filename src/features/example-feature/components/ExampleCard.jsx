import React from 'react'

/**
 * ExampleCard - Internal component
 * This component is NOT exported and is only used within the feature
 */
export function ExampleCard({ data }) {
  const statusColors = {
    idle: 'bg-gray-100 text-gray-800',
    loading: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-lg">{data.title}</h4>
        <span className={`px-2 py-1 rounded text-xs ${statusColors[data.status]}`}>
          {data.status}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{data.description}</p>
      <div className="text-xs text-gray-400">
        {data.createdAt.toLocaleDateString()}
      </div>
    </div>
  )
}
