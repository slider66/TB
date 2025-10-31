import { render, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ExampleWidget } from '../ui/ExampleWidget'

// Mock the hooks
vi.mock('../hooks/useExampleData', () => ({
  useExampleData: vi.fn(() => ({
    data: [
      {
        id: '1',
        title: 'Test Item',
        description: 'Test description',
        status: 'success',
        createdAt: new Date('2025-01-01')
      }
    ],
    status: 'success',
    error: null,
    refetch: vi.fn()
  }))
}))

describe('ExampleWidget', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<ExampleWidget />)
    expect(getByText('Example Widget')).toBeInTheDocument()
  })

  it('displays data correctly', async () => {
    const { getByText } = render(<ExampleWidget />)
    
    await waitFor(() => {
      expect(getByText('Test Item')).toBeInTheDocument()
      expect(getByText('Test description')).toBeInTheDocument()
    })
  })

  it('shows refresh button', () => {
    const { getByText } = render(<ExampleWidget />)
    expect(getByText('Actualizar')).toBeInTheDocument()
  })
})
