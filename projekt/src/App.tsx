import { TodoInputArea } from './components/TodoInputArea'
import { TodoListArea } from './components/TodoListArea'
import { useTodos } from './hooks/useTodos'
import './App.css'

function App() {
  const { todos, addTodo, toggleTodo } = useTodos()

  return (
    <div id="app">
      <TodoInputArea onAdd={addTodo} />
      <main>
        <TodoListArea todos={todos} onToggle={toggleTodo} />
      </main>
    </div>
  )
}

export default App
