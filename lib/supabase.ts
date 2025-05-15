import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      tickets: {
        Row: {
          id: number
          title: string
          created_at: string
          status: "pending" | "in-progress" | "completed"
          type: string
          message?: string
          skin?: string
          steam_id?: string
          steam_name?: string
        }
        Insert: {
          title: string
          status: "pending" | "in-progress" | "completed"
          type: string
          message?: string
          skin?: string
          steam_id?: string
          steam_name?: string
        }
        Update: {
          title?: string
          status?: "pending" | "in-progress" | "completed"
          type?: string
          message?: string
          skin?: string
          steam_id?: string
          steam_name?: string
        }
      }
      messages: {
        Row: {
          id: number
          ticket_id: number
          sender: "user" | "trader"
          content: string
          created_at: string
        }
        Insert: {
          ticket_id: number
          sender: "user" | "trader"
          content: string
        }
        Update: {
          ticket_id?: number
          sender?: "user" | "trader"
          content?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
