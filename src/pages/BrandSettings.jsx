import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function BrandSettings({ session }) {
  const [brandName, setBrandName] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 1. Load existing data when page opens
  useEffect(() => {
    async function loadBrand() {
      const { user } = session;
      const { data } = await supabase
        .from('profiles')
        .select('brand_name, brand_voice')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setBrandName(data.brand_name || "");
        setBrandVoice(data.brand_voice || "");
      }
    }
    loadBrand();
  }, [session]);

  // 2. Save updates to Supabase
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { user } = session;
    const { error } = await supabase
      .from('profiles')
      .update({ 
        brand_name: brandName, 
        brand_voice: brandVoice 
      })
      .eq('id', user.id);

    if (error) {
      setMessage("❌ Error saving: " + error.message);
    } else {
      setMessage("✅ Brand Settings Saved!");
      setTimeout(() => navigate("/dashboard"), 1500); // Go back to dashboard after save
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <button onClick={() => navigate("/dashboard")} style={{ marginBottom: "20px", background: "none", border: "none", color: "#666", cursor: "pointer" }}>← Back to Dashboard</button>
      
      <h1>⚙️ Brand Configuration</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>Teach the AI how to sound like you.</p>

      <form onSubmit={handleSave} style={{ display: "grid", gap: "20px" }}>
        
        {/* Brand Name Input */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Brand Name</label>
          <input 
            type="text" 
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g., Dynamic AI, Kevin's Bakery"
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        {/* Brand Voice Input */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Brand Voice / Tone</label>
          <textarea 
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            placeholder="e.g., Professional, Witty, Friendly, authoritative but kind..."
            rows="5"
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        <button 
          disabled={loading}
          style={{ padding: "12px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>
      </form>

      {message && <p style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}>{message}</p>}
    </div>
  );
}