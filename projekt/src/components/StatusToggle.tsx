import type { KeyboardEvent } from 'react'
import './StatusToggle.css'

interface StatusToggleProps {
  todoId: string
  todoTitle: string
  checked: boolean
  disabled?: boolean
  onToggle: (id: string) => void
}

export function StatusToggle({ todoId, todoTitle, checked, disabled = false, onToggle }: StatusToggleProps) {
  const inputId = `todo-${todoId}-toggle`

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      onToggle(todoId)
    }
  }

  return (
    <label className="status-toggle" htmlFor={inputId}>
      <span className="sr-only">{todoTitle} als erledigt markieren</span>
      <input
        type="checkbox"
        id={inputId}
        className="status-toggle__input"
        checked={checked}
        disabled={disabled}
        onChange={() => onToggle(todoId)}
        onKeyDown={handleKeyDown}
      />
    </label>
  )
}
