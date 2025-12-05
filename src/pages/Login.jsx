import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Attempt to sign in (or sign up dynamically) with a Magic Link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin, // Redirects back to localhost or live site
      },
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("🚀 Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f4f4" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "400px", width: "100%" }}>
        
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Welcome Back</h2>
        <p style={{ color: "#666", marginBottom: "30px" }}>Sign in to access the Dynamic AI Platform</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "20px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "16px" }}
          />
          
          <button 
            disabled={loading}
            style={{ width: "105%", padding: "12px", backgroundColor: loading ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: loading ? "not-allowed" : "pointer", fontSize: "16px", fontWeight: "bold" }}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        {message && <p style={{ marginTop: "20px", color: message.includes("Error") ? "red" : "green", fontWeight: "bold" }}>{message}</p>}

      </div>
    </div>
  );
}