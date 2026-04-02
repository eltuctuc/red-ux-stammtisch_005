import { useRef, useState } from 'react'
import type { Todo } from '../types'
import { createTodo } from '../utils/createTodo'
import './TodoInputArea.css'

interface TodoInputAreaProps {
  onAdd: (todo: Todo) => void
}

export function TodoInputArea({ onAdd }: TodoInputAreaProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function submit() {
    const todo = createTodo(value)
    if (!todo) {
      setValue('')
      return
    }
    onAdd(todo)
    setValue('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      submit()
    }
  }

  return (
    <div className="todo-input-area">
      <label className="sr-only" htmlFor="todo-input">
        Neues Todo
      </label>
      <input
        ref={inputRef}
        id="todo-input"
        className="todo-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Todo eingeben…"
        maxLength={200}
        autoFocus
        name="todo-title"
        autoComplete="off"
      />
      <button
        className="todo-add-btn"
        onClick={submit}
        aria-label="Todo hinzufügen"
        type="button"
      >
        +
      </button>
    </div>
  )
}
