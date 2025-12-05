import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";

// --- Page Imports ---
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";       // Imports the Real Dashboard (Blue Card)
import BrandSettings from "./pages/BrandSettings"; // Imports Brand Settings

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* 1. Login Page (Default) */}
        <Route 
          path="/" 
          element={!session ? <Login /> : <Navigate to="/dashboard" />} 
        />
        
        {/* 2. Dashboard (Protected) */}
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard session={session} /> : <Navigate to="/" />} 
        />

        {/* 3. Brand Settings (Protected) */}
        <Route 
          path="/brand" 
          element={session ? <BrandSettings session={session} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}