import axios from "axios";

// This function calls YOUR backend, not Google directly.
export async function generateContent(userId, protocol, topic) {
  try {
    // We send a POST request to our local (or live) serverless function
    const response = await axios.post("/.netlify/functions/generate", {
      userId: userId,
      protocol: protocol,
      inputData: { topic: topic }
    });

    return response.data.content;

  } catch (error) {
    console.error("AI Service Error:", error);
    
    // Handle "Limit Reached" specifically
    if (error.response && error.response.status === 403) {
      throw new Error("❌ Limit Reached! You have used all your credits.");
    }
    
    // Handle generic errors
    throw new Error("Failed to generate content. Ensure 'npm start' is running or deploy to Netlify.");
  }
}