
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="text-4xl font-bold text-purple-700 mb-8">¡Tailwind + React funcionando!</h1>
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <button
          className="px-6 py-2 mb-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          onClick={() => setCount((count) => count + 1)}
        >
          Contador: {count}
        </button>
        <p className="text-gray-600">Edita <code>src/App.jsx</code> para probar Tailwind.</p>
      </div>
    </div>
  )
}

export default App
