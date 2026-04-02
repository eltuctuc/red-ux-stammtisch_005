import { useEffect, useReducer, useRef, useCallback, useState } from 'react'
import type { Todo } from '../types'
import { TodoItem } from './TodoItem'
import { EmptyState } from './EmptyState'
import './TodoListArea.css'

// ── Editing State Machine ────────────────────────────────────────────────────

type EditState = { editingId: string | null; originalValue: string }

type EditAction =
  | { type: 'EDIT_START'; id: string; title: string }
  | { type: 'EDIT_SAVE' }
  | { type: 'EDIT_CANCEL' }

function editReducer(state: EditState, action: EditAction): EditState {
  switch (action.type) {
    case 'EDIT_START':
      return { editingId: action.id, originalValue: action.title }
    case 'EDIT_SAVE':
      if (state.editingId === null) return state // no-op: blur-after-enter race condition
      return { editingId: null, originalValue: '' }
    case 'EDIT_CANCEL':
      if (state.editingId === null) return state // no-op
      return { editingId: null, originalValue: '' }
    default:
      return state
  }
}

// ── Component ────────────────────────────────────────────────────────────────

interface TodoListAreaProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onUpdate: (id: string, newTitle: string) => void
}

export function TodoListArea({ todos, onToggle, onUpdate }: TodoListAreaProps) {
  // aria-live wird erst nach initialem Render gesetzt,
  // damit SR nicht alle Todos beim ersten Laden vorliest
  const [isInitialized, setIsInitialized] = useState(false)
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  const [editState, dispatch] = useReducer(editReducer, { editingId: null, originalValue: '' })

  // Ref für race-condition-sichere State-Abfrage in Callbacks
  const editStateRef = useRef(editState)
  editStateRef.current = editState

  const handleDoubleClick = useCallback((id: string, title: string) => {
    dispatch({ type: 'EDIT_START', id, title })
  }, [])

  const handleSave = useCallback((newTitle: string) => {
    const { editingId } = editStateRef.current
    if (editingId === null) return // no-op: blur feuert nach Enter, State bereits idle
    onUpdate(editingId, newTitle)
    dispatch({ type: 'EDIT_SAVE' })
  }, [onUpdate])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'EDIT_CANCEL' })
  }, [])

  if (todos.length === 0) {
    return <EmptyState />
  }

  return (
    <ul
      className="todo-list"
      aria-label="Todo-Liste"
      aria-live={isInitialized ? 'polite' : undefined}
      aria-relevant={isInitialized ? 'additions' : undefined}
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          isEditing={editState.editingId === todo.id}
          onDoubleClick={() => handleDoubleClick(todo.id, todo.title)}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ))}
    </ul>
  )
}
