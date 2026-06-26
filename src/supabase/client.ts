import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/types/supabase"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// Vercel (intégration Supabase native) injecte des noms différents du .env
// local : on accepte les deux pour éviter de dépendre d'une variable
// dupliquée à la main qui finit par diverger.
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY

export const USE_SUPABASE = Boolean(supabaseUrl && supabasePublishableKey)

export const supabase = USE_SUPABASE
  ? createClient<Database>(supabaseUrl!, supabasePublishableKey!)
  : null
