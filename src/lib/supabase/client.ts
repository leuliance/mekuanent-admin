import { createBrowserClient } from '@supabase/ssr'
import type { Database } from "@/types/database.types";

export const supabase = createBrowserClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
export function createClient() {
  return supabase
}

// Helper to get typed Supabase client
export type TypedSupabaseClient = typeof supabase;
