// Database types for multi-tenant hotel system
// Auto-generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hotels: {
        Row: {
          id: string
          subdomain: string
          name: string
          logo_url: string | null
          status: 'active' | 'inactive' | 'suspended'
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subdomain: string
          name: string
          logo_url?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subdomain?: string
          name?: string
          logo_url?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      hotel_admins: {
        Row: {
          id: string
          hotel_id: string
          email: string
          password_hash: string
          role: 'owner' | 'admin' | 'staff'
          first_name: string | null
          last_name: string | null
          status: 'active' | 'inactive'
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_id: string
          email: string
          password_hash: string
          role?: 'owner' | 'admin' | 'staff'
          first_name?: string | null
          last_name?: string | null
          status?: 'active' | 'inactive'
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_id?: string
          email?: string
          password_hash?: string
          role?: 'owner' | 'admin' | 'staff'
          first_name?: string | null
          last_name?: string | null
          status?: 'active' | 'inactive'
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          hotel_id: string | null
          first_name: string
          last_name: string
          room_number: string
          phone: string
          email: string | null
          date_of_birth: string | null
          nationality: string | null
          iqama: string | null
          passport: string | null
          national_id: string | null
          preferences: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_id?: string | null
          first_name: string
          last_name: string
          room_number: string
          phone: string
          email?: string | null
          date_of_birth?: string | null
          nationality?: string | null
          iqama?: string | null
          passport?: string | null
          national_id?: string | null
          preferences?: Json
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_id?: string | null
          first_name?: string
          last_name?: string
          room_number?: string
          phone?: string
          email?: string | null
          date_of_birth?: string | null
          nationality?: string | null
          iqama?: string | null
          passport?: string | null
          national_id?: string | null
          preferences?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      guest_tokens: {
        Row: {
          id: string
          token: string
          guest_id: string
          hotel_id: string
          check_in_date: string
          check_out_date: string
          expires_at: string
          status: 'active' | 'used' | 'expired' | 'revoked'
          created_at: string
          used_at: string | null
        }
        Insert: {
          id?: string
          token: string
          guest_id: string
          hotel_id: string
          check_in_date: string
          check_out_date: string
          expires_at: string
          status?: 'active' | 'used' | 'expired' | 'revoked'
          created_at?: string
          used_at?: string | null
        }
        Update: {
          id?: string
          token?: string
          guest_id?: string
          hotel_id?: string
          check_in_date?: string
          check_out_date?: string
          expires_at?: string
          status?: 'active' | 'used' | 'expired' | 'revoked'
          created_at?: string
          used_at?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          guest_id: string
          hotel_id: string
          token_id: string | null
          room_number: string
          room_type: string | null
          check_in_date: string
          check_out_date: string
          number_of_guests: number
          booking_source: string | null
          booking_reference: string | null
          base_amount: number
          enhancements_amount: number
          total_amount: number
          status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          hotel_id: string
          token_id?: string | null
          room_number: string
          room_type?: string | null
          check_in_date: string
          check_out_date: string
          number_of_guests?: number
          booking_source?: string | null
          booking_reference?: string | null
          base_amount?: number
          enhancements_amount?: number
          status?: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guest_id?: string
          hotel_id?: string
          token_id?: string | null
          room_number?: string
          room_type?: string | null
          check_in_date?: string
          check_out_date?: string
          number_of_guests?: number
          booking_source?: string | null
          booking_reference?: string | null
          base_amount?: number
          enhancements_amount?: number
          status?: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      enhance_stay_options: {
        Row: {
          id: string
          hotel_id: string
          name: string
          description: string | null
          category: 'flowers' | 'spa' | 'dining' | 'room_upgrade' | 'transportation' | 'experience' | 'other'
          price: number
          image_url: string | null
          requires_customization: boolean
          customization_schema: Json | null
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_id: string
          name: string
          description?: string | null
          category: 'flowers' | 'spa' | 'dining' | 'room_upgrade' | 'transportation' | 'experience' | 'other'
          price: number
          image_url?: string | null
          requires_customization?: boolean
          customization_schema?: Json | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_id?: string
          name?: string
          description?: string | null
          category?: 'flowers' | 'spa' | 'dining' | 'room_upgrade' | 'transportation' | 'experience' | 'other'
          price?: number
          image_url?: string | null
          requires_customization?: boolean
          customization_schema?: Json | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      booking_enhancements: {
        Row: {
          id: string
          booking_id: string
          option_id: string
          quantity: number
          price_snapshot: number
          customization: Json
          status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          option_id: string
          quantity?: number
          price_snapshot: number
          customization?: Json
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          option_id?: string
          quantity?: number
          price_snapshot?: number
          customization?: Json
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      guest_sessions: {
        Row: {
          id: string
          session_token: string
          guest_id: string
          hotel_id: string
          booking_id: string | null
          expires_at: string
          last_activity_at: string
          created_at: string
        }
        Insert: {
          id?: string
          session_token: string
          guest_id: string
          hotel_id: string
          booking_id?: string | null
          expires_at: string
          last_activity_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_token?: string
          guest_id?: string
          hotel_id?: string
          booking_id?: string | null
          expires_at?: string
          last_activity_at?: string
          created_at?: string
        }
      }
      hotel_settings: {
        Row: {
          id: string
          hotel_id: string
          theme_config: Json
          branding: Json
          payment_config: Json
          checkin_flow_config: Json
          minibar_enabled: boolean
          enhance_stay_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_id: string
          theme_config?: Json
          branding?: Json
          payment_config?: Json
          checkin_flow_config?: Json
          minibar_enabled?: boolean
          enhance_stay_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_id?: string
          theme_config?: Json
          branding?: Json
          payment_config?: Json
          checkin_flow_config?: Json
          minibar_enabled?: boolean
          enhance_stay_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      minibar_items: {
        Row: {
          id: string
          hotel_id: string | null
          name: string
          category: string
          custom_category: string | null
          price: number
          description: string | null
          allergic_details: string | null
          calories: number | null
          stock_quantity: number
          is_visible: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_id?: string | null
          name: string
          category: string
          custom_category?: string | null
          price: number
          description?: string | null
          allergic_details?: string | null
          calories?: number | null
          stock_quantity?: number
          is_visible?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_id?: string | null
          name?: string
          category?: string
          custom_category?: string | null
          price?: number
          description?: string | null
          allergic_details?: string | null
          calories?: number | null
          stock_quantity?: number
          is_visible?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          hotel_id: string | null
          booking_id: string | null
          guest_id: string
          room_number: string | null
          source: string | null
          status: string | null
          notes: string | null
          guest_last_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_id?: string | null
          booking_id?: string | null
          guest_id: string
          room_number?: string | null
          source?: string | null
          status?: string | null
          notes?: string | null
          guest_last_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_id?: string | null
          booking_id?: string | null
          guest_id?: string
          room_number?: string | null
          source?: string | null
          status?: string | null
          notes?: string | null
          guest_last_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          minibar_item_local_id: string | null
          minibar_item: string | null
          name_snapshot: string | null
          price_snapshot: number | null
          quantity: number | null
          line_total: number | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          minibar_item_local_id?: string | null
          minibar_item?: string | null
          name_snapshot?: string | null
          price_snapshot?: number | null
          quantity?: number | null
          line_total?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          minibar_item_local_id?: string | null
          minibar_item?: string | null
          name_snapshot?: string | null
          price_snapshot?: number | null
          quantity?: number | null
          line_total?: number | null
          created_at?: string
        }
      }
      delivered_orders: {
        Row: {
          id: string
          hotel_id: string | null
          booking_id: string | null
          guest_id: string
          room_number: string
          source: string
          status: string
          notes: string | null
          guest_last_name: string | null
          created_at: string
          delivered_at: string
          updated_at: string
        }
        Insert: {
          id: string
          hotel_id?: string | null
          booking_id?: string | null
          guest_id: string
          room_number: string
          source: string
          status: string
          notes?: string | null
          guest_last_name?: string | null
          created_at: string
          delivered_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_id?: string | null
          booking_id?: string | null
          guest_id?: string
          room_number?: string
          source?: string
          status?: string
          notes?: string | null
          guest_last_name?: string | null
          created_at?: string
          delivered_at?: string
          updated_at?: string
        }
      }
      delivered_order_items: {
        Row: {
          id: string
          order_id: string
          minibar_item: string | null
          name_snapshot: string
          price_snapshot: number
          quantity: number
          line_total: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          minibar_item?: string | null
          name_snapshot: string
          price_snapshot: number
          quantity: number
          line_total: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          minibar_item?: string | null
          name_snapshot?: string
          price_snapshot?: number
          quantity?: number
          line_total?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      expire_old_tokens: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
