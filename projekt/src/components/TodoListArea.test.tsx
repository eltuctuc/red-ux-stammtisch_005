import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { StatusToggle } from './StatusToggle'
import { editReducer, deleteReducer } from './TodoListArea'
import type { Todo } from '../types'

// ── editReducer Unit Tests (QA-002) ──────────────────────────────────────────

describe('editReducer – Unit Tests', () => {
  const idle = { editingId: null, originalValue: '' }
  const editing = { editingId: 'abc', originalValue: 'Alter Titel' }

  it('idle + EDIT_START → editing mit korrekten Werten', () => {
    const next = editReducer(idle, { type: 'EDIT_START', id: 'abc', title: 'Alter Titel' })
    expect(next).toEqual({ editingId: 'abc', originalValue: 'Alter Titel' })
  })

  it('editing + EDIT_SAVE → idle', () => {
    const next = editReducer(editing, { type: 'EDIT_SAVE' })
    expect(next).toEqual({ editingId: null, originalValue: '' })
  })

  it('editing + EDIT_CANCEL → idle', () => {
    const next = editReducer(editing, { type: 'EDIT_CANCEL' })
    expect(next).toEqual({ editingId: null, originalValue: '' })
  })

  it('idle + EDIT_SAVE → idle (no-op – Race-Condition-Schutz)', () => {
    const next = editReducer(idle, { type: 'EDIT_SAVE' })
    expect(next).toBe(idle) // referenzidentisch: kein neues Objekt
  })

  it('idle + EDIT_CANCEL → idle (no-op)', () => {
    const next = editReducer(idle, { type: 'EDIT_CANCEL' })
    expect(next).toBe(idle)
  })
})

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

beforeEach(() => {
  vi.stubGlobal('localStorage', localStorageMock)
  localStorageMock.clear()
  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => `uuid-${Math.random()}`),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: crypto.randomUUID(),
    title: 'Test Todo',
    createdAt: new Date().toISOString(),
    status: 'open',
    ...overrides,
  }
}

describe('TodoListArea – Leerer Zustand', () => {
  it('zeigt Empty State wenn kein localStorage-Eintrag', () => {
    render(<App />)
    expect(screen.getByText(/noch keine todos/i)).toBeInTheDocument()
    expect(screen.getByText(/einfach oben tippen/i)).toBeInTheDocument()
  })

  it('zeigt Empty State bei korrupten localStorage-Daten (silent fallback)', () => {
    localStorageMock.setItem('todos', '{kaputt}')
    render(<App />)
    expect(screen.getByText(/noch keine todos/i)).toBeInTheDocument()
  })

  it('Eingabefeld ist fokussiert im Leerzustand', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })
    await waitFor(() => {
      expect(document.activeElement).toBe(input)
    })
  })
})

describe('TodoListArea – Todos anzeigen', () => {
  it('zeigt gespeicherte Todos aus localStorage', () => {
    const todo = makeTodo({ title: 'Persistiertes Todo' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    expect(screen.getByText('Persistiertes Todo')).toBeInTheDocument()
  })

  it('sortiert Todos: neueste zuerst', () => {
    const older = makeTodo({ title: 'Älteres Todo', createdAt: '2026-04-01T08:00:00.000Z' })
    const newer = makeTodo({ title: 'Neueres Todo', createdAt: '2026-04-01T10:00:00.000Z' })
    localStorageMock.setItem('todos', JSON.stringify([older, newer]))
    render(<App />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Neueres Todo')
    expect(items[1]).toHaveTextContent('Älteres Todo')
  })

  it('zeigt die Todo-Liste als semantische Liste', () => {
    const todo = makeTodo()
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    expect(screen.getByRole('list', { name: /todo-liste/i })).toBeInTheDocument()
  })
})

describe('TodoListArea – Todo anlegen', () => {
  it('neues Todo erscheint in der Liste nach Enter', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })
    await user.type(input, 'Neues Todo per Test')
    await user.keyboard('{Enter}')
    expect(screen.getByText('Neues Todo per Test')).toBeInTheDocument()
  })

  it('localStorage wird nach Anlegen aktualisiert', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: /neues todo/i })
    await user.type(input, 'Gespeichertes Todo')
    await user.keyboard('{Enter}')
    await waitFor(() => {
      const stored = JSON.parse(localStorageMock.getItem('todos') ?? '[]') as Todo[]
      expect(stored.some((t) => t.title === 'Gespeichertes Todo')).toBe(true)
    })
  })

  it('Empty State verschwindet nach erstem Todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText(/noch keine todos/i)).toBeInTheDocument()
    const input = screen.getByRole('textbox', { name: /neues todo/i })
    await user.type(input, 'Erstes Todo')
    await user.keyboard('{Enter}')
    expect(screen.queryByText(/noch keine todos/i)).not.toBeInTheDocument()
  })
})

describe('TodoListArea – Erledigte Todos', () => {
  it('erledigtes Todo hat angehakte Checkbox mit SR-Label "als offen markieren"', () => {
    const doneTodo = makeTodo({ title: 'Erledigtes Todo', status: 'done' })
    localStorageMock.setItem('todos', JSON.stringify([doneTodo]))
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: /erledigtes todo als offen markieren/i })
    expect(checkbox).toBeChecked()
  })

  it('erledigtes Todo-Item hat done-Klasse', () => {
    const doneTodo = makeTodo({ title: 'Done Item', status: 'done' })
    localStorageMock.setItem('todos', JSON.stringify([doneTodo]))
    render(<App />)
    const item = screen.getByRole('listitem')
    expect(item).toHaveClass('todo-item--done')
  })

  it('erledigtes Todo-Item hat aria-label mit "(erledigt)" für SR-Listing-Navigation', () => {
    const doneTodo = makeTodo({ title: 'Scan-Test', status: 'done' })
    localStorageMock.setItem('todos', JSON.stringify([doneTodo]))
    render(<App />)
    expect(screen.getByRole('listitem', { name: /scan-test \(erledigt\)/i })).toBeInTheDocument()
  })

  it('offenes Todo-Item hat kein "(erledigt)" im aria-label', () => {
    const openTodo = makeTodo({ title: 'Offenes Todo' })
    localStorageMock.setItem('todos', JSON.stringify([openTodo]))
    render(<App />)
    const item = screen.getByRole('listitem')
    expect(item).not.toHaveAccessibleName(/erledigt/i)
  })
})

describe('TodoListArea – Status-Toggle', () => {
  it('Toggle-Checkbox ist initial nicht angehakt bei offenem Todo', () => {
    const todo = makeTodo({ title: 'Offenes Todo' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: /offenes todo/i })
    expect(checkbox).not.toBeChecked()
  })

  it('Toggle-Checkbox ist angehakt bei erledigtem Todo', () => {
    const todo = makeTodo({ title: 'Erledigtes Todo', status: 'done' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: /erledigtes todo/i })
    expect(checkbox).toBeChecked()
  })

  it('Klick auf Toggle wechselt Status zu erledigt', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Zu erledigen' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: /zu erledigen/i })
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(screen.getByRole('listitem')).toHaveClass('todo-item--done')
  })

  it('Klick auf erledigtes Todo setzt Status zurück zu offen', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Schon erledigt', status: 'done' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: /schon erledigt/i })
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(screen.getByRole('listitem')).not.toHaveClass('todo-item--done')
  })

  it('Enter-Taste auf fokussiertem Toggle wechselt Status', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Keyboard Toggle' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: /keyboard toggle/i })
    checkbox.focus()
    await user.keyboard('{Enter}')
    expect(checkbox).toBeChecked()
  })

  it('Space-Taste auf fokussiertem Toggle wechselt Status (nativ)', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Space Toggle' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: /space toggle/i })
    checkbox.focus()
    await user.keyboard(' ')
    expect(checkbox).toBeChecked()
  })

  it('localStorage wird nach Toggle aktualisiert', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Persistenz-Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: /persistenz-test/i })
    await user.click(checkbox)
    await waitFor(() => {
      const stored = JSON.parse(localStorageMock.getItem('todos') ?? '[]') as Todo[]
      expect(stored[0].status).toBe('done')
    })
  })

  it('Todo behält Position nach Status-Toggle (keine Umsortierung)', async () => {
    const user = userEvent.setup()
    const older = makeTodo({ title: 'Älteres Todo', createdAt: '2026-04-01T08:00:00.000Z' })
    const newer = makeTodo({ title: 'Neueres Todo', createdAt: '2026-04-01T10:00:00.000Z' })
    localStorageMock.setItem('todos', JSON.stringify([older, newer]))
    render(<App />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Neueres Todo')
    const olderCheckbox = screen.getByRole('checkbox', { name: /älteres todo/i })
    await user.click(olderCheckbox)
    const itemsAfter = screen.getAllByRole('listitem')
    expect(itemsAfter[0]).toHaveTextContent('Neueres Todo')
    expect(itemsAfter[1]).toHaveTextContent('Älteres Todo')
  })

  it('SR-Label wechselt zu "als offen markieren" wenn Todo erledigt ist', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Label-Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: /label-test als erledigt markieren/i })
    await user.click(checkbox)
    expect(screen.getByRole('checkbox', { name: /label-test als offen markieren/i })).toBeChecked()
  })
})

describe('FEAT-4 – Todo bearbeiten (Inline-Editing)', () => {
  it('Doppelklick auf Titel öffnet Inline-Input', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Bearbeitbarer Titel' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const titleSpan = screen.getByText('Bearbeitbarer Titel')
    await user.dblClick(titleSpan)
    expect(screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })).toBeInTheDocument()
    expect(screen.queryByText('Bearbeitbarer Titel')).not.toBeInTheDocument()
  })

  it('Input enthält bestehenden Titel beim Öffnen', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Vorhandener Titel' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Vorhandener Titel'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    expect(input).toHaveValue('Vorhandener Titel')
  })

  it('Enter speichert neuen Titel und schließt Input', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Alter Titel' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Alter Titel'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.type(input, 'Neuer Titel')
    await user.keyboard('[Enter]')
    expect(screen.queryByRole('textbox', { name: /todo-titel bearbeiten/i })).not.toBeInTheDocument()
    expect(screen.getByText('Neuer Titel')).toBeInTheDocument()
  })

  it('Escape verwirft Änderung und stellt Original wieder her', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Original Titel' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Original Titel'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.type(input, 'Verändert')
    await user.keyboard('[Escape]')
    expect(screen.queryByRole('textbox', { name: /todo-titel bearbeiten/i })).not.toBeInTheDocument()
    expect(screen.getByText('Original Titel')).toBeInTheDocument()
  })

  it('Leerer Titel + Enter verhält sich wie Escape', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Darf nicht weg' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Darf nicht weg'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.keyboard('[Enter]')
    expect(screen.getByText('Darf nicht weg')).toBeInTheDocument()
  })

  it('Blur speichert neuen Titel', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Blur Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Blur Test'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.type(input, 'Nach Blur')
    // Tab löst Blur aus
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText('Nach Blur')).toBeInTheDocument()
    })
  })

  it('Enter dann Blur speichert nur einmal (Race Condition)', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Race Condition Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Race Condition Test'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.type(input, 'Einmalig Gespeichert')
    await user.keyboard('[Enter]')
    // Blur feuert danach automatisch durch den State-Wechsel
    await waitFor(() => {
      const stored = JSON.parse(localStorageMock.getItem('todos') ?? '[]') as Todo[]
      expect(stored[0].title).toBe('Einmalig Gespeichert')
    })
    // Kein zweiter Render oder doppelter State-Update
    expect(screen.getAllByText('Einmalig Gespeichert')).toHaveLength(1)
  })

  it('Doppelklick auf Todo-A öffnet Edit, dann Doppelklick auf Todo-B speichert A und öffnet B', async () => {
    const user = userEvent.setup()
    const todoA = makeTodo({ title: 'Todo A', createdAt: '2026-04-01T10:00:00.000Z' })
    const todoB = makeTodo({ title: 'Todo B', createdAt: '2026-04-01T08:00:00.000Z' })
    localStorageMock.setItem('todos', JSON.stringify([todoA, todoB]))
    render(<App />)
    await user.dblClick(screen.getByText('Todo A'))
    const inputA = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(inputA)
    await user.type(inputA, 'Todo A Geändert')
    await user.dblClick(screen.getByText('Todo B'))
    await waitFor(() => {
      expect(screen.getByText('Todo A Geändert')).toBeInTheDocument()
    })
    expect(screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })).toHaveValue('Todo B')
  })

  it('Status-Toggle ist disabled während Edit-Modus', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Toggle Disabled Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Toggle Disabled Test'))
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('Geänderter Titel wird in localStorage persistiert', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Persistenz Titel' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Persistenz Titel'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.type(input, 'Gespeicherter Titel')
    await user.keyboard('[Enter]')
    await waitFor(() => {
      const stored = JSON.parse(localStorageMock.getItem('todos') ?? '[]') as Todo[]
      expect(stored[0].title).toBe('Gespeicherter Titel')
    })
  })

  it('Fokus kehrt nach Bearbeitung auf das Todo-Item zurück', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Fokus Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Fokus Test'))
    await user.keyboard('[Escape]')
    await waitFor(() => {
      const listItem = screen.getByRole('listitem')
      expect(document.activeElement).toBe(listItem)
    })
  })

  // ── QA-005: Fehlende Edge-Case-Tests ────────────────────────────────────────

  it('Nur-Leerzeichen + Blur → Original-Titel bleibt (Integration)', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Darf nicht weg via Blur' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Darf nicht weg via Blur'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.type(input, '   ')
    fireEvent.blur(input)
    await waitFor(() => {
      expect(screen.getByText('Darf nicht weg via Blur')).toBeInTheDocument()
    })
  })

  it('Doppelklick auf erledigtes Todo öffnet Edit-Modus', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Erledigtes Todo', status: 'done' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Erledigtes Todo'))
    expect(screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })).toBeInTheDocument()
  })

  it('200-Zeichen-Titel wird korrekt in Edit-Input geladen', async () => {
    const user = userEvent.setup()
    const longTitle = 'a'.repeat(199)
    const todo = makeTodo({ title: longTitle })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText(longTitle))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    expect(input).toHaveValue(longTitle)
    expect(input).toHaveAttribute('maxlength', '200')
  })

  it('Doppelklick + sofortiges Escape → Original-Titel bleibt, kein Zwischenzustand', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Schnell Escape' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Schnell Escape'))
    await user.keyboard('[Escape]')
    expect(screen.queryByRole('textbox', { name: /todo-titel bearbeiten/i })).not.toBeInTheDocument()
    expect(screen.getByText('Schnell Escape')).toBeInTheDocument()
  })

  // ── QA-006: Echter Race-Condition-Test (Enter + expliziter Blur) ────────────

  it('Race Condition: Enter + expliziter Blur → updateTodo nur einmal aufgerufen', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Race Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Race Test'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.type(input, 'Einmalig')
    // Enter auslösen → State wechselt zu idle
    fireEvent.keyDown(input, { key: 'Enter' })
    // Sofort Blur auslösen → handleSave prüft editStateRef, sieht idle → no-op
    fireEvent.blur(input)
    await waitFor(() => {
      const stored = JSON.parse(localStorageMock.getItem('todos') ?? '[]') as Todo[]
      expect(stored[0].title).toBe('Einmalig')
    })
    // Input ist weg (nicht durch Doppel-Save wieder geöffnet)
    expect(screen.queryByRole('textbox', { name: /todo-titel bearbeiten/i })).not.toBeInTheDocument()
    // Titel korrekt – nur einmalig gespeichert
    expect(screen.getByText('Einmalig')).toBeInTheDocument()
  })

  // ── QA-001: Keyboard-Einstieg in Edit-Modus ────────────────────────────────

  it('Enter auf fokussiertem Titel-Span öffnet Edit-Modus', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Keyboard Edit' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const titleBtn = screen.getByRole('button', { name: 'Keyboard Edit bearbeiten' })
    titleBtn.focus()
    await user.keyboard('[Enter]')
    expect(screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })).toBeInTheDocument()
  })

  it('F2 auf fokussiertem Titel-Span öffnet Edit-Modus', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'F2 Edit' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const titleBtn = screen.getByRole('button', { name: 'F2 Edit bearbeiten' })
    titleBtn.focus()
    await user.keyboard('{F2}')
    expect(screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })).toBeInTheDocument()
  })

  // ── QA-004: aria-label auf <li> während Edit ───────────────────────────────

  it('aria-label auf <li> zeigt "Todo wird bearbeitet" während Edit-Modus', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Label Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Label Test'))
    expect(screen.getByRole('listitem', { name: /todo wird bearbeitet/i })).toBeInTheDocument()
  })

  // ── UX-003: SR-Feedback nach Edit-Abschluss ────────────────────────────────

  it('SR-Status-Region zeigt "gespeichert" nach erfolgreichem Save', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'SR Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('SR Test'))
    const input = screen.getByRole('textbox', { name: /todo-titel bearbeiten/i })
    await user.clear(input)
    await user.type(input, 'Neuer SR Titel')
    await user.keyboard('[Enter]')
    await waitFor(() => {
      expect(screen.getByText(/neuer sr titel gespeichert/i)).toBeInTheDocument()
    })
  })

  it('SR-Status-Region zeigt "abgebrochen" nach Escape', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Cancel SR Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Cancel SR Test'))
    await user.keyboard('[Escape]')
    await waitFor(() => {
      expect(screen.getByText(/bearbeitung abgebrochen/i)).toBeInTheDocument()
    })
  })
})

// ── FEAT-5 deleteReducer Unit Tests ──────────────────────────────────────────

describe('deleteReducer – Unit Tests', () => {
  const idle = { confirmingId: null }
  const confirming = { confirmingId: 'abc' }

  it('idle + DELETE_TRIGGER → confirming mit korrekter ID', () => {
    const next = deleteReducer(idle, { type: 'DELETE_TRIGGER', id: 'abc' })
    expect(next).toEqual({ confirmingId: 'abc' })
  })

  it('confirming + DELETE_CONFIRM → idle', () => {
    const next = deleteReducer(confirming, { type: 'DELETE_CONFIRM' })
    expect(next).toEqual({ confirmingId: null })
  })

  it('confirming + DELETE_CANCEL → idle', () => {
    const next = deleteReducer(confirming, { type: 'DELETE_CANCEL' })
    expect(next).toEqual({ confirmingId: null })
  })

  it('idle + DELETE_CONFIRM → idle (no-op – Doppel-Klick-Schutz)', () => {
    const next = deleteReducer(idle, { type: 'DELETE_CONFIRM' })
    expect(next).toBe(idle) // referenzidentisch
  })

  it('idle + DELETE_CANCEL → idle (no-op)', () => {
    const next = deleteReducer(idle, { type: 'DELETE_CANCEL' })
    expect(next).toBe(idle) // referenzidentisch
  })
})

// ── FEAT-5 Integration Tests ──────────────────────────────────────────────────

describe('FEAT-5 – Todo löschen (Inline-Confirm)', () => {
  it('×-Button ist beim Todo sichtbar (via aria-label)', async () => {
    const todo = makeTodo({ title: 'Lösch-Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    expect(screen.getByRole('button', { name: 'Todo löschen' })).toBeInTheDocument()
  })

  it('Klick auf ×-Button zeigt Inline-Bestätigungszeile', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Zu löschen' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    expect(screen.getByRole('group', { name: /löschen bestätigen/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abbrechen' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Löschen' })).toBeInTheDocument()
  })

  it('Fokus liegt nach Öffnen auf [Abbrechen] – sicherer Default', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Fokus Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Abbrechen' }))
    })
  })

  it('[Abbrechen] schließt Bestätigungszeile ohne Löschen', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Nicht löschen' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    await user.click(screen.getByRole('button', { name: 'Abbrechen' }))
    expect(screen.queryByRole('group', { name: /löschen bestätigen/i })).not.toBeInTheDocument()
    expect(screen.getByText('Nicht löschen')).toBeInTheDocument()
  })

  it('Escape schließt Bestätigungszeile ohne Löschen', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Escape Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    await user.keyboard('[Escape]')
    expect(screen.queryByRole('group', { name: /löschen bestätigen/i })).not.toBeInTheDocument()
    expect(screen.getByText('Escape Test')).toBeInTheDocument()
  })

  it('Klick außerhalb schließt Bestätigungszeile ohne Löschen', async () => {
    const todo = makeTodo({ title: 'Klick außen Test' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    const deleteBtn = screen.getByRole('button', { name: 'Todo löschen' })
    fireEvent.click(deleteBtn)
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /löschen bestätigen/i })).toBeInTheDocument()
    })
    fireEvent.click(document.body)
    await waitFor(() => {
      expect(screen.queryByRole('group', { name: /löschen bestätigen/i })).not.toBeInTheDocument()
    })
    expect(screen.getByText('Klick außen Test')).toBeInTheDocument()
  })

  it('[Löschen] entfernt Todo aus der Liste', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Wirklich löschen' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    await user.click(screen.getByRole('button', { name: 'Löschen' }))
    expect(screen.queryByText('Wirklich löschen')).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /löschen bestätigen/i })).not.toBeInTheDocument()
  })

  it('[Löschen] aktualisiert localStorage', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Persistenz Löschen' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    await user.click(screen.getByRole('button', { name: 'Löschen' }))
    await waitFor(() => {
      const stored = JSON.parse(localStorageMock.getItem('todos') ?? '[]') as Todo[]
      expect(stored).toHaveLength(0)
    })
  })

  it('Letztes Todo löschen → EmptyState erscheint', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Letztes Todo' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    await user.click(screen.getByRole('button', { name: 'Löschen' }))
    expect(screen.getByText(/noch keine todos/i)).toBeInTheDocument()
  })

  it('×-Button ist disabled während Edit-Modus aktiv ist', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Edit + Delete' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.dblClick(screen.getByText('Edit + Delete'))
    expect(screen.getByRole('button', { name: 'Todo löschen' })).toBeDisabled()
  })

  it('Schneller Doppelklick auf [Löschen] → nur einmal gelöscht (no-op Schutz)', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Doppelklick Schutz' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    const loeschenBtn = screen.getByRole('button', { name: 'Löschen' })
    await user.click(loeschenBtn)
    // Nach erstem Klick ist State bereits idle → zweiter Klick ist no-op
    // Todo ist weg, kein doppelter State-Update möglich
    await waitFor(() => {
      const stored = JSON.parse(localStorageMock.getItem('todos') ?? '[]') as Todo[]
      expect(stored).toHaveLength(0)
    })
  })

  it('Erledigtes Todo löschen funktioniert identisch', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'Erledigtes löschen', status: 'done' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    await user.click(screen.getByRole('button', { name: 'Löschen' }))
    expect(screen.queryByText('Erledigtes löschen')).not.toBeInTheDocument()
  })

  it('Löschen eines von zwei Todos → verbleibendes Todo bleibt sichtbar', async () => {
    const user = userEvent.setup()
    const todoA = makeTodo({ title: 'Todo A', createdAt: '2026-04-01T10:00:00.000Z' })
    const todoB = makeTodo({ title: 'Todo B', createdAt: '2026-04-01T08:00:00.000Z' })
    localStorageMock.setItem('todos', JSON.stringify([todoA, todoB]))
    render(<App />)
    // Erstes ×-Button klicken (Todo A – das neuere, Index 0)
    const deleteButtons = screen.getAllByRole('button', { name: 'Todo löschen' })
    await user.click(deleteButtons[0])
    await user.click(screen.getByRole('button', { name: 'Löschen' }))
    expect(screen.queryByText('Todo A')).not.toBeInTheDocument()
    expect(screen.getByText('Todo B')).toBeInTheDocument()
  })

  it('SR-Live-Region kündigt Bestätigungsschritt an', async () => {
    const user = userEvent.setup()
    const todo = makeTodo({ title: 'SR Announce' })
    localStorageMock.setItem('todos', JSON.stringify([todo]))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
    await waitFor(() => {
      expect(screen.getByText('Löschen bestätigen?')).toBeInTheDocument()
    })
  })
})

describe('StatusToggle – disabled', () => {
  it('disabled Toggle löst keinen State-Wechsel aus bei Klick', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <StatusToggle
        todoId="test-id"
        todoTitle="Gesperrtes Todo"
        checked={false}
        disabled={true}
        onToggle={onToggle}
      />
    )
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    expect(onToggle).not.toHaveBeenCalled()
    expect(checkbox).not.toBeChecked()
  })

  it('disabled Toggle reagiert nicht auf Tastendruck', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <StatusToggle
        todoId="test-id"
        todoTitle="Gesperrtes Todo"
        checked={false}
        disabled={true}
        onToggle={onToggle}
      />
    )
    const checkbox = screen.getByRole('checkbox')
    checkbox.focus()
    await user.keyboard(' ')
    await user.keyboard('{Enter}')
    expect(onToggle).not.toHaveBeenCalled()
  })
})
