import { createClient } from "@supabase/supabase-js";
export const supabase=createClient(
  process.env.SUPABASE_URl,
  process.env.SUPABASE_SECRET_KEY
)
