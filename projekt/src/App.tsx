import { useState } from 'react'
import { TodoInputArea } from './components/TodoInputArea'
import type { Todo } from './types'
import './App.css'

// Minimal list rendering – vollständige Persistenz und TodoList-Komponente kommen in FEAT-2
function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  function handleAdd(todo: Todo) {
    const updated = [todo, ...todos]
    setTodos(updated)
    localStorage.setItem('todos', JSON.stringify(updated))
  }

  return (
    <div id="app">
      <TodoInputArea onAdd={handleAdd} />
      <main>
        {todos.length === 0 ? (
          <div className="empty-state" aria-label="Leere Todo-Liste">
            <p className="empty-state__icon" aria-hidden="true">📋</p>
            <h1 className="empty-state__title">Noch keine Todos</h1>
            <p className="empty-state__hint">Einfach oben tippen und Enter drücken.</p>
          </div>
        ) : (
          <ul className="todo-list" aria-label="Todo-Liste">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                {todo.title}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default App
