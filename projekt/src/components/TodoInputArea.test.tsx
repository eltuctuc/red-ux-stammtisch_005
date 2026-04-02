import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoInputArea } from './TodoInputArea'

beforeEach(() => {
  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => `uuid-${Math.random()}`),
  })
})

describe('TodoInputArea', () => {
  it('rendert ein Textfeld mit autofocus', async () => {
    render(<TodoInputArea onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })
    await waitFor(() => {
      expect(document.activeElement).toBe(input)
    })
  })

  it('hat ein sr-only Label "Neues Todo"', () => {
    render(<TodoInputArea onAdd={vi.fn()} />)
    expect(screen.getByLabelText(/neues todo/i)).toBeInTheDocument()
  })

  it('ruft onAdd auf und leert das Feld nach Enter', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInputArea onAdd={onAdd} />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })

    await user.type(input, 'Mein erstes Todo')
    await user.keyboard('{Enter}')

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd.mock.calls[0][0].title).toBe('Mein erstes Todo')
    expect(input).toHaveValue('')
  })

  it('ruft onAdd auf nach Button-Klick', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInputArea onAdd={onAdd} />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })
    const btn = screen.getByRole('button', { name: /todo hinzufügen/i })

    await user.type(input, 'Per Klick angelegt')
    await user.click(btn)

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd.mock.calls[0][0].title).toBe('Per Klick angelegt')
  })

  it('ignoriert leere Eingabe bei Enter – kein onAdd, kein Fehler', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInputArea onAdd={onAdd} />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })

    await user.click(input)
    await user.keyboard('{Enter}')

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('ignoriert Eingabe aus nur Leerzeichen', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInputArea onAdd={onAdd} />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })

    await user.type(input, '   ')
    await user.keyboard('{Enter}')

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('Fokus bleibt im Input nach Anlegen', async () => {
    const user = userEvent.setup()
    render(<TodoInputArea onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })

    await user.type(input, 'Test-Todo')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(document.activeElement).toBe(input)
    })
  })

  it('Fokus kehrt nach Button-Klick mit leerem Inhalt ins Input zurück', async () => {
    const user = userEvent.setup()
    render(<TodoInputArea onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })
    const btn = screen.getByRole('button', { name: /todo hinzufügen/i })

    await user.click(btn)

    await waitFor(() => {
      expect(document.activeElement).toBe(input)
    })
  })

  it('Fokus kehrt nach Button-Klick mit Leerzeichen-Inhalt ins Input zurück', async () => {
    const user = userEvent.setup()
    render(<TodoInputArea onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })
    const btn = screen.getByRole('button', { name: /todo hinzufügen/i })

    await user.type(input, '   ')
    await user.click(btn)

    await waitFor(() => {
      expect(document.activeElement).toBe(input)
    })
  })

  it('maxLength verhindert Eingabe über 200 Zeichen', () => {
    render(<TodoInputArea onAdd={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })
    expect(input).toHaveAttribute('maxlength', '200')
  })
})
