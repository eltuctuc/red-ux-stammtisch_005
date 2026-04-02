import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import './TodoEditInput.css'

interface TodoEditInputProps {
  initialValue: string
  onSave: (newTitle: string) => void
  onCancel: () => void
}

export function TodoEditInput({ initialValue, onSave, onCancel }: TodoEditInputProps) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = value.trim()
      if (trimmed) {
        onSave(trimmed)
      } else {
        onCancel()
      }
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  function handleBlur() {
    const trimmed = value.trim()
    if (trimmed) {
      onSave(trimmed)
    } else {
      onCancel()
    }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      className="todo-edit-input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      maxLength={200}
      aria-label="Todo-Titel bearbeiten"
    />
  )
}
