/**
 * Utility functions for the example feature
 * These are internal helpers not exposed via the barrel
 */

/**
 * Format example data for display
 * @param {import('../model/types').ExampleData} data
 * @returns {string}
 */
export function formatExampleData(data) {
  return `${data.title} - ${data.status}`
}

/**
 * Validate example configuration
 * @param {import('../model/types').ExampleConfig} config
 * @returns {boolean}
 */
export function validateConfig(config) {
  if (config.maxItems && config.maxItems < 1) {
    return false
  }
  if (config.refreshInterval && config.refreshInterval < 1000) {
    return false
  }
  return true
}
