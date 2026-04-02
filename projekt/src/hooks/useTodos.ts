import { useState, useEffect, useCallback } from 'react'
import type { Todo } from '../types'

const STORAGE_KEY = 'todos'

export function loadTodosFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
    const valid = parsed.filter((item): item is Todo => {
      return (
        typeof (item as Todo)?.id === 'string' &&
        typeof (item as Todo)?.title === 'string' &&
        typeof (item as Todo)?.createdAt === 'string' &&
        !isNaN(Date.parse((item as Todo).createdAt)) &&
        ((item as Todo).status === 'open' || (item as Todo).status === 'done')
      )
    })
    if (valid.length < parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid))
    }
    return valid
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodosFromStorage())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {
      // localStorage nicht verfügbar – in-memory weiter
    }
  }, [todos])

  const addTodo = useCallback((todo: Todo) => {
    setTodos((prev) => [todo, ...prev])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'open' ? 'done' : 'open' } : t))
    )
  }, [])

  const updateTodo = useCallback((id: string, newTitle: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const sortedTodos = [...todos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return { todos: sortedTodos, addTodo, toggleTodo, updateTodo, deleteTodo }
}
