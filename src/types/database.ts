export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      customer_addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean
          label: string
          line1: string
          line2: string | null
          postal_code: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          line1: string
          line2?: string | null
          postal_code: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          line1?: string
          line2?: string | null
          postal_code?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          promo_interest: boolean
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          promo_interest?: boolean
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          promo_interest?: boolean
          source?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          id: string
          line_items: Json
          shipping_address: Json | null
          shipping_cents: number
          shipping_rate_cents: number | null
          status: string
          stripe_session_id: string
          subtotal_cents: number
          total_cents: number
          tracking_carrier: string | null
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          id?: string
          line_items: Json
          shipping_address?: Json | null
          shipping_cents?: number
          shipping_rate_cents?: number | null
          status?: string
          stripe_session_id: string
          subtotal_cents: number
          total_cents: number
          tracking_carrier?: string | null
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          id?: string
          line_items?: Json
          shipping_address?: Json | null
          shipping_cents?: number
          shipping_rate_cents?: number | null
          status?: string
          stripe_session_id?: string
          subtotal_cents?: number
          total_cents?: number
          tracking_carrier?: string | null
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_relationships: {
        Row: {
          created_at: string
          relationship_type: string
          sort_order: number
          source_product_id: string
          target_product_id: string
        }
        Insert: {
          created_at?: string
          relationship_type?: string
          sort_order?: number
          source_product_id: string
          target_product_id: string
        }
        Update: {
          created_at?: string
          relationship_type?: string
          sort_order?: number
          source_product_id?: string
          target_product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_relationships_source_product_id_fkey"
            columns: ["source_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_relationships_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          benefits: Json
          category: string
          caution: string
          claims: Json | null
          compliance_note: string | null
          created_at: string
          currency: string
          directions: Json
          featured: boolean
          id: string
          images: Json
          ingredients: Json
          inventory_count: number
          is_active: boolean
          name: string
          nutrition_highlights: Json | null
          overview: string
          price: number
          shipping_class: string
          short_description: string
          short_name: string
          size: string
          slug: string
          status: string
          storage: string
          tagline: string
          updated_at: string
          verification_note: string | null
        }
        Insert: {
          benefits?: Json
          category: string
          caution: string
          claims?: Json | null
          compliance_note?: string | null
          created_at?: string
          currency?: string
          directions: Json
          featured?: boolean
          id: string
          images?: Json
          ingredients?: Json
          inventory_count?: number
          is_active?: boolean
          name: string
          nutrition_highlights?: Json | null
          overview: string
          price: number
          shipping_class?: string
          short_description: string
          short_name: string
          size: string
          slug: string
          status?: string
          storage: string
          tagline: string
          updated_at?: string
          verification_note?: string | null
        }
        Update: {
          benefits?: Json
          category?: string
          caution?: string
          claims?: Json | null
          compliance_note?: string | null
          created_at?: string
          currency?: string
          directions?: Json
          featured?: boolean
          id?: string
          images?: Json
          ingredients?: Json
          inventory_count?: number
          is_active?: boolean
          name?: string
          nutrition_highlights?: Json | null
          overview?: string
          price?: number
          shipping_class?: string
          short_description?: string
          short_name?: string
          size?: string
          slug?: string
          status?: string
          storage?: string
          tagline?: string
          updated_at?: string
          verification_note?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          bundle_id: string | null
          created_at: string
          id: string
          product_id: string | null
          user_id: string
        }
        Insert: {
          bundle_id?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          user_id: string
        }
        Update: {
          bundle_id?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_co_purchase_recommendations: {
        Args: {
          p_limit?: number
          p_product_id: string
        }
        Returns: {
          co_occurrence_count: number
          target_product_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
