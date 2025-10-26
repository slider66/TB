import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Example Test', () => {
  it('renders content and finds it on screen', () => {
    const TestComponent = () => <div>Hola Traductor</div>

    render(<TestComponent />)

    expect(screen.getByText('Hola Traductor')).toBeInTheDocument()
  })
})
