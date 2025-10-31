/**
 * Service layer for example feature
 * Handles business logic and data access
 */

/**
 * Fetch example data
 * @param {import('../model/types').ExampleConfig} config
 * @returns {Promise<import('../model/types').ExampleData[]>}
 */
export async function fetchData(config = {}) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const mockData = [
    {
      id: '1',
      title: 'Example Item 1',
      description: 'This is a mock example item',
      status: 'success',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Example Item 2',
      description: 'Another mock example item',
      status: 'idle',
      createdAt: new Date()
    }
  ]

  if (config.maxItems) {
    return mockData.slice(0, config.maxItems)
  }

  return mockData
}

/**
 * Service object with all feature methods
 */
export const exampleService = {
  fetchData
}
