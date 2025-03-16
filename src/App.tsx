import { useState } from 'react'
import './app.css'
import { ExampleForm } from './components/ExampleForm'
import { LessonForm } from './components/LessonForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6">
      <LessonForm />
    </div>
  )
}

export default App
