import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTodo } from './createTodo'

describe('createTodo', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid-123' })
    vi.setSystemTime(new Date('2026-04-02T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('erstellt ein Todo mit korrekten Feldern', () => {
    const todo = createTodo('Einkaufen gehen')
    expect(todo).toEqual({
      id: 'test-uuid-123',
      title: 'Einkaufen gehen',
      createdAt: '2026-04-02T10:00:00.000Z',
      status: 'open',
    })
  })

  it('trimmt führende und nachfolgende Leerzeichen', () => {
    const todo = createTodo('  Spazieren gehen  ')
    expect(todo?.title).toBe('Spazieren gehen')
  })

  it('gibt null zurück bei leerer Eingabe', () => {
    expect(createTodo('')).toBeNull()
  })

  it('gibt null zurück bei nur Leerzeichen', () => {
    expect(createTodo('   ')).toBeNull()
    expect(createTodo('\t\n')).toBeNull()
  })

  it('erlaubt doppelte Titel', () => {
    const a = createTodo('Gleicher Titel')
    const b = createTodo('Gleicher Titel')
    expect(a?.title).toBe(b?.title)
  })
})
