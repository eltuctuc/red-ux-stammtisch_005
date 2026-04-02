import type { Todo } from '../types'
import './TodoItem.css'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const isDone = todo.status === 'done'

  return (
    <li className={`todo-item${isDone ? ' todo-item--done' : ''}`}>
      {/* Status-Toggle-Platzhalter – FEAT-3 */}
      <div className="todo-item__toggle-placeholder" aria-hidden="true" />

      <span className="todo-item__title">
        {todo.title}
        {isDone && <span className="sr-only"> (erledigt)</span>}
      </span>

      {/* Trailing-Aktionen-Platzhalter – FEAT-4/5 */}
      <div className="todo-item__actions-placeholder" aria-hidden="true" />
    </li>
  )
}
