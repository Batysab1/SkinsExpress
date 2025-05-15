import { createClient } from "@supabase/supabase-js"

// Crear un cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          steam_id: string
          username: string
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          last_login: string
        }
        Insert: {
          id?: string
          steam_id: string
          username: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          last_login?: string
        }
        Update: {
          id?: string
          steam_id?: string
          username?: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          last_login?: string
        }
      }
      tickets: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          status: string
          message: string
          skin: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          status?: string
          message: string
          skin?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          status?: string
          message?: string
          skin?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ticket_messages: {
        Row: {
          id: string
          ticket_id: string
          user_id: string
          message: string
          created_at: string
          is_from_admin: boolean
        }
        Insert: {
          id?: string
          ticket_id: string
          user_id: string
          message: string
          created_at?: string
          is_from_admin?: boolean
        }
        Update: {
          id?: string
          ticket_id?: string
          user_id?: string
          message?: string
          created_at?: string
          is_from_admin?: boolean
        }
      }
    }
  }
}

export type Ticket = Database["public"]["Tables"]["tickets"]["Row"]
export type Message = Database["public"]["Tables"]["ticket_messages"]["Row"]
