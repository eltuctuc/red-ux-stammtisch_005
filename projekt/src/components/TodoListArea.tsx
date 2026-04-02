import { useEffect, useState } from 'react'
import type { Todo } from '../types'
import { TodoItem } from './TodoItem'
import { EmptyState } from './EmptyState'
import './TodoListArea.css'

interface TodoListAreaProps {
  todos: Todo[]
  onToggle: (id: string) => void
}

export function TodoListArea({ todos, onToggle }: TodoListAreaProps) {
  // aria-live wird erst nach initialem Render gesetzt,
  // damit SR nicht alle Todos beim ersten Laden vorliest
  const [isInitialized, setIsInitialized] = useState(false)
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  if (todos.length === 0) {
    return <EmptyState />
  }

  return (
    <ul
      className="todo-list"
      aria-label="Todo-Liste"
      aria-live={isInitialized ? 'polite' : undefined}
    >
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
      ))}
    </ul>
  )
}
