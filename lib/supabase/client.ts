import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = "https://yeawlwdlclprekzwqnjo.supabase.co/"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYXdsd2RsY2xwcmVrendxbmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjg0MTYsImV4cCI6MjA2Mjg0NDQxNn0.FchOh703Og7TM-llako0UAIcMy7SBgPexYcWBtXTX0w.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYXdsd2RsY2xwcmVrendxbmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjg0MTYsImV4cCI6MjA2Mjg0NDQxNn0.FchOh703Og7TM-llako0UAIcMy7SBgPexYcWBtXTX0w.NEXT_PUBLIC_SUPABASE_ANON_KEY"

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey)
  return supabaseClient
}
