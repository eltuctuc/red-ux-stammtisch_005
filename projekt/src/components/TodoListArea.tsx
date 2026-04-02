import { useEffect, useReducer, useRef, useCallback, useState } from 'react'
import type { Todo } from '../types'
import { TodoItem } from './TodoItem'
import { EmptyState } from './EmptyState'
import './TodoListArea.css'

// ── Editing State Machine ────────────────────────────────────────────────────

export type EditState = { editingId: string | null; originalValue: string }

export type EditAction =
  | { type: 'EDIT_START'; id: string; title: string }
  | { type: 'EDIT_SAVE' }
  | { type: 'EDIT_CANCEL' }

export function editReducer(state: EditState, action: EditAction): EditState {
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

// ── Delete Confirm State Machine ─────────────────────────────────────────────

export type DeleteState = { confirmingId: string | null }

export type DeleteAction =
  | { type: 'DELETE_TRIGGER'; id: string }
  | { type: 'DELETE_CONFIRM' }
  | { type: 'DELETE_CANCEL' }

export function deleteReducer(state: DeleteState, action: DeleteAction): DeleteState {
  switch (action.type) {
    case 'DELETE_TRIGGER':
      return { confirmingId: action.id }
    case 'DELETE_CONFIRM':
      if (state.confirmingId === null) return state // no-op: Doppel-Klick-Schutz
      return { confirmingId: null }
    case 'DELETE_CANCEL':
      if (state.confirmingId === null) return state // no-op
      return { confirmingId: null }
    default:
      return state
  }
}

// ── Component ────────────────────────────────────────────────────────────────

interface TodoListAreaProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onUpdate: (id: string, newTitle: string) => void
  onDelete: (id: string) => void
}

export function TodoListArea({ todos, onToggle, onUpdate, onDelete }: TodoListAreaProps) {
  // aria-live wird erst nach initialem Render gesetzt,
  // damit SR nicht alle Todos beim ersten Laden vorliest
  const [isInitialized, setIsInitialized] = useState(false)
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  // ── Edit State ─────────────────────────────────────────────────────────────
  const [editState, dispatch] = useReducer(editReducer, { editingId: null, originalValue: '' })
  const [srStatus, setSrStatus] = useState('')

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
    setSrStatus(`${newTitle} gespeichert`)
  }, [onUpdate])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'EDIT_CANCEL' })
    setSrStatus('Bearbeitung abgebrochen')
  }, [])

  // ── Delete State ───────────────────────────────────────────────────────────
  const [deleteState, deleteDispatch] = useReducer(deleteReducer, { confirmingId: null })
  const deleteStateRef = useRef(deleteState)
  deleteStateRef.current = deleteState

  // Refs auf <li>-Elemente für Fokus nach Löschen
  const todoItemLiRefs = useRef<Map<string, HTMLLIElement | null>>(new Map())
  const focusTargetAfterDeleteRef = useRef<string | null>(null)
  const prevTodosLengthRef = useRef(todos.length)

  // Fokus setzen nachdem ein Todo gelöscht wurde (nach Re-Render mit neuer todos-Liste)
  useEffect(() => {
    if (
      focusTargetAfterDeleteRef.current !== null &&
      todos.length < prevTodosLengthRef.current
    ) {
      const target = focusTargetAfterDeleteRef.current
      if (target === '__input__') {
        document.getElementById('todo-input')?.focus()
      } else {
        todoItemLiRefs.current.get(target)?.focus()
      }
      focusTargetAfterDeleteRef.current = null
    }
    prevTodosLengthRef.current = todos.length
  }, [todos])

  const handleDeleteTrigger = useCallback((id: string) => {
    deleteDispatch({ type: 'DELETE_TRIGGER', id })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    const { confirmingId } = deleteStateRef.current
    if (!confirmingId) return

    // Fokusziel VOR dem Löschen bestimmen
    const currentIndex = todos.findIndex((t) => t.id === confirmingId)
    if (todos.length === 1) {
      focusTargetAfterDeleteRef.current = '__input__'
    } else {
      const nextTodo = todos[currentIndex + 1] ?? todos[currentIndex - 1]
      focusTargetAfterDeleteRef.current = nextTodo?.id ?? '__input__'
    }

    onDelete(confirmingId)
    deleteDispatch({ type: 'DELETE_CONFIRM' })
  }, [todos, onDelete])

  const handleDeleteCancel = useCallback(() => {
    deleteDispatch({ type: 'DELETE_CANCEL' })
  }, [])

  if (todos.length === 0) {
    return <EmptyState />
  }

  const isEditingAny = editState.editingId !== null

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{srStatus}</div>
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
            isConfirming={deleteState.confirmingId === todo.id}
            onDeleteTrigger={() => handleDeleteTrigger(todo.id)}
            onDeleteConfirm={handleDeleteConfirm}
            onDeleteCancel={handleDeleteCancel}
            isEditingAny={isEditingAny}
            setLiRef={(el) => {
              if (el) todoItemLiRefs.current.set(todo.id, el)
              else todoItemLiRefs.current.delete(todo.id)
            }}
          />
        ))}
      </ul>
    </>
  )
}
