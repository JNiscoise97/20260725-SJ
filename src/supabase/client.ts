import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/types/supabase"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const USE_SUPABASE = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = USE_SUPABASE
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null
