import { useCallback } from 'react'

/**
 * Hook to provide actions for the example feature
 * @returns {Object} Actions object
 */
export function useExampleActions() {
  const createItem = useCallback(async (data) => {
    // Simulate API call
    console.log('Creating item:', data)
    return { id: Date.now().toString(), ...data }
  }, [])

  const updateItem = useCallback(async (id, updates) => {
    // Simulate API call
    console.log('Updating item:', id, updates)
    return { id, ...updates }
  }, [])

  const deleteItem = useCallback(async (id) => {
    // Simulate API call
    console.log('Deleting item:', id)
    return { success: true }
  }, [])

  return {
    createItem,
    updateItem,
    deleteItem
  }
}
