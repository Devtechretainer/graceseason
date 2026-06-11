import { createClient } from "@supabase/supabase-js"

// These come from your Supabase project settings (see SUPABASE_SETUP.md).
// They live in .env.local and are safe to expose to the browser (the anon key
// is designed to be public; row-level security protects your data).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaced clearly in the dev console / build instead of a cryptic runtime crash.
  console.error(
    "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see SUPABASE_SETUP.md).",
  )
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
