import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
