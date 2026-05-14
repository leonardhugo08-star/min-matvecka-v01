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
    expect(screen.getByText(/Blixtsnabb matplanering/i)).toBeInTheDocument()
    expect(screen.getByText(/Framtagen för barnfamiljer och LSS-boenden/i)).toBeInTheDocument()
    expect(screen.getAllByText(/500\+/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Budgetkoll/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /LSS-boende/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Familj hemma/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Känn värdet innan du betalar/i })).toBeInTheDocument()
    expect(screen.getByText(/49 kr\/vecka/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Potatis hjälper dig planera veckan/i })).toHaveAttribute('src', 'mascot/marketing/m1-transparent.png')
  })

  it('changes setup copy for LSS mode and generates a pilot-ready week directly', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /LSS-boende/i }))
    expect(screen.getByLabelText(/Boendenamn/i)).toBeInTheDocument()
    expect(screen.getByText(/Tydligt, pedagogiskt och enkelt/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Önskemål, allergier eller vardagsbehov/i)).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/Boendenamn/i))
    await user.type(screen.getByLabelText(/Boendenamn/i), 'Solrosen')
    await user.click(screen.getByRole('button', { name: /Glutenfri/i }))
    await user.click(screen.getByRole('button', { name: /^Skapa gratis matvecka$/i }))

    expect(await screen.findByRole('heading', { name: /Solrosens matvecka/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Veckomatsedel/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Inköpslista/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Dela/i })).toBeInTheDocument()
    expect(screen.getByText(/Ansvarig person kontrollerar alltid allergier/i)).toBeInTheDocument()
  })

  it('uses family mode copy, together-choice flow, rawvara toggle, budget summary, shopping list and meal replacement', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Familj hemma/i }))
    expect(screen.getByLabelText(/Familjenamn/i)).toBeInTheDocument()
    expect(screen.getByText(/Snabbt, enkelt och varierande/i)).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/Familjenamn/i))
    await user.type(screen.getByLabelText(/Familjenamn/i), 'Myrenblom')
    await user.selectOptions(screen.getByLabelText(/Dagar/i), '5')
    await user.click(screen.getByRole('button', { name: /Laktosfri/i }))
    await user.click(screen.getByRole('button', { name: /Välj maträtter tillsammans/i }))

    expect(screen.getByRole('button', { name: /Färdiga rätter/i })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: /^Råvaror$/i }))
    expect(screen.getByText(/Gillar ni/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^Ja$/i }))
    expect(screen.getByText(/Råvaror styr förslagen/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Färdiga rätter/i }))

    expect(screen.getByText(/Alternativ/i)).toBeInTheDocument()
    for (let index = 0; index < 5; index += 1) {
      await user.click(screen.getByRole('button', { name: /^Ja$/i }))
    }

    expect(await screen.findByRole('heading', { name: /Myrenbloms matvecka/i })).toBeInTheDocument()
    expect(screen.getByText(/Ca \d+ kr för veckan/i)).toBeInTheDocument()
    expect(screen.getByText(/ca-priser/i)).toBeInTheDocument()
    expect(screen.getAllByTestId(/meal-day-/i)).toHaveLength(5)

    const monday = within(screen.getByTestId('meal-day-0'))
    const before = monday.getByRole('heading').textContent
    await user.click(monday.getByRole('button', { name: /Byt/i }))
    expect(within(screen.getByTestId('meal-day-0')).getByRole('heading').textContent).not.toEqual(before)
  })
})
