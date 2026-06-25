import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/types/supabase"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const USE_SUPABASE = Boolean(supabaseUrl && supabasePublishableKey)

export const supabase = USE_SUPABASE
  ? createClient<Database>(supabaseUrl!, supabasePublishableKey!)
  : null
