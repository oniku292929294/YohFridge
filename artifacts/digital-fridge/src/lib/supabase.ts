import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set as build-time
// environment variables (e.g. in Cloudflare Pages → Settings → Environment variables).
// They are baked into the static bundle by Vite at build time — adding them
// after a failed deployment requires a fresh build, not a retry.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let _client: SupabaseClient | null = null;

if (supabaseConfigured) {
  try {
    _client = createClient(supabaseUrl!, supabaseAnonKey!);
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

export const supabase = _client;
