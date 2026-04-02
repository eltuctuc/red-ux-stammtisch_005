import type { Todo } from '../types'
import { StatusToggle } from './StatusToggle'
import './TodoItem.css'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  const isDone = todo.status === 'done'

  return (
    <li className={`todo-item${isDone ? ' todo-item--done' : ''}`}>
      <StatusToggle
        todoId={todo.id}
        todoTitle={todo.title}
        checked={isDone}
        onToggle={onToggle}
      />

      <span className="todo-item__title">{todo.title}</span>

      {/* Trailing-Aktionen-Platzhalter – FEAT-4/5 */}
      <div className="todo-item__actions-placeholder" aria-hidden="true" />
    </li>
  )
}
