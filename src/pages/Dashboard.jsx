import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ session }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }

    getProfile();
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div style={{textAlign: "center", marginTop: "50px"}}>Loading Dashboard...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* Header Section */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
        <h1 style={{ margin: 0, color: "#333" }}>Dynamic AI</h1>
        <button 
          onClick={handleSignOut}
          style={{ padding: "8px 16px", background: "transparent", border: "1px solid #ddd", borderRadius: "5px", cursor: "pointer" }}
        >
          Sign Out
        </button>
      </header>

      {/* Welcome & Credits Card */}
      <div style={{ background: "linear-gradient(135deg, #007bff 0%, #00d2ff 100%)", color: "white", padding: "30px", borderRadius: "15px", marginBottom: "40px", boxShadow: "0 10px 20px rgba(0,123,255,0.2)" }}>
        <h2 style={{ margin: "0 0 10px 0" }}>Hello, {profile?.email?.split('@')[0] || "User"}!</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>Welcome to your creative command center.</p>
        
        <div style={{ marginTop: "20px", display: "flex", gap: "30px" }}>
          <div>
            <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8 }}>Current Plan</span>
            <strong style={{ fontSize: "24px", textTransform: "capitalize" }}>{profile?.plan_tier || "Starter"}</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8 }}>Credits Available</span>
            <strong style={{ fontSize: "24px" }}>{profile?.credits_total - profile?.credits_used} / {profile?.credits_total}</strong>
          </div>
        </div>
      </div>

      {/* Main Actions Grid */}
      <h3 style={{ borderLeft: "4px solid #007bff", paddingLeft: "10px", marginBottom: "20px" }}>Quick Actions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        
        {/* Action 1: Brand Setup */}
        <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "10px", transition: "0.2s", cursor: "pointer" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>⚙️ Brand Settings</h4>
          <p style={{ fontSize: "14px", color: "#666" }}>Configure your brand voice and identity.</p>
          <button 
            onClick={() => navigate("/brand")}
            style={{ marginTop: "10px", width: "100%", padding: "10px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "5px", cursor: "pointer" }}
          >
            Configure
          </button>
        </div>

        {/* Action 2: Generate Content */}
        <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "10px", transition: "0.2s", cursor: "pointer" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>✨ Create Content</h4>
          <p style={{ fontSize: "14px", color: "#666" }}>Generate posts, emails, or blogs using AI.</p>
          <button 
            onClick={() => navigate("/create")}
            style={{ marginTop: "10px", width: "100%", padding: "10px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Start Creating
          </button>
        </div>

      </div>

    </div>
  );
}
