import type { Todo } from '../types'

export function createTodo(rawTitle: string): Todo | null {
  const title = rawTitle.trim()
  if (!title) return null

  return {
    id: crypto.randomUUID(),
    title,
    createdAt: new Date().toISOString(),
    status: 'open',
  }
}
