import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // ✅ Log environment variables once when the component renders
  console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
  console.log('SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY)
  console.log('PAYPAL_CLIENT_ID:', import.meta.env.VITE_PAYPAL_CLIENT_ID)
  console.log('STRIPE_PUBLIC_KEY:', import.meta.env.VITE_STRIPE_PUBLIC_KEY)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          I am testing {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* ✅ Add a section to visually confirm env variables */}
      <div className="env-check">
        <h2>Environment Variable Check</h2>
        <ul>
          <li>SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL}</li>
          <li>SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY}</li>
          <li>PAYPAL_CLIENT_ID: {import.meta.env.VITE_PAYPAL_CLIENT_ID}</li>
          <li>STRIPE_PUBLIC_KEY: {import.meta.env.VITE_STRIPE_PUBLIC_KEY}</li>
        </ul>
      </div>
    </>
  )
}

export default App
