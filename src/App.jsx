import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BrandSettings from "./pages/BrandSettings";
import CreateContent from "./pages/CreateContent"; // <--- Import this

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

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
        <Route path="/" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <Navigate to="/" />} />
        <Route path="/brand" element={session ? <BrandSettings session={session} /> : <Navigate to="/" />} />
        
        {/* NEW ROUTE - This is required for the button to work */}
        <Route path="/create" element={session ? <CreateContent session={session} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}