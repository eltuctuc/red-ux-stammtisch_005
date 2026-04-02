import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import type { Todo } from '../types'

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
  it('zeigt erledigte Todos mit sr-only "(erledigt)" Text', () => {
    const doneTodo = makeTodo({ title: 'Erledigtes Todo', status: 'done' })
    localStorageMock.setItem('todos', JSON.stringify([doneTodo]))
    render(<App />)
    expect(screen.getAllByText(/erledigt/i).length).toBeGreaterThan(0)
  })

  it('erledigtes Todo-Item hat done-Klasse', () => {
    const doneTodo = makeTodo({ title: 'Done Item', status: 'done' })
    localStorageMock.setItem('todos', JSON.stringify([doneTodo]))
    render(<App />)
    const item = screen.getByRole('listitem')
    expect(item).toHaveClass('todo-item--done')
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
})
