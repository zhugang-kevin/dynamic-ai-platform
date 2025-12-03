import React from 'react';

export default function EnvCheck() {
  return (
    <div className="env-check">
      <h2>Environment Variable Check</h2>
      <ul>
        <li>SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL}</li>
        <li>SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY}</li>
        <li>PAYPAL_CLIENT_ID: {import.meta.env.VITE_PAYPAL_CLIENT_ID}</li>
        <li>STRIPE_PUBLIC_KEY: {import.meta.env.VITE_STRIPE_PUBLIC_KEY}</li>
      </ul>
    </div>
  );
}
