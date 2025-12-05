import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// Initialize Client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [phase1Status, setPhase1Status] = useState("Infrastructure: Checking...");
  const [phase2Status, setPhase2Status] = useState("Database: Checking...");

  useEffect(() => {
    async function runDiagnostics() {
      // TEST 1: Infrastructure (Can we reach Supabase?)
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        setPhase1Status("❌ Phase 1 Failed: Infrastructure unreachable");
      } else {
        setPhase1Status("✅ Phase 1 Complete: Infrastructure Operational");
      }

      // TEST 2: Database (Can we read the 'profiles' table created in Phase 2?)
      // We expect an empty list [], NOT an error 404.
      const { data, error } = await supabase.from("profiles").select("*").limit(1);
      
      if (error) {
        console.error("DB Error:", error);
        setPhase2Status(`❌ Phase 2 Failed: Table 'profiles' not found or blocked.`);
      } else {
        console.log("Profiles Data:", data);
        setPhase2Status("✅ Phase 2 Complete: 'profiles' table is active.");
      }
    }
    runDiagnostics();
  }, []);

  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        
        <h1>🚀 Project Status Certification</h1>
        
        <div style={{ display: "grid", gap: "20px", marginTop: "40px" }}>
          {/* Phase 1 Card */}
          <div style={{ 
            padding: "20px", 
            border: "2px solid", 
            borderColor: phase1Status.includes("✅") ? "green" : "red",
            borderRadius: "10px",
            backgroundColor: phase1Status.includes("✅") ? "#e8f5e9" : "#ffebee"
          }}>
            <h3>Phase 1: Foundation</h3>
            <p style={{fontSize: "18px", fontWeight: "bold"}}>{phase1Status}</p>
          </div>

          {/* Phase 2 Card */}
          <div style={{ 
            padding: "20px", 
            border: "2px solid", 
            borderColor: phase2Status.includes("✅") ? "green" : "red",
            borderRadius: "10px",
            backgroundColor: phase2Status.includes("✅") ? "#e8f5e9" : "#ffebee"
          }}>
            <h3>Phase 2: Database</h3>
            <p style={{fontSize: "18px", fontWeight: "bold"}}>{phase2Status}</p>
          </div>
        </div>

        <p style={{marginTop: "40px", color: "#666"}}>
          If both boxes are green, you are ready to start Phase 3 (Login/Auth).
        </p>

      </div>
    </PayPalScriptProvider>
  );
}