import { createClient } from "@supabase/supabase-js";

// Server-side client with service role key — bypasses RLS
// Used by NextAuth and API routes where auth is handled at the app level
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
