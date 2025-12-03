import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import EnvCheck from './components/EnvCheck';

function App() {
  const [count, setCount] = useState(0);

  // ✅ Log environment variables once when the component renders
  console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log('PAYPAL_CLIENT_ID:', import.meta.env.VITE_PAYPAL_CLIENT_ID);
  console.log('STRIPE_PUBLIC_KEY:', import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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
      <h1>Dynamic AI Platform</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          I am once {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* ✅ Use the EnvCheck component */}
      <EnvCheck />
    </>
  );
}

export default App;
