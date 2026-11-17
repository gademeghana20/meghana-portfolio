import { createClient } from "@supabase/supabase-js";

/**
 * Read-only client for public pages. Uses the publishable (anon) key and no
 * cookies, so it only ever sees what Row Level Security allows visitors to see
 * (published rows). Safe to use inside cached functions.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. See .env.example.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
