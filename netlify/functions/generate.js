import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  // 1. Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 2. Setup Keys (Read directly from Netlify Environment)
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE; // MUST be the Service Role key
    const geminiKey = process.env.GEMINI_API_KEY; // You need to add this to .env

    if (!supabaseKey || !geminiKey) {
      throw new Error("Missing Server-Side Keys");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const genAI = new GoogleGenerativeAI(geminiKey);

    // 3. Parse User Input
    const { userId, protocol, inputData } = JSON.parse(event.body);

    // 4. Check Credits in Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
      throw new Error("User profile not found");
    }

    if (profile.credits_used >= profile.credits_total) {
      return { 
        statusCode: 403, 
        body: JSON.stringify({ error: "Limit Reached. Upgrade Plan." }) 
      };
    }

    // 5. Construct Prompt
    let prompt = "";
    if (protocol === "social-post") {
      prompt = `You are a social media expert. Voice: ${profile.brand_voice || "Neutral"}. 
      Task: Write a ${inputData.platform || "LinkedIn"} post about: ${inputData.topic}. 
      Make it engaging and use emojis.`;
    } else {
      // Default / Generic
      prompt = `Act as a copywriter. Voice: ${profile.brand_voice || "Neutral"}.
      Task: Write content for ${protocol} about: ${inputData.topic}.`;
    }

    // 6. Call Google Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 7. Deduct Credit & Save to Database
    // We update the profile and insert the asset in parallel
    await Promise.all([
      supabase.from('profiles').update({ credits_used: profile.credits_used + 1 }).eq('id', userId),
      supabase.from('assets').insert({ 
        user_id: userId, 
        protocol: protocol, 
        content: responseText 
      })
    ]);

    return { 
      statusCode: 200, 
      body: JSON.stringify({ content: responseText }) 
    };

  } catch (error) {
    console.error("Function Error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message || "Internal Server Error" }) 
    };
  }
};