import { TodoInputArea } from './components/TodoInputArea'
import { TodoListArea } from './components/TodoListArea'
import { useTodos } from './hooks/useTodos'
import './App.css'

function App() {
  const { todos, addTodo, toggleTodo, updateTodo } = useTodos()

  return (
    <div id="app">
      <TodoInputArea onAdd={addTodo} />
      <main>
        <TodoListArea todos={todos} onToggle={toggleTodo} onUpdate={updateTodo} />
      </main>
    </div>
  )
}

export default App
