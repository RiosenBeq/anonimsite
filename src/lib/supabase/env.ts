// These are the production project's public anon credentials. The publishable
// key is intentionally browser-exposable (RLS gates every table); env vars
// still win when set, so local/preview can point at a different project.
const DEFAULT_SUPABASE_URL = "https://crbxcvmwmutrjydjdtla.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_2Qj3L8BktvnFfPrlPlLEJQ_SXyODNNP";

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  return true;
}
