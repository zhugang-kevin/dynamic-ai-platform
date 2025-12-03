const { createClient } = require("@supabase/supabase-js");

exports.handler = async () => {
  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    // Attempt to read from the profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(5);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
