import { TodoInputArea } from './components/TodoInputArea'
import { TodoListArea } from './components/TodoListArea'
import { useTodos } from './hooks/useTodos'
import './App.css'

function App() {
  const { todos, addTodo } = useTodos()

  return (
    <div id="app">
      <TodoInputArea onAdd={addTodo} />
      <main>
        <TodoListArea todos={todos} />
      </main>
    </div>
  )
}

export default App
