import { useState, useEffect, useCallback } from 'react'
import { exampleService } from '../services/exampleService'

/**
 * Hook to fetch and manage example data
 * @param {import('../model/types').ExampleConfig} config - Configuration options
 * @returns {import('../model/types').ExampleState & { refetch: () => void }}
 */
export function useExampleData(config = {}) {
  const [state, setState] = useState({
    data: [],
    status: 'idle',
    error: null
  })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'loading' }))
    
    try {
      const data = await exampleService.fetchData(config)
      setState({
        data,
        status: 'success',
        error: null
      })
    } catch (error) {
      setState({
        data: [],
        status: 'error',
        error
      })
    }
  }, [config])

  useEffect(() => {
    fetchData()
    
    // Set up auto-refresh if configured
    if (config.refreshInterval) {
      const interval = setInterval(fetchData, config.refreshInterval)
      return () => clearInterval(interval)
    }
  }, [config.refreshInterval, fetchData])

  return {
    ...state,
    refetch: fetchData
  }
}
