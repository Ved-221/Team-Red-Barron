import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://axzwucvnrjtenvvrxfew.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_NiQbDrVQMUxczmaARuIXjA_t4EFY14P";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

