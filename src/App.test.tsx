import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe('Min Matvecka scratch dual-mode PWA', () => {
  it('shows one product with LSS and family mode choices plus Potatis', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /Min Matvecka/i })).toBeInTheDocument()
    expect(screen.getByText(/Maten för veckan, klar på några minuter\./i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /LSS-boende/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Familj hemma/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Potatis hjälper dig planera veckan/i })).toHaveAttribute('src', 'mascot/marketing/m1-transparent.png')
  })

  it('changes setup copy for LSS mode and generates a pilot-ready week', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /LSS-boende/i }))
    expect(screen.getByLabelText(/Boendenamn/i)).toBeInTheDocument()
    expect(screen.getByText(/För boenden där maten ska planeras tillsammans/i)).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/Boendenamn/i))
    await user.type(screen.getByLabelText(/Boendenamn/i), 'Solrosen')
    await user.click(screen.getByRole('button', { name: /JA Tacos/i }))
    await user.click(screen.getByRole('button', { name: /NEJ Fisk/i }))
    await user.click(screen.getByRole('button', { name: /Skapa matvecka/i }))

    expect(screen.getByRole('heading', { name: /Solrosens matvecka/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Veckomatsedel/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Inköpslista/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Dela/i })).toBeInTheDocument()
    expect(screen.getByText(/Ansvarig person kontrollerar alltid allergier/i)).toBeInTheDocument()
  })

  it('uses family mode copy, shopping list and meal replacement', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Familj hemma/i }))
    expect(screen.getByLabelText(/Familjenamn/i)).toBeInTheDocument()
    expect(screen.getByText(/För familjer som vill slippa vardagsmatskaos/i)).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/Familjenamn/i))
    await user.type(screen.getByLabelText(/Familjenamn/i), 'Myrenblom')
    await user.click(screen.getByRole('button', { name: /JA Tacos/i }))
    await user.click(screen.getByRole('button', { name: /Skapa matvecka/i }))

    expect(screen.getByRole('heading', { name: /Myrenbloms matvecka/i })).toBeInTheDocument()
    expect(screen.getAllByText(/koriander/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/gräddfil/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/lime/i).length).toBeGreaterThan(0)

    const monday = within(screen.getByTestId('meal-day-0'))
    const before = monday.getByRole('heading').textContent
    await user.click(monday.getByRole('button', { name: /Byt/i }))
    expect(within(screen.getByTestId('meal-day-0')).getByRole('heading').textContent).not.toEqual(before)
  })
})
