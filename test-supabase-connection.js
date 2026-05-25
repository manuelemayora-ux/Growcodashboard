const fs = require('fs');
const path = require('path');

// Manually parse env vars from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables in .env.local!");
  process.exit(1);
}

async function test() {
  console.log("Connecting to:", supabaseUrl);
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/products?select=*&limit=5`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`HTTP error! Status: ${response.status}. Message: ${text}`);
    } else {
      const data = await response.json();
      console.log("Success! Products from Supabase:", data);
    }
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

test();
