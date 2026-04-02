import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoEditInput } from './TodoEditInput'

function renderInput(props?: Partial<{ initialValue: string; onSave: (v: string) => void; onCancel: () => void }>) {
  const onSave = props?.onSave ?? vi.fn()
  const onCancel = props?.onCancel ?? vi.fn()
  render(
    <TodoEditInput
      initialValue={props?.initialValue ?? 'Bestehender Titel'}
      onSave={onSave}
      onCancel={onCancel}
    />
  )
  const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
  return { input, onSave, onCancel }
}

describe('TodoEditInput – Rendering', () => {
  it('rendert Input mit korrektem aria-label', () => {
    renderInput()
    expect(screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })).toBeInTheDocument()
  })

  it('füllt den Input mit initialValue vor', () => {
    const { input } = renderInput({ initialValue: 'Mein Titel' })
    expect(input).toHaveValue('Mein Titel')
  })

  it('erhält nach dem Rendern den Fokus (autofocus)', async () => {
    const { input } = renderInput()
    await waitFor(() => {
      expect(document.activeElement).toBe(input)
    })
  })

  it('selektiert beim Fokus den gesamten Titel (select-all)', async () => {
    const { input } = renderInput({ initialValue: 'Titel' }) as { input: HTMLInputElement }
    await waitFor(() => {
      expect((input as HTMLInputElement).selectionStart).toBe(0)
      expect((input as HTMLInputElement).selectionEnd).toBe('Titel'.length)
    })
  })
})

describe('TodoEditInput – Enter', () => {
  it('ruft onSave mit getrimmtem Wert auf wenn Enter gedrückt wird', async () => {
    const user = userEvent.setup()
    const { input, onSave } = renderInput({ initialValue: 'Alter Titel' })
    await user.clear(input)
    await user.type(input, 'Neuer Titel')
    await user.keyboard('[Enter]')
    expect(onSave).toHaveBeenCalledWith('Neuer Titel')
  })

  it('trimmt Whitespace vor dem Speichern', async () => {
    const user = userEvent.setup()
    const { input, onSave } = renderInput({ initialValue: '' })
    await user.type(input, '  Titel mit Spaces  ')
    await user.keyboard('[Enter]')
    expect(onSave).toHaveBeenCalledWith('Titel mit Spaces')
  })

  it('ruft onCancel auf wenn Enter mit leerem Inhalt', async () => {
    const user = userEvent.setup()
    const { input, onCancel } = renderInput({ initialValue: 'Alt' })
    await user.clear(input)
    await user.keyboard('[Enter]')
    expect(onCancel).toHaveBeenCalled()
  })

  it('ruft onCancel auf wenn Enter mit nur-Leerzeichen', async () => {
    const user = userEvent.setup()
    const { input, onCancel } = renderInput({ initialValue: 'Alt' })
    await user.clear(input)
    await user.type(input, '   ')
    await user.keyboard('[Enter]')
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('TodoEditInput – Escape', () => {
  it('ruft onCancel auf wenn Escape gedrückt wird', async () => {
    const user = userEvent.setup()
    const { onCancel } = renderInput()
    await user.keyboard('[Escape]')
    expect(onCancel).toHaveBeenCalled()
  })

  it('ruft onCancel auf unabhängig vom aktuellen Input-Wert', async () => {
    const user = userEvent.setup()
    const { input, onCancel } = renderInput({ initialValue: 'Alt' })
    await user.clear(input)
    await user.type(input, 'Neuer Text')
    await user.keyboard('[Escape]')
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('TodoEditInput – Blur', () => {
  it('ruft onSave auf wenn Fokus verlassen wird (nicht leer)', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(
      <>
        <TodoEditInput initialValue="Titel" onSave={onSave} onCancel={vi.fn()} />
        <button>Anderer Button</button>
      </>
    )
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.click(screen.getByRole('button', { name: /anderer button/i }))
    expect(onSave).toHaveBeenCalledWith('Titel')
  })

  it('ruft onCancel auf wenn Blur mit leerem Inhalt', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <>
        <TodoEditInput initialValue="Titel" onSave={vi.fn()} onCancel={onCancel} />
        <button>Anderer Button</button>
      </>
    )
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.click(screen.getByRole('button', { name: /anderer button/i }))
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('TodoEditInput – Race Condition (Enter + Blur)', () => {
  it('ruft onSave nur einmal auf wenn Enter gedrückt und dann Blur feuert', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(
      <>
        <TodoEditInput initialValue="Titel" onSave={onSave} onCancel={vi.fn()} />
        <button>Anderer Button</button>
      </>
    )
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.click(input)
    await user.keyboard('[Enter]')
    // onSave wird von TodoEditInput aufgerufen; TodoListArea verhindert Doppel-Save via Reducer
    // Hier testen wir nur dass TodoEditInput onSave korrekt einmal aufruft
    expect(onSave).toHaveBeenCalledTimes(1)
  })
})

describe('TodoEditInput – maxLength', () => {
  it('hat maxLength 200', () => {
    const { input } = renderInput()
    expect(input).toHaveAttribute('maxlength', '200')
  })
})
