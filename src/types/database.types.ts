export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      article_content: {
        Row: {
          author_name: Json | null
          body: Json
          id: string
          read_time_minutes: number | null
        }
        Insert: {
          author_name?: Json | null
          body?: Json
          id: string
          read_time_minutes?: number | null
        }
        Update: {
          author_name?: Json | null
          body?: Json
          id?: string
          read_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "article_content_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_content: {
        Row: {
          album_name: Json | null
          artist_name: Json | null
          audio_url: string
          duration_seconds: number | null
          file_size_bytes: number | null
          genre: string | null
          id: string
          is_playlist: boolean
        }
        Insert: {
          album_name?: Json | null
          artist_name?: Json | null
          audio_url: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          genre?: string | null
          id: string
          is_playlist?: boolean
        }
        Update: {
          album_name?: Json | null
          artist_name?: Json | null
          audio_url?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          genre?: string | null
          id?: string
          is_playlist?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "audio_content_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_name: Json
          branch_name: string | null
          church_id: string
          created_at: string
          id: string
          is_active: boolean
          is_primary: boolean
          swift_code: string | null
          updated_at: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_name?: Json
          branch_name?: string | null
          church_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          swift_code?: string | null
          updated_at?: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_name?: Json
          branch_name?: string | null
          church_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          swift_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_bookmarks: {
        Row: {
          book_id: string
          chapter_id: string
          created_at: string | null
          id: string
          note: string | null
          user_id: string
          verse_id: string
        }
        Insert: {
          book_id: string
          chapter_id: string
          created_at?: string | null
          id?: string
          note?: string | null
          user_id: string
          verse_id: string
        }
        Update: {
          book_id?: string
          chapter_id?: string
          created_at?: string | null
          id?: string
          note?: string | null
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_bookmarks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_bookmarks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_bookmarks_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_books: {
        Row: {
          book_number: number
          chapter_count: number
          id: string
          name: Json
          testament: Json
        }
        Insert: {
          book_number: number
          chapter_count: number
          id?: string
          name?: Json
          testament?: Json
        }
        Update: {
          book_number?: number
          chapter_count?: number
          id?: string
          name?: Json
          testament?: Json
        }
        Relationships: []
      }
      bible_chapters: {
        Row: {
          book_id: string
          chapter_number: number
          id: string
          verse_count: number
        }
        Insert: {
          book_id: string
          chapter_number: number
          id?: string
          verse_count: number
        }
        Update: {
          book_id?: string
          chapter_number?: number
          id?: string
          verse_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_cross_references: {
        Row: {
          created_at: string | null
          description: Json | null
          id: string
          reference: Json
          reference_book_id: string | null
          reference_chapter: number | null
          reference_verse_end: number | null
          reference_verse_start: number | null
          verse_id: string
        }
        Insert: {
          created_at?: string | null
          description?: Json | null
          id?: string
          reference: Json
          reference_book_id?: string | null
          reference_chapter?: number | null
          reference_verse_end?: number | null
          reference_verse_start?: number | null
          verse_id: string
        }
        Update: {
          created_at?: string | null
          description?: Json | null
          id?: string
          reference?: Json
          reference_book_id?: string | null
          reference_chapter?: number | null
          reference_verse_end?: number | null
          reference_verse_start?: number | null
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_cross_references_reference_book_id_fkey"
            columns: ["reference_book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_cross_references_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_footnotes: {
        Row: {
          created_at: string | null
          id: string
          marker: Json
          note: Json
          type: string | null
          verse_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          marker: Json
          note: Json
          type?: string | null
          verse_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          marker?: Json
          note?: Json
          type?: string | null
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_footnotes_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_verses: {
        Row: {
          chapter_id: string
          id: string
          text: Json
          verse_number: number
        }
        Insert: {
          chapter_id: string
          id?: string
          text?: Json
          verse_number: number
        }
        Update: {
          chapter_id?: string
          id?: string
          text?: Json
          verse_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_sessions: {
        Row: {
          created_at: string | null
          id: string
          session: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          session?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          session?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      campaign_goal_changes: {
        Row: {
          campaign_id: string
          changed_at: string
          changed_by: string
          created_at: string
          id: string
          new_goal_amount: number
          old_goal_amount: number
          reason: Json
        }
        Insert: {
          campaign_id: string
          changed_at?: string
          changed_by: string
          created_at?: string
          id?: string
          new_goal_amount: number
          old_goal_amount: number
          reason: Json
        }
        Update: {
          campaign_id?: string
          changed_at?: string
          changed_by?: string
          created_at?: string
          id?: string
          new_goal_amount?: number
          old_goal_amount?: number
          reason?: Json
        }
        Relationships: [
          {
            foreignKeyName: "campaign_goal_changes_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_payment_methods: {
        Row: {
          campaign_id: string
          church_payment_method_id: string
          created_at: string
          id: string
          is_active: boolean
        }
        Insert: {
          campaign_id: string
          church_payment_method_id: string
          created_at?: string
          id?: string
          is_active?: boolean
        }
        Update: {
          campaign_id?: string
          church_payment_method_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "campaign_payment_methods_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_payment_methods_church_payment_method_id_fkey"
            columns: ["church_payment_method_id"]
            isOneToOne: false
            referencedRelation: "church_payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      church_images: {
        Row: {
          church_id: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          updated_at: string
        }
        Insert: {
          church_id: string
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          updated_at?: string
        }
        Update: {
          church_id?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_images_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_payment_methods: {
        Row: {
          bank_account_id: string | null
          church_id: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean
          payment_gateway_id: string | null
          payment_type: string
          updated_at: string
        }
        Insert: {
          bank_account_id?: string | null
          church_id: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          payment_gateway_id?: string | null
          payment_type: string
          updated_at?: string
        }
        Update: {
          bank_account_id?: string | null
          church_id?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          payment_gateway_id?: string | null
          payment_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_payment_methods_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_payment_methods_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_payment_methods_payment_gateway_id_fkey"
            columns: ["payment_gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          address: Json | null
          category: Database["public"]["Enums"]["church_category"]
          city: Json | null
          coordinates: unknown
          country: Json | null
          cover_image_url: string | null
          created_at: string
          description: Json
          email: string | null
          founded_year: number | null
          id: string
          location: Json | null
          logo_url: string | null
          name: Json
          phone_number: string
          region_id: string | null
          rejected_reason: string | null
          state: Json | null
          status: Database["public"]["Enums"]["church_status"]
          subcity_id: string | null
          updated_at: string
          verified_at: string | null
          verified_by: string | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          category?: Database["public"]["Enums"]["church_category"]
          city?: Json | null
          coordinates: unknown
          country?: Json | null
          cover_image_url?: string | null
          created_at?: string
          description?: Json
          email?: string | null
          founded_year?: number | null
          id?: string
          location?: Json | null
          logo_url?: string | null
          name: Json
          phone_number: string
          region_id?: string | null
          rejected_reason?: string | null
          state?: Json | null
          status?: Database["public"]["Enums"]["church_status"]
          subcity_id?: string | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          category?: Database["public"]["Enums"]["church_category"]
          city?: Json | null
          coordinates?: unknown
          country?: Json | null
          cover_image_url?: string | null
          created_at?: string
          description?: Json
          email?: string | null
          founded_year?: number | null
          id?: string
          location?: Json | null
          logo_url?: string | null
          name?: Json
          phone_number?: string
          region_id?: string | null
          rejected_reason?: string | null
          state?: Json | null
          status?: Database["public"]["Enums"]["church_status"]
          subcity_id?: string | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "churches_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "region_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "churches_subcity_id_fkey"
            columns: ["subcity_id"]
            isOneToOne: false
            referencedRelation: "subcities"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          church_id: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          created_by: string
          description: Json
          id: string
          like_count: number
          published_at: string | null
          rejected_reason: string | null
          share_count: number
          status: Database["public"]["Enums"]["content_status"]
          thumbnail_url: string | null
          title: Json
          updated_at: string
          view_count: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          church_id: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by: string
          description?: Json
          id?: string
          like_count?: number
          published_at?: string | null
          rejected_reason?: string | null
          share_count?: number
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail_url?: string | null
          title?: Json
          updated_at?: string
          view_count?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          church_id?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by?: string
          description?: Json
          id?: string
          like_count?: number
          published_at?: string | null
          rejected_reason?: string | null
          share_count?: number
          status?: Database["public"]["Enums"]["content_status"]
          thumbnail_url?: string | null
          title?: Json
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_items_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_likes: {
        Row: {
          content_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_likes_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_campaigns: {
        Row: {
          bank_account_id: string | null
          category_id: string | null
          church_id: string
          cover_image_url: string | null
          created_at: string
          created_by: string
          currency: string
          current_amount: number
          description: Json
          end_date: string | null
          goal_amount: number
          id: string
          rejected_reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["campaign_status"]
          title: Json
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          bank_account_id?: string | null
          category_id?: string | null
          church_id: string
          cover_image_url?: string | null
          created_at?: string
          created_by: string
          currency?: string
          current_amount?: number
          description?: Json
          end_date?: string | null
          goal_amount: number
          id?: string
          rejected_reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          title?: Json
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          bank_account_id?: string | null
          category_id?: string | null
          church_id?: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          current_amount?: number
          description?: Json
          end_date?: string | null
          goal_amount?: number
          id?: string
          rejected_reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          title?: Json
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_campaigns_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_campaigns_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "donation_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_campaigns_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_campaigns_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_categories: {
        Row: {
          color: string | null
          created_at: string
          description: Json
          icon: string | null
          id: string
          name: Json
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: Json
          icon?: string | null
          id?: string
          name?: Json
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: Json
          icon?: string | null
          id?: string
          name?: Json
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string | null
          completed_at: string | null
          created_at: string
          currency: string
          event_id: string | null
          from_wallet: boolean
          id: string
          is_anonymous: boolean
          message: Json | null
          payment_id: string | null
          status: Database["public"]["Enums"]["donation_status"]
          user_id: string
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          event_id?: string | null
          from_wallet?: boolean
          id?: string
          is_anonymous?: boolean
          message?: Json | null
          payment_id?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          user_id: string
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          event_id?: string | null
          from_wallet?: boolean
          id?: string
          is_anonymous?: boolean
          message?: Json | null
          payment_id?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_categories: {
        Row: {
          color: string | null
          created_at: string
          description: Json
          icon: string | null
          id: string
          name: Json
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: Json
          icon?: string | null
          id?: string
          name?: Json
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: Json
          icon?: string | null
          id?: string
          name?: Json
          updated_at?: string
        }
        Relationships: []
      }
      event_co_hosts: {
        Row: {
          church_id: string
          event_id: string
          id: string
          invited_at: string
          invited_by: string
          responded_at: string | null
          responded_by: string | null
          status: Database["public"]["Enums"]["event_co_host_status"]
        }
        Insert: {
          church_id: string
          event_id: string
          id?: string
          invited_at?: string
          invited_by: string
          responded_at?: string | null
          responded_by?: string | null
          status?: Database["public"]["Enums"]["event_co_host_status"]
        }
        Update: {
          church_id?: string
          event_id?: string
          id?: string
          invited_at?: string
          invited_by?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: Database["public"]["Enums"]["event_co_host_status"]
        }
        Relationships: [
          {
            foreignKeyName: "event_co_hosts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_co_hosts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_co_hosts_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_co_hosts_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          guest_count: number
          id: string
          status: Database["public"]["Enums"]["rsvp_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          guest_count?: number
          id?: string
          status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          guest_count?: number
          id?: string
          status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: Json | null
          category_id: string | null
          church_id: string
          coordinates: unknown
          cover_image_url: string | null
          created_at: string
          created_by: string
          description: Json
          donation_currency: string | null
          donation_current_amount: number
          donation_goal_amount: number | null
          end_time: string
          has_donation: boolean
          id: string
          is_online: boolean
          location: Json | null
          max_attendees: number | null
          meeting_url: string | null
          rsvp_deadline: string | null
          start_time: string
          status: Database["public"]["Enums"]["event_status"]
          title: Json
          updated_at: string
        }
        Insert: {
          address?: Json | null
          category_id?: string | null
          church_id: string
          coordinates?: unknown
          cover_image_url?: string | null
          created_at?: string
          created_by: string
          description?: Json
          donation_currency?: string | null
          donation_current_amount?: number
          donation_goal_amount?: number | null
          end_time: string
          has_donation?: boolean
          id?: string
          is_online?: boolean
          location?: Json | null
          max_attendees?: number | null
          meeting_url?: string | null
          rsvp_deadline?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: Json
          updated_at?: string
        }
        Update: {
          address?: Json | null
          category_id?: string | null
          church_id?: string
          coordinates?: unknown
          cover_image_url?: string | null
          created_at?: string
          created_by?: string
          description?: Json
          donation_currency?: string | null
          donation_current_amount?: number
          donation_goal_amount?: number | null
          end_time?: string
          has_donation?: boolean
          id?: string
          is_online?: boolean
          location?: Json | null
          max_attendees?: number | null
          meeting_url?: string | null
          rsvp_deadline?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          church_id: string | null
          created_at: string
          created_by: string
          description: Json | null
          id: string
          is_enabled: boolean
          key: string
          name: Json
          scope: Database["public"]["Enums"]["feature_flag_scope"]
          updated_at: string
        }
        Insert: {
          church_id?: string | null
          created_at?: string
          created_by: string
          description?: Json | null
          id?: string
          is_enabled?: boolean
          key: string
          name?: Json
          scope?: Database["public"]["Enums"]["feature_flag_scope"]
          updated_at?: string
        }
        Update: {
          church_id?: string | null
          created_at?: string
          created_by?: string
          description?: Json | null
          id?: string
          is_enabled?: boolean
          key?: string
          name?: Json
          scope?: Database["public"]["Enums"]["feature_flag_scope"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_flags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          church_id: string | null
          created_at: string
          expires_at: string
          id: string
          invited_by: string
          phone_number: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["invitation_status"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          church_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invited_by: string
          phone_number: string
          role: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
          token: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          church_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invited_by?: string
          phone_number?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_reads: {
        Row: {
          id: string
          notification_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          notification_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          notification_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: Json
          created_at: string
          data: Json | null
          id: string
          is_broadcast: boolean
          is_read: boolean
          read_at: string | null
          sent_by: string | null
          title: Json
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          body?: Json
          created_at?: string
          data?: Json | null
          id?: string
          is_broadcast?: boolean
          is_read?: boolean
          read_at?: string | null
          sent_by?: string | null
          title?: Json
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          body?: Json
          created_at?: string
          data?: Json | null
          id?: string
          is_broadcast?: boolean
          is_read?: boolean
          read_at?: string | null
          sent_by?: string | null
          title?: Json
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateways: {
        Row: {
          api_key: string | null
          color: string | null
          config: Json | null
          created_at: string
          description: Json | null
          display_name: Json
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          test_mode: boolean
          updated_at: string
          webhook_secret: string | null
        }
        Insert: {
          api_key?: string | null
          color?: string | null
          config?: Json | null
          created_at?: string
          description?: Json | null
          display_name?: Json
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          test_mode?: boolean
          updated_at?: string
          webhook_secret?: string | null
        }
        Update: {
          api_key?: string | null
          color?: string | null
          config?: Json | null
          created_at?: string
          description?: Json | null
          display_name?: Json
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          test_mode?: boolean
          updated_at?: string
          webhook_secret?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          church_payment_method_id: string | null
          completed_at: string | null
          created_at: string
          currency: string
          error_message: string | null
          failed_at: string | null
          gateway_reference: string | null
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          payment_details: Json | null
          payment_gateway: string | null
          payment_method: string
          status: Database["public"]["Enums"]["donation_status"]
          user_id: string
        }
        Insert: {
          amount: number
          church_payment_method_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          failed_at?: string | null
          gateway_reference?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          payment_details?: Json | null
          payment_gateway?: string | null
          payment_method: string
          status?: Database["public"]["Enums"]["donation_status"]
          user_id: string
        }
        Update: {
          amount?: number
          church_payment_method_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          failed_at?: string | null
          gateway_reference?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          payment_details?: Json | null
          payment_gateway?: string | null
          payment_method?: string
          status?: Database["public"]["Enums"]["donation_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_church_payment_method_id_fkey"
            columns: ["church_payment_method_id"]
            isOneToOne: false
            referencedRelation: "church_payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          email_verified: boolean
          first_name: string | null
          gender: string | null
          id: string
          language_preference: string | null
          last_name: string | null
          notification_enabled: boolean
          phone_number: string | null
          phone_verified: boolean
          points: number | null
          referral_code: string | null
          referred_by: string | null
          status: Database["public"]["Enums"]["user_account_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          email_verified?: boolean
          first_name?: string | null
          gender?: string | null
          id: string
          language_preference?: string | null
          last_name?: string | null
          notification_enabled?: boolean
          phone_number?: string | null
          phone_verified?: boolean
          points?: number | null
          referral_code?: string | null
          referred_by?: string | null
          status?: Database["public"]["Enums"]["user_account_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          email_verified?: boolean
          first_name?: string | null
          gender?: string | null
          id?: string
          language_preference?: string | null
          last_name?: string | null
          notification_enabled?: boolean
          phone_number?: string | null
          phone_verified?: boolean
          points?: number | null
          referral_code?: string | null
          referred_by?: string | null
          status?: Database["public"]["Enums"]["user_account_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      push_tokens: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          is_active: boolean
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          is_active?: boolean
          platform: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          is_active?: boolean
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          points_awarded: number
          referred_id: string
          referrer_id: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_awarded?: number
          referred_id: string
          referrer_id: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_awarded?: number
          referred_id?: string
          referrer_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      region_categories: {
        Row: {
          color_end: string
          color_start: string
          created_at: string
          description: Json | null
          display_name: Json
          display_order: number
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color_end: string
          color_start: string
          created_at?: string
          description?: Json | null
          display_name?: Json
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color_end?: string
          color_start?: string
          created_at?: string
          description?: Json | null
          display_name?: Json
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      room_content: {
        Row: {
          actual_start_time: string | null
          end_time: string | null
          id: string
          max_speakers: number | null
          recording_url: string | null
          room_status: Database["public"]["Enums"]["room_status"]
          scheduled_start_time: string | null
          stream_key: string | null
        }
        Insert: {
          actual_start_time?: string | null
          end_time?: string | null
          id: string
          max_speakers?: number | null
          recording_url?: string | null
          room_status?: Database["public"]["Enums"]["room_status"]
          scheduled_start_time?: string | null
          stream_key?: string | null
        }
        Update: {
          actual_start_time?: string | null
          end_time?: string | null
          id?: string
          max_speakers?: number | null
          recording_url?: string | null
          room_status?: Database["public"]["Enums"]["room_status"]
          scheduled_start_time?: string | null
          stream_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_content_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      room_participants: {
        Row: {
          id: string
          joined_at: string
          left_at: string | null
          role: Database["public"]["Enums"]["room_participant_role"]
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          left_at?: string | null
          role?: Database["public"]["Enums"]["room_participant_role"]
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          left_at?: string | null
          role?: Database["public"]["Enums"]["room_participant_role"]
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_donations: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string
          currency: string
          end_date: string | null
          event_id: string | null
          frequency: string
          id: string
          is_active: boolean
          next_donation_date: string
          updated_at: string
          use_wallet: boolean
          user_id: string
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string
          currency?: string
          end_date?: string | null
          event_id?: string | null
          frequency: string
          id?: string
          is_active?: boolean
          next_donation_date: string
          updated_at?: string
          use_wallet?: boolean
          user_id: string
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string
          currency?: string
          end_date?: string | null
          event_id?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          next_donation_date?: string
          updated_at?: string
          use_wallet?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_donations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story_content: {
        Row: {
          expires_at: string
          id: string
          media_type: string
          media_url: string
        }
        Insert: {
          expires_at?: string
          id: string
          media_type: string
          media_url: string
        }
        Update: {
          expires_at?: string
          id?: string
          media_type?: string
          media_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_content_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      subcities: {
        Row: {
          created_at: string
          display_name: Json
          display_order: number
          id: string
          is_active: boolean
          name: string
          region_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: Json
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          region_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: Json
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          region_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcities_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "region_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          church_id: string
          followed_at: string
          id: string
          user_id: string
        }
        Insert: {
          church_id: string
          followed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          church_id?: string
          followed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          notify_donations: boolean
          notify_events: boolean
          notify_new_content: boolean
          notify_verse_of_day: boolean
          theme_preference: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          notify_donations?: boolean
          notify_events?: boolean
          notify_new_content?: boolean
          notify_verse_of_day?: boolean
          theme_preference?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notify_donations?: boolean
          notify_events?: boolean
          notify_new_content?: boolean
          notify_verse_of_day?: boolean
          theme_preference?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          church_id: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          church_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          church_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_status_log: {
        Row: {
          changed_by: string
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["user_account_status"]
          old_status: Database["public"]["Enums"]["user_account_status"] | null
          reason: string | null
          user_id: string
        }
        Insert: {
          changed_by: string
          created_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["user_account_status"]
          old_status?: Database["public"]["Enums"]["user_account_status"] | null
          reason?: string | null
          user_id: string
        }
        Update: {
          changed_by?: string
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["user_account_status"]
          old_status?: Database["public"]["Enums"]["user_account_status"] | null
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_status_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_status_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verse_of_the_day: {
        Row: {
          created_at: string
          created_by: string
          id: string
          scheduled_date: string
          verse_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          scheduled_date: string
          verse_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          scheduled_date?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verse_of_the_day_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verse_of_the_day_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      video_content: {
        Row: {
          aspect_ratio: string | null
          duration_seconds: number | null
          file_size_bytes: number | null
          id: string
          resolution: string | null
          video_url: string
        }
        Insert: {
          aspect_ratio?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id: string
          resolution?: string | null
          video_url: string
        }
        Update: {
          aspect_ratio?: string | null
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          resolution?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_content_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          status: Database["public"]["Enums"]["wallet_transaction_status"]
          transaction_type: Database["public"]["Enums"]["wallet_transaction_type"]
          wallet_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          status?: Database["public"]["Enums"]["wallet_transaction_status"]
          transaction_type: Database["public"]["Enums"]["wallet_transaction_type"]
          wallet_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          status?: Database["public"]["Enums"]["wallet_transaction_status"]
          transaction_type?: Database["public"]["Enums"]["wallet_transaction_type"]
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "user_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: { accepting_user_id: string; invitation_token: string }
        Returns: Json
      }
      check_phone_exists: { Args: { phone_number: string }; Returns: boolean }
      cleanup_old_bot_sessions: { Args: never; Returns: undefined }
      close_completed_events: { Args: never; Returns: undefined }
      decrement_like_count: { Args: { content_id: string }; Returns: undefined }
      expire_old_invitations: { Args: never; Returns: undefined }
      expire_old_stories: { Args: never; Returns: undefined }
      extract_church_coordinates: {
        Args: never
        Returns: {
          address: Json
          category: string
          city: Json
          coordinates: unknown
          country: Json
          cover_image_url: string
          created_at: string
          description: Json
          email: string
          founded_year: number
          id: string
          latitude: number
          location: Json
          logo_url: string
          longitude: number
          name: Json
          phone_number: string
          region_id: string
          rejected_reason: string
          state: Json
          status: Database["public"]["Enums"]["church_status"]
          subcity_id: string
          updated_at: string
          verified_at: string
          verified_by: string
          website: string
        }[]
      }
      generate_referral_code: { Args: never; Returns: string }
      get_followed_churches: {
        Args: { check_user_id: string }
        Returns: {
          church_id: string
          church_logo_url: string
          church_name: string
          followed_at: string
        }[]
      }
      get_nearby_churches: {
        Args: { radius_km?: number; user_lat: number; user_lng: number }
        Returns: {
          address: Json
          category: string
          city: Json
          coordinates: unknown
          country: Json
          cover_image_url: string
          created_at: string
          description: Json
          distance_km: number
          email: string
          founded_year: number
          id: string
          latitude: number
          location: Json
          logo_url: string
          longitude: number
          name: Json
          phone_number: string
          region_id: string
          rejected_reason: string
          state: Json
          status: string
          subcity_id: string
          updated_at: string
          verified_at: string
          verified_by: string
          website: string
        }[]
      }
      get_or_create_referral_code: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_user_churches: {
        Args: { check_user_id: string }
        Returns: {
          church_id: string
          church_logo_url: string
          church_name: string
          user_role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      get_user_wallet_balance: {
        Args: { check_user_id: string }
        Returns: number
      }
      increment_content_view_count: {
        Args: { content_id: string }
        Returns: undefined
      }
      increment_like_count: { Args: { content_id: string }; Returns: undefined }
      is_admin: { Args: { check_user_id: string }; Returns: boolean }
      is_church_admin: {
        Args: { church_id: string; user_id: string }
        Returns: boolean
      }
      is_content_admin: {
        Args: { church_id: string; user_id: string }
        Returns: boolean
      }
      is_content_creator: {
        Args: { church_id: string; user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: { user_id: string }; Returns: boolean }
      process_referral: {
        Args: { p_referred_user_id: string; p_referrer_code: string }
        Returns: Json
      }
      process_scheduled_donation: {
        Args: { scheduled_donation_id: string }
        Returns: Json
      }
      search_bible_books: {
        Args: { search_query: string }
        Returns: {
          book_number: number
          chapter_count: number
          id: string
          name: Json
          testament: Json
        }[]
      }
      search_bible_verses_text: {
        Args: { search_query: string }
        Returns: {
          book_id: string
          book_name: Json
          book_number: number
          chapter_count: number
          chapter_id: string
          chapter_number: number
          testament: Json
          text: Json
          verse_count: number
          verse_id: string
          verse_number: number
        }[]
      }
      send_sms_hook: { Args: { event: Json }; Returns: Json }
      user_has_church_role: {
        Args: {
          p_church_id: string
          p_role: Database["public"]["Enums"]["user_role"]
          p_user_id: string
        }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          p_role: Database["public"]["Enums"]["user_role"]
          p_user_id: string
        }
        Returns: boolean
      }
      user_has_role_in_church: {
        Args: {
          check_church_id: string
          check_role: Database["public"]["Enums"]["user_role"]
          check_user_id: string
        }
        Returns: boolean
      }
      verify_otp_hook: { Args: { event: Json }; Returns: Json }
    }
    Enums: {
      campaign_status: "draft" | "active" | "paused" | "completed" | "cancelled"
      church_category: "church" | "monastery" | "female-monastery"
      church_status: "pending" | "approved" | "rejected" | "suspended"
      content_status:
        | "draft"
        | "pending_approval"
        | "approved"
        | "rejected"
        | "archived"
      content_type: "audio" | "video" | "room" | "article" | "story"
      donation_status: "pending" | "completed" | "failed" | "refunded"
      event_co_host_status: "pending" | "accepted" | "declined"
      event_status: "draft" | "published" | "cancelled" | "completed"
      feature_flag_scope: "global" | "church"
      invitation_status: "pending" | "accepted" | "declined" | "expired"
      notification_type:
        | "verse_of_day"
        | "new_content"
        | "event_reminder"
        | "event_update"
        | "donation_received"
        | "role_invitation"
        | "content_approved"
        | "content_rejected"
        | "room_started"
        | "donation_campaign_update"
        | "prayer_request"
        | "church_announcement"
        | "system_message"
        | "achievement"
      room_participant_role: "host" | "speaker" | "listener"
      room_status: "scheduled" | "live" | "ended" | "cancelled"
      rsvp_status: "going" | "maybe" | "not_going"
      user_account_status: "active" | "inactive" | "suspended" | "banned"
      user_role:
        | "super_admin"
        | "admin"
        | "church_admin"
        | "content_admin"
        | "content_creator"
        | "user"
      wallet_transaction_status:
        | "pending"
        | "completed"
        | "failed"
        | "cancelled"
      wallet_transaction_type: "deposit" | "withdrawal" | "refund" | "donation"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      campaign_status: ["draft", "active", "paused", "completed", "cancelled"],
      church_category: ["church", "monastery", "female-monastery"],
      church_status: ["pending", "approved", "rejected", "suspended"],
      content_status: [
        "draft",
        "pending_approval",
        "approved",
        "rejected",
        "archived",
      ],
      content_type: ["audio", "video", "room", "article", "story"],
      donation_status: ["pending", "completed", "failed", "refunded"],
      event_co_host_status: ["pending", "accepted", "declined"],
      event_status: ["draft", "published", "cancelled", "completed"],
      feature_flag_scope: ["global", "church"],
      invitation_status: ["pending", "accepted", "declined", "expired"],
      notification_type: [
        "verse_of_day",
        "new_content",
        "event_reminder",
        "event_update",
        "donation_received",
        "role_invitation",
        "content_approved",
        "content_rejected",
        "room_started",
        "donation_campaign_update",
        "prayer_request",
        "church_announcement",
        "system_message",
        "achievement",
      ],
      room_participant_role: ["host", "speaker", "listener"],
      room_status: ["scheduled", "live", "ended", "cancelled"],
      rsvp_status: ["going", "maybe", "not_going"],
      user_account_status: ["active", "inactive", "suspended", "banned"],
      user_role: [
        "super_admin",
        "admin",
        "church_admin",
        "content_admin",
        "content_creator",
        "user",
      ],
      wallet_transaction_status: [
        "pending",
        "completed",
        "failed",
        "cancelled",
      ],
      wallet_transaction_type: ["deposit", "withdrawal", "refund", "donation"],
    },
  },
} as const
