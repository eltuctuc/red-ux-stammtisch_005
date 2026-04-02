import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadTodosFromStorage } from './useTodos'
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
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const validTodo: Todo = {
  id: 'abc-123',
  title: 'Test Todo',
  createdAt: '2026-04-01T10:00:00.000Z',
  status: 'open',
}

describe('loadTodosFromStorage', () => {
  it('gibt leeres Array zurück wenn kein localStorage-Eintrag', () => {
    expect(loadTodosFromStorage()).toEqual([])
  })

  it('gibt leeres Array zurück bei ungültigem JSON', () => {
    localStorageMock.setItem('todos', '{not json}')
    expect(loadTodosFromStorage()).toEqual([])
    expect(localStorageMock.getItem('todos')).toBeNull()
  })

  it('gibt leeres Array zurück wenn gespeicherter Wert kein Array ist', () => {
    localStorageMock.setItem('todos', JSON.stringify({ id: '1' }))
    expect(loadTodosFromStorage()).toEqual([])
    expect(localStorageMock.getItem('todos')).toBeNull()
  })

  it('lädt valide Todos korrekt', () => {
    localStorageMock.setItem('todos', JSON.stringify([validTodo]))
    expect(loadTodosFromStorage()).toEqual([validTodo])
  })

  it('filtert korrupte Items heraus, valide bleiben erhalten', () => {
    const corrupt = { id: 123, title: null }
    localStorageMock.setItem('todos', JSON.stringify([validTodo, corrupt]))
    const result = loadTodosFromStorage()
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(validTodo)
  })

  it('filtert Items mit ungültigem Status heraus', () => {
    const badStatus = { ...validTodo, status: 'maybe' }
    localStorageMock.setItem('todos', JSON.stringify([badStatus]))
    expect(loadTodosFromStorage()).toEqual([])
  })

  it('filtert Items mit nicht-parsebarem createdAt heraus', () => {
    const badDate = { ...validTodo, createdAt: 'kein-datum' }
    localStorageMock.setItem('todos', JSON.stringify([badDate]))
    expect(loadTodosFromStorage()).toEqual([])
  })

  it('akzeptiert status "done"', () => {
    const doneTodo = { ...validTodo, status: 'done' as const }
    localStorageMock.setItem('todos', JSON.stringify([doneTodo]))
    expect(loadTodosFromStorage()).toEqual([doneTodo])
  })
})
