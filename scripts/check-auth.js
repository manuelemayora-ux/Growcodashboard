const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const ws = require('ws');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

async function check() {
  const email = process.argv[2];
  const password = process.argv[3];
  
  console.log("Signing in with:", email);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("SignIn failed:", error.message);
    return;
  }
  
  console.log("Successfully signed in!");
  console.log("User details:", {
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
    confirmed_at: data.user.confirmed_at,
    last_sign_in_at: data.user.last_sign_in_at
  });
  
  console.log("Checking RLS roles via RPC or direct select...");
  const { data: users, error: selectErr } = await supabase.from('users').select('*').limit(1);
  if (selectErr) {
    console.error("Select from 'users' failed:", selectErr.message);
  } else {
    console.log("Select from 'users' succeeded:", users);
  }

  console.log("Testing tenant insertion...");
  const { data: newTenant, error: tErr } = await supabase
    .from('tenants')
    .insert({ name: 'Test Tenant', slug: 'test-tenant-' + Date.now() })
    .select();

  if (tErr) {
    console.error("Tenant insertion failed:", tErr);
  } else {
    console.log("Tenant insertion succeeded:", newTenant);
  }

  console.log("\nFetching active policies via RPC...");
  const { data: policies, error: rpcErr } = await supabase.rpc('get_policies');
  if (rpcErr) {
    console.error("RPC get_policies failed:", rpcErr.message);
  } else {
    console.log("Active policies on tenants/users:");
    console.table(policies);
  }
}

check();
