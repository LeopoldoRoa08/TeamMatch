import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aknwdkjzodhkhzxjvipu.supabase.co';
const supabaseAnonKey = 'sb_publishable_wXXt4M1loO2NvsCC0nmM5A_1NJneITx';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking if sports table exists...");
  const { data, error } = await supabase.from('sports').select('*').limit(1);
  if (error) {
    console.error("sports table select error:", error.message);
  } else {
    console.log("sports table sample row:", data);
  }
}

check();
