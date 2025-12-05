import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { generateContent } from "../ai";
import { useNavigate } from "react-router-dom";

export default function CreateContent({ session }) {
  const [topic, setTopic] = useState("");
  const [protocol, setProtocol] = useState("social-post"); 
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [credits, setCredits] = useState(0);
  const navigate = useNavigate();

  // 1. Load Credits on Mount
  useEffect(() => {
    async function loadCredits() {
      const { user } = session;
      const { data } = await supabase
        .from('profiles')
        .select('credits_total, credits_used')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setCredits(data.credits_total - data.credits_used);
      }
    }
    loadCredits();
  }, [session]);

  // 2. Handle Generation
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedText("");

    try {
      const { user } = session;
      // Call our secure backend function
      const result = await generateContent(user.id, protocol, topic);
      
      setGeneratedText(result);
      setCredits(prev => prev - 1); // Optimistically deduct credit in UI

    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <button onClick={() => navigate("/dashboard")} style={{ marginBottom: "20px", background: "none", border: "none", color: "#666", cursor: "pointer" }}>← Back to Dashboard</button>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>✨ Create Content</h1>
        <span style={{ background: "#eef", padding: "5px 10px", borderRadius: "5px", color: "#333", fontWeight: "bold" }}>
          Credits Available: {credits}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginTop: "30px" }}>
        
        {/* Input Form */}
        <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Type</label>
            <select 
              value={protocol} 
              onChange={(e) => setProtocol(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            >
              <option value="social-post">📱 Social Media Post</option>
              <option value="blog-outline">📝 Blog Outline</option>
              <option value="cold-email">📧 Cold Email</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Topic</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., New AI features for small business"
              rows="6"
              required
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>

          <button 
            disabled={loading || credits <= 0}
            style={{ padding: "12px", background: loading ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >
            {loading ? "Writing..." : "Generate (Costs 1 Credit)"}
          </button>
        </form>

        {/* Output Area */}
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", border: "1px solid #eee", minHeight: "300px", whiteSpace: "pre-wrap" }}>
          {loading ? "AI is thinking..." : (generatedText || <span style={{color: "#999"}}>Result will appear here.</span>)}
        </div>

      </div>
    </div>
  );
}