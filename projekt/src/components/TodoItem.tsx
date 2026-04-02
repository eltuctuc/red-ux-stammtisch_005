import { useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import type { Todo } from '../types'
import { StatusToggle } from './StatusToggle'
import { TodoEditInput } from './TodoEditInput'
import { DeleteConfirmInline } from './DeleteConfirmInline'
import './TodoItem.css'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  isEditing: boolean
  onDoubleClick: () => void
  onSave: (newTitle: string) => void
  onCancel: () => void
  isConfirming: boolean
  onDeleteTrigger: () => void
  onDeleteConfirm: () => void
  onDeleteCancel: () => void
  isEditingAny: boolean
  setLiRef?: (el: HTMLLIElement | null) => void
}

export function TodoItem({
  todo,
  onToggle,
  isEditing,
  onDoubleClick,
  onSave,
  onCancel,
  isConfirming,
  onDeleteTrigger,
  onDeleteConfirm,
  onDeleteCancel,
  isEditingAny,
  setLiRef,
}: TodoItemProps) {
  const isDone = todo.status === 'done'
  const liRef = useRef<HTMLLIElement>(null)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const prevIsEditingRef = useRef(isEditing)
  const prevIsConfirmingRef = useRef(isConfirming)

  // Fokus zurück auf <li> wenn Edit-Modus beendet wird
  useEffect(() => {
    if (prevIsEditingRef.current && !isEditing) {
      liRef.current?.focus()
    }
    prevIsEditingRef.current = isEditing
  }, [isEditing])

  // Fokus zurück auf ×-Button wenn Bestätigung abgebrochen wird (Cancel)
  // Nach Confirm unmountet die Komponente – dieser Effekt feuert dann nicht mehr
  useEffect(() => {
    if (prevIsConfirmingRef.current && !isConfirming) {
      deleteButtonRef.current?.focus()
    }
    prevIsConfirmingRef.current = isConfirming
  }, [isConfirming])

  const combinedLiRef = (el: HTMLLIElement | null) => {
    liRef.current = el
    setLiRef?.(el)
  }

  if (isConfirming) {
    return (
      <li
        ref={combinedLiRef}
        className="todo-item todo-item--confirming"
        tabIndex={-1}
      >
        {/* Platzhalter: hält Layout-Geometrie konsistent mit normalem Todo-Item */}
        <span style={{ visibility: 'hidden', flexShrink: 0 }} aria-hidden="true">
          <StatusToggle
            todoId={todo.id}
            todoTitle={todo.title}
            checked={isDone}
            disabled
            onToggle={() => {}}
          />
        </span>
        <DeleteConfirmInline
          todoTitle={todo.title}
          onConfirm={onDeleteConfirm}
          onCancel={onDeleteCancel}
        />
      </li>
    )
  }

  return (
    <li
      ref={combinedLiRef}
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

      <button
        ref={deleteButtonRef}
        className="todo-item__delete-btn"
        onClick={onDeleteTrigger}
        aria-label="Todo löschen"
        disabled={isEditingAny}
        aria-disabled={isEditingAny || undefined}
        type="button"
      >
        ×
      </button>
    </li>
  )
}
