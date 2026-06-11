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
      "NEXT_PUBLIC_SUPABASE_ANON_KEY (locally in .env.local, on Vercel in Project " +
      "Settings -> Environment Variables). See SUPABASE_SETUP.md.",
  )
}

// Fall back to harmless placeholders when env vars are absent (e.g. a build
// running before the keys are configured) so createClient never throws and the
// build can't fail on it. Auth simply won't work until real keys are provided.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
