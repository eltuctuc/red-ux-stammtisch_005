import { useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../types'
import { StatusToggle } from './StatusToggle'
import { TodoEditInput } from './TodoEditInput'
import './TodoItem.css'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  isEditing: boolean
  onDoubleClick: () => void
  onSave: (newTitle: string) => void
  onCancel: () => void
}

export function TodoItem({ todo, onToggle, isEditing, onDoubleClick, onSave, onCancel }: TodoItemProps) {
  const isDone = todo.status === 'done'
  const liRef = useRef<HTMLLIElement>(null)
  const prevIsEditingRef = useRef(isEditing)

  // Fokus zurück auf <li> wenn Edit-Modus beendet wird
  useEffect(() => {
    if (prevIsEditingRef.current && !isEditing) {
      liRef.current?.focus()
    }
    prevIsEditingRef.current = isEditing
  }, [isEditing])

  return (
    <li
      ref={liRef}
      className={`todo-item${isDone ? ' todo-item--done' : ''}${isEditing ? ' todo-item--editing' : ''}`}
      aria-label={isEditing ? 'Todo wird bearbeitet' : (isDone ? `${todo.title} (erledigt)` : todo.title)}
      tabIndex={-1}
    >
      <StatusToggle
        todoId={todo.id}
        todoTitle={todo.title}
        checked={isDone}
        disabled={isEditing}
        onToggle={onToggle}
      />

      {isEditing ? (
        <TodoEditInput
          initialValue={todo.title}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <span
          className="todo-item__title"
          onDoubleClick={onDoubleClick}
          onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => {
            if (e.key === 'Enter' || e.key === 'F2') {
              e.preventDefault()
              onDoubleClick()
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`${todo.title} bearbeiten`}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <div className="todo-item__actions-placeholder" aria-hidden="true" />
      )}
    </li>
  )
}
