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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          created_at?: string
        }
        Relationships: []
      }
      saved_services: {
        Row: {
          id: string
          user_id: string
          service_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_services_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_services_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          user_id: string | null
          service_id: string
          start_time: string
          end_time: string
          total_price: number
          total_paid: number
          status: 'pending_payment' | 'waiting_verification' | 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'unpaid' | 'partial' | 'paid'
          customer_name: string | null
          customer_phone: string | null
          customer_email: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          service_id: string
          start_time: string
          end_time: string
          total_price: number
          total_paid?: number
          status?: 'pending_payment' | 'waiting_verification' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'unpaid' | 'partial' | 'paid'
          customer_name?: string | null
          customer_phone?: string | null
          customer_email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          service_id?: string
          start_time?: string
          end_time?: string
          total_price?: number
          total_paid?: number
          status?: 'pending_payment' | 'waiting_verification' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'unpaid' | 'partial' | 'paid'
          customer_name?: string | null
          customer_phone?: string | null
          customer_email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          amount: number
          payment_type: string | null
          payment_proof_url: string | null
          status: 'pending' | 'verified' | 'rejected'
          verified_at: string | null
          verified_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          user_id: string
          amount: number
          payment_type?: string | null
          payment_proof_url?: string | null
          status?: 'pending' | 'verified' | 'rejected'
          verified_at?: string | null
          verified_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          user_id?: string
          amount?: number
          payment_type?: string | null
          payment_proof_url?: string | null
          status?: 'pending' | 'verified' | 'rejected'
          verified_at?: string | null
          verified_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          phone_number: string | null
          role: 'admin' | 'user'
          is_verified: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          role?: 'admin' | 'user'
          is_verified?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          role?: 'admin' | 'user'
          is_verified?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          unit: string
          category_id: string | null
          specifications: Json | null
          images: string[] | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price?: number
          unit?: string
          category_id?: string | null
          specifications?: Json | null
          images?: string[] | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          unit?: string
          category_id?: string | null
          specifications?: Json | null
          images?: string[] | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_: string]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      booking_status: 'pending_payment' | 'waiting_verification' | 'confirmed' | 'cancelled' | 'completed'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]