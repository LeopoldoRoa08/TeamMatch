import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// During SSR, env vars may be undefined — we use a placeholder URL so the module
// can be imported without throwing. All Supabase calls are client-only (useEffect),
// so they will never actually fire on the server.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key',
);
