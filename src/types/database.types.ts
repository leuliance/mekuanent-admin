export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "13.0.4";
	};
	public: {
		Tables: {
			app_settings: {
				Row: {
					description: string | null;
					key: string;
					updated_at: string;
					updated_by: string | null;
					value: Json;
				};
				Insert: {
					description?: string | null;
					key: string;
					updated_at?: string;
					updated_by?: string | null;
					value: Json;
				};
				Update: {
					description?: string | null;
					key?: string;
					updated_at?: string;
					updated_by?: string | null;
					value?: Json;
				};
				Relationships: [];
			};
			article_content: {
				Row: {
					author_name: string | null;
					body: string;
					id: string;
					read_time_minutes: number | null;
				};
				Insert: {
					author_name?: string | null;
					body?: string;
					id: string;
					read_time_minutes?: number | null;
				};
				Update: {
					author_name?: string | null;
					body?: string;
					id?: string;
					read_time_minutes?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "article_content_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "content_items";
						referencedColumns: ["id"];
					},
				];
			};
			article_reading_progress: {
				Row: {
					article_content_id: string;
					last_read_at: string;
					progress_percentage: number;
					user_id: string;
				};
				Insert: {
					article_content_id: string;
					last_read_at?: string;
					progress_percentage?: number;
					user_id: string;
				};
				Update: {
					article_content_id?: string;
					last_read_at?: string;
					progress_percentage?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "article_reading_progress_article_content_id_fkey";
						columns: ["article_content_id"];
						isOneToOne: false;
						referencedRelation: "article_content";
						referencedColumns: ["id"];
					},
				];
			};
			audio_content: {
				Row: {
					album_name: string | null;
					artist_name: string | null;
					audio_url: string;
					duration_seconds: number | null;
					file_size_bytes: number | null;
					genre: string | null;
					id: string;
					is_playlist: boolean;
					linked_bible_reference: string | null;
				};
				Insert: {
					album_name?: string | null;
					artist_name?: string | null;
					audio_url: string;
					duration_seconds?: number | null;
					file_size_bytes?: number | null;
					genre?: string | null;
					id: string;
					is_playlist?: boolean;
					linked_bible_reference?: string | null;
				};
				Update: {
					album_name?: string | null;
					artist_name?: string | null;
					audio_url?: string;
					duration_seconds?: number | null;
					file_size_bytes?: number | null;
					genre?: string | null;
					id?: string;
					is_playlist?: boolean;
					linked_bible_reference?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "audio_content_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "content_items";
						referencedColumns: ["id"];
					},
				];
			};
			audio_transcripts: {
				Row: {
					audio_content_id: string;
					created_at: string;
					end_seconds: number | null;
					id: string;
					is_highlight: boolean;
					language: string;
					sort_order: number;
					start_seconds: number;
					text: string;
					updated_at: string;
				};
				Insert: {
					audio_content_id: string;
					created_at?: string;
					end_seconds?: number | null;
					id?: string;
					is_highlight?: boolean;
					language?: string;
					sort_order?: number;
					start_seconds: number;
					text: string;
					updated_at?: string;
				};
				Update: {
					audio_content_id?: string;
					created_at?: string;
					end_seconds?: number | null;
					id?: string;
					is_highlight?: boolean;
					language?: string;
					sort_order?: number;
					start_seconds?: number;
					text?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "audio_transcripts_audio_content_id_fkey";
						columns: ["audio_content_id"];
						isOneToOne: false;
						referencedRelation: "audio_content";
						referencedColumns: ["id"];
					},
				];
			};
			bank_accounts: {
				Row: {
					account_holder_name: string;
					account_number: string;
					bank_name: string;
					branch_name: string | null;
					church_id: string;
					created_at: string;
					id: string;
					is_active: boolean;
					is_primary: boolean;
					swift_code: string | null;
					updated_at: string;
				};
				Insert: {
					account_holder_name: string;
					account_number: string;
					bank_name: string;
					branch_name?: string | null;
					church_id: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					is_primary?: boolean;
					swift_code?: string | null;
					updated_at?: string;
				};
				Update: {
					account_holder_name?: string;
					account_number?: string;
					bank_name?: string;
					branch_name?: string | null;
					church_id?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					is_primary?: boolean;
					swift_code?: string | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bank_accounts_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
				];
			};
			bible_audio: {
				Row: {
					audio_url: string;
					chapter_id: string;
					created_at: string;
					duration_seconds: number | null;
					id: string;
					language: string;
					narrator: string | null;
				};
				Insert: {
					audio_url: string;
					chapter_id: string;
					created_at?: string;
					duration_seconds?: number | null;
					id?: string;
					language?: string;
					narrator?: string | null;
				};
				Update: {
					audio_url?: string;
					chapter_id?: string;
					created_at?: string;
					duration_seconds?: number | null;
					id?: string;
					language?: string;
					narrator?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "bible_audio_chapter_id_fkey";
						columns: ["chapter_id"];
						isOneToOne: false;
						referencedRelation: "bible_chapters";
						referencedColumns: ["id"];
					},
				];
			};
			bible_bookmarks: {
				Row: {
					book_id: string;
					chapter_id: string;
					created_at: string;
					id: string;
					note: string | null;
					user_id: string;
					verse_id: string;
				};
				Insert: {
					book_id: string;
					chapter_id: string;
					created_at?: string;
					id?: string;
					note?: string | null;
					user_id: string;
					verse_id: string;
				};
				Update: {
					book_id?: string;
					chapter_id?: string;
					created_at?: string;
					id?: string;
					note?: string | null;
					user_id?: string;
					verse_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bible_bookmarks_book_id_fkey";
						columns: ["book_id"];
						isOneToOne: false;
						referencedRelation: "bible_books";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bible_bookmarks_chapter_id_fkey";
						columns: ["chapter_id"];
						isOneToOne: false;
						referencedRelation: "bible_chapters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bible_bookmarks_verse_id_fkey";
						columns: ["verse_id"];
						isOneToOne: false;
						referencedRelation: "bible_verses";
						referencedColumns: ["id"];
					},
				];
			};
			bible_books: {
				Row: {
					book_number: number;
					category: string;
					chapter_count: number;
					created_at: string;
					id: string;
					name: Json;
					paratext_code: string;
					testament: string;
				};
				Insert: {
					book_number: number;
					category: string;
					chapter_count?: number;
					created_at?: string;
					id?: string;
					name?: Json;
					paratext_code: string;
					testament: string;
				};
				Update: {
					book_number?: number;
					category?: string;
					chapter_count?: number;
					created_at?: string;
					id?: string;
					name?: Json;
					paratext_code?: string;
					testament?: string;
				};
				Relationships: [];
			};
			bible_chapters: {
				Row: {
					book_id: string;
					chapter_number: number;
					content: Json | null;
					created_at: string;
					id: string;
					usfm_content: Json | null;
					verse_count: number;
				};
				Insert: {
					book_id: string;
					chapter_number: number;
					content?: Json | null;
					created_at?: string;
					id?: string;
					usfm_content?: Json | null;
					verse_count?: number;
				};
				Update: {
					book_id?: string;
					chapter_number?: number;
					content?: Json | null;
					created_at?: string;
					id?: string;
					usfm_content?: Json | null;
					verse_count?: number;
				};
				Relationships: [
					{
						foreignKeyName: "bible_chapters_book_id_fkey";
						columns: ["book_id"];
						isOneToOne: false;
						referencedRelation: "bible_books";
						referencedColumns: ["id"];
					},
				];
			};
			bible_cross_references: {
				Row: {
					created_at: string;
					description: Json;
					id: string;
					ref_book_id: string | null;
					ref_chapter: number | null;
					ref_verse_end: number | null;
					ref_verse_start: number | null;
					verse_id: string;
				};
				Insert: {
					created_at?: string;
					description?: Json;
					id?: string;
					ref_book_id?: string | null;
					ref_chapter?: number | null;
					ref_verse_end?: number | null;
					ref_verse_start?: number | null;
					verse_id: string;
				};
				Update: {
					created_at?: string;
					description?: Json;
					id?: string;
					ref_book_id?: string | null;
					ref_chapter?: number | null;
					ref_verse_end?: number | null;
					ref_verse_start?: number | null;
					verse_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bible_cross_references_ref_book_id_fkey";
						columns: ["ref_book_id"];
						isOneToOne: false;
						referencedRelation: "bible_books";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bible_cross_references_verse_id_fkey";
						columns: ["verse_id"];
						isOneToOne: false;
						referencedRelation: "bible_verses";
						referencedColumns: ["id"];
					},
				];
			};
			bible_footnotes: {
				Row: {
					created_at: string;
					id: string;
					marker: Json;
					note: Json;
					type: string;
					verse_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					marker?: Json;
					note?: Json;
					type?: string;
					verse_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					marker?: Json;
					note?: Json;
					type?: string;
					verse_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bible_footnotes_verse_id_fkey";
						columns: ["verse_id"];
						isOneToOne: false;
						referencedRelation: "bible_verses";
						referencedColumns: ["id"];
					},
				];
			};
			bible_highlights: {
				Row: {
					book_id: string;
					chapter_id: string;
					color: string;
					created_at: string;
					id: string;
					user_id: string;
					verse_id: string;
				};
				Insert: {
					book_id: string;
					chapter_id: string;
					color?: string;
					created_at?: string;
					id?: string;
					user_id: string;
					verse_id: string;
				};
				Update: {
					book_id?: string;
					chapter_id?: string;
					color?: string;
					created_at?: string;
					id?: string;
					user_id?: string;
					verse_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bible_highlights_book_id_fkey";
						columns: ["book_id"];
						isOneToOne: false;
						referencedRelation: "bible_books";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bible_highlights_chapter_id_fkey";
						columns: ["chapter_id"];
						isOneToOne: false;
						referencedRelation: "bible_chapters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bible_highlights_verse_id_fkey";
						columns: ["verse_id"];
						isOneToOne: false;
						referencedRelation: "bible_verses";
						referencedColumns: ["id"];
					},
				];
			};
			bible_notes: {
				Row: {
					book_id: string;
					chapter_id: string;
					content: string;
					created_at: string;
					id: string;
					updated_at: string;
					user_id: string;
					verse_id: string;
				};
				Insert: {
					book_id: string;
					chapter_id: string;
					content?: string;
					created_at?: string;
					id?: string;
					updated_at?: string;
					user_id: string;
					verse_id: string;
				};
				Update: {
					book_id?: string;
					chapter_id?: string;
					content?: string;
					created_at?: string;
					id?: string;
					updated_at?: string;
					user_id?: string;
					verse_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bible_notes_book_id_fkey";
						columns: ["book_id"];
						isOneToOne: false;
						referencedRelation: "bible_books";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bible_notes_chapter_id_fkey";
						columns: ["chapter_id"];
						isOneToOne: false;
						referencedRelation: "bible_chapters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bible_notes_verse_id_fkey";
						columns: ["verse_id"];
						isOneToOne: false;
						referencedRelation: "bible_verses";
						referencedColumns: ["id"];
					},
				];
			};
			bible_reading_plan_days: {
				Row: {
					created_at: string;
					day_number: number;
					id: string;
					plan_id: string;
					title: Json | null;
				};
				Insert: {
					created_at?: string;
					day_number: number;
					id?: string;
					plan_id: string;
					title?: Json | null;
				};
				Update: {
					created_at?: string;
					day_number?: number;
					id?: string;
					plan_id?: string;
					title?: Json | null;
				};
				Relationships: [
					{
						foreignKeyName: "bible_reading_plan_days_plan_id_fkey";
						columns: ["plan_id"];
						isOneToOne: false;
						referencedRelation: "bible_reading_plans";
						referencedColumns: ["id"];
					},
				];
			};
			bible_reading_plan_readings: {
				Row: {
					book_id: string;
					chapter_end: number | null;
					chapter_start: number;
					day_id: string;
					id: string;
					sort_order: number;
					verse_end: number | null;
					verse_start: number | null;
				};
				Insert: {
					book_id: string;
					chapter_end?: number | null;
					chapter_start: number;
					day_id: string;
					id?: string;
					sort_order?: number;
					verse_end?: number | null;
					verse_start?: number | null;
				};
				Update: {
					book_id?: string;
					chapter_end?: number | null;
					chapter_start?: number;
					day_id?: string;
					id?: string;
					sort_order?: number;
					verse_end?: number | null;
					verse_start?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "bible_reading_plan_readings_book_id_fkey";
						columns: ["book_id"];
						isOneToOne: false;
						referencedRelation: "bible_books";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bible_reading_plan_readings_day_id_fkey";
						columns: ["day_id"];
						isOneToOne: false;
						referencedRelation: "bible_reading_plan_days";
						referencedColumns: ["id"];
					},
				];
			};
			bible_reading_plans: {
				Row: {
					cover_image: string | null;
					created_at: string;
					description: Json;
					duration_days: number;
					id: string;
					is_active: boolean;
					title: Json;
				};
				Insert: {
					cover_image?: string | null;
					created_at?: string;
					description?: Json;
					duration_days?: number;
					id?: string;
					is_active?: boolean;
					title?: Json;
				};
				Update: {
					cover_image?: string | null;
					created_at?: string;
					description?: Json;
					duration_days?: number;
					id?: string;
					is_active?: boolean;
					title?: Json;
				};
				Relationships: [];
			};
			bible_translations: {
				Row: {
					code: string;
					created_at: string;
					id: string;
					is_active: boolean;
					is_default: boolean;
					name: Json;
					script: string;
					short_label: string | null;
					sort_order: number;
				};
				Insert: {
					code: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					is_default?: boolean;
					name?: Json;
					script?: string;
					short_label?: string | null;
					sort_order?: number;
				};
				Update: {
					code?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					is_default?: boolean;
					name?: Json;
					script?: string;
					short_label?: string | null;
					sort_order?: number;
				};
				Relationships: [];
			};
			bible_user_reading_plans: {
				Row: {
					created_at: string;
					current_day: number;
					id: string;
					is_completed: boolean;
					plan_id: string;
					start_date: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					current_day?: number;
					id?: string;
					is_completed?: boolean;
					plan_id: string;
					start_date?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					current_day?: number;
					id?: string;
					is_completed?: boolean;
					plan_id?: string;
					start_date?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bible_user_reading_plans_plan_id_fkey";
						columns: ["plan_id"];
						isOneToOne: false;
						referencedRelation: "bible_reading_plans";
						referencedColumns: ["id"];
					},
				];
			};
			bible_user_reading_progress: {
				Row: {
					completed_at: string | null;
					day_id: string;
					id: string;
					is_completed: boolean;
					user_plan_id: string;
				};
				Insert: {
					completed_at?: string | null;
					day_id: string;
					id?: string;
					is_completed?: boolean;
					user_plan_id: string;
				};
				Update: {
					completed_at?: string | null;
					day_id?: string;
					id?: string;
					is_completed?: boolean;
					user_plan_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bible_user_reading_progress_day_id_fkey";
						columns: ["day_id"];
						isOneToOne: false;
						referencedRelation: "bible_reading_plan_days";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bible_user_reading_progress_user_plan_id_fkey";
						columns: ["user_plan_id"];
						isOneToOne: false;
						referencedRelation: "bible_user_reading_plans";
						referencedColumns: ["id"];
					},
				];
			};
			bible_verses: {
				Row: {
					chapter_id: string;
					created_at: string;
					id: string;
					text: Json;
					verse_number: number;
				};
				Insert: {
					chapter_id: string;
					created_at?: string;
					id?: string;
					text?: Json;
					verse_number: number;
				};
				Update: {
					chapter_id?: string;
					created_at?: string;
					id?: string;
					text?: Json;
					verse_number?: number;
				};
				Relationships: [
					{
						foreignKeyName: "bible_verses_chapter_id_fkey";
						columns: ["chapter_id"];
						isOneToOne: false;
						referencedRelation: "bible_chapters";
						referencedColumns: ["id"];
					},
				];
			};
			bot_sessions: {
				Row: {
					created_at: string | null;
					id: string;
					session: string | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id: string;
					session?: string | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					session?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			campaign_goal_changes: {
				Row: {
					campaign_id: string;
					changed_at: string;
					changed_by: string;
					created_at: string;
					id: string;
					new_goal_amount: number;
					old_goal_amount: number;
					reason: string;
				};
				Insert: {
					campaign_id: string;
					changed_at?: string;
					changed_by: string;
					created_at?: string;
					id?: string;
					new_goal_amount: number;
					old_goal_amount: number;
					reason: string;
				};
				Update: {
					campaign_id?: string;
					changed_at?: string;
					changed_by?: string;
					created_at?: string;
					id?: string;
					new_goal_amount?: number;
					old_goal_amount?: number;
					reason?: string;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_goal_changes_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "donation_campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			campaign_payment_methods: {
				Row: {
					campaign_id: string;
					church_payment_method_id: string;
					created_at: string;
					id: string;
					is_active: boolean;
				};
				Insert: {
					campaign_id: string;
					church_payment_method_id: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
				};
				Update: {
					campaign_id?: string;
					church_payment_method_id?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: "campaign_payment_methods_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "donation_campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "campaign_payment_methods_church_payment_method_id_fkey";
						columns: ["church_payment_method_id"];
						isOneToOne: false;
						referencedRelation: "church_payment_methods";
						referencedColumns: ["id"];
					},
				];
			};
			church_images: {
				Row: {
					church_id: string;
					created_at: string;
					display_order: number;
					id: string;
					image_url: string;
					updated_at: string;
				};
				Insert: {
					church_id: string;
					created_at?: string;
					display_order?: number;
					id?: string;
					image_url: string;
					updated_at?: string;
				};
				Update: {
					church_id?: string;
					created_at?: string;
					display_order?: number;
					id?: string;
					image_url?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "church_images_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
				];
			};
			church_payment_methods: {
				Row: {
					bank_account_id: string | null;
					church_id: string;
					created_at: string;
					display_order: number | null;
					id: string;
					is_active: boolean;
					payment_gateway_id: string | null;
					payment_type: string;
					updated_at: string;
				};
				Insert: {
					bank_account_id?: string | null;
					church_id: string;
					created_at?: string;
					display_order?: number | null;
					id?: string;
					is_active?: boolean;
					payment_gateway_id?: string | null;
					payment_type: string;
					updated_at?: string;
				};
				Update: {
					bank_account_id?: string | null;
					church_id?: string;
					created_at?: string;
					display_order?: number | null;
					id?: string;
					is_active?: boolean;
					payment_gateway_id?: string | null;
					payment_type?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "church_payment_methods_bank_account_id_fkey";
						columns: ["bank_account_id"];
						isOneToOne: false;
						referencedRelation: "bank_accounts";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "church_payment_methods_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "church_payment_methods_payment_gateway_id_fkey";
						columns: ["payment_gateway_id"];
						isOneToOne: false;
						referencedRelation: "payment_gateways";
						referencedColumns: ["id"];
					},
				];
			};
			church_services: {
				Row: {
					church_id: string;
					created_at: string;
					display_order: number;
					service_type_id: string;
				};
				Insert: {
					church_id: string;
					created_at?: string;
					display_order?: number;
					service_type_id: string;
				};
				Update: {
					church_id?: string;
					created_at?: string;
					display_order?: number;
					service_type_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "church_services_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "church_services_service_type_id_fkey";
						columns: ["service_type_id"];
						isOneToOne: false;
						referencedRelation: "service_types";
						referencedColumns: ["id"];
					},
				];
			};
			churches: {
				Row: {
					address: string | null;
					category: Database["public"]["Enums"]["church_category"];
					city: string | null;
					coordinates: unknown;
					country: string | null;
					cover_image_url: string | null;
					created_at: string;
					denomination: string | null;
					description: string;
					email: string | null;
					founded_year: number | null;
					id: string;
					language: string;
					location: Json | null;
					logo_url: string | null;
					name: string;
					phone_number: string;
					region_id: string | null;
					rejected_reason: string | null;
					state: string | null;
					status: Database["public"]["Enums"]["church_status"];
					subcity_id: string | null;
					updated_at: string;
					verified_at: string | null;
					verified_by: string | null;
					website: string | null;
				};
				Insert: {
					address?: string | null;
					category?: Database["public"]["Enums"]["church_category"];
					city?: string | null;
					coordinates: unknown;
					country?: string | null;
					cover_image_url?: string | null;
					created_at?: string;
					denomination?: string | null;
					description?: string;
					email?: string | null;
					founded_year?: number | null;
					id?: string;
					language?: string;
					location?: Json | null;
					logo_url?: string | null;
					name: string;
					phone_number: string;
					region_id?: string | null;
					rejected_reason?: string | null;
					state?: string | null;
					status?: Database["public"]["Enums"]["church_status"];
					subcity_id?: string | null;
					updated_at?: string;
					verified_at?: string | null;
					verified_by?: string | null;
					website?: string | null;
				};
				Update: {
					address?: string | null;
					category?: Database["public"]["Enums"]["church_category"];
					city?: string | null;
					coordinates?: unknown;
					country?: string | null;
					cover_image_url?: string | null;
					created_at?: string;
					denomination?: string | null;
					description?: string;
					email?: string | null;
					founded_year?: number | null;
					id?: string;
					language?: string;
					location?: Json | null;
					logo_url?: string | null;
					name?: string;
					phone_number?: string;
					region_id?: string | null;
					rejected_reason?: string | null;
					state?: string | null;
					status?: Database["public"]["Enums"]["church_status"];
					subcity_id?: string | null;
					updated_at?: string;
					verified_at?: string | null;
					verified_by?: string | null;
					website?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "churches_region_id_fkey";
						columns: ["region_id"];
						isOneToOne: false;
						referencedRelation: "region_categories";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "churches_subcity_id_fkey";
						columns: ["subcity_id"];
						isOneToOne: false;
						referencedRelation: "subcities";
						referencedColumns: ["id"];
					},
				];
			};
			content_item_topics: {
				Row: {
					content_item_id: string;
					created_at: string;
					topic_id: string;
				};
				Insert: {
					content_item_id: string;
					created_at?: string;
					topic_id: string;
				};
				Update: {
					content_item_id?: string;
					created_at?: string;
					topic_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "content_item_topics_content_item_id_fkey";
						columns: ["content_item_id"];
						isOneToOne: false;
						referencedRelation: "content_items";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "content_item_topics_topic_id_fkey";
						columns: ["topic_id"];
						isOneToOne: false;
						referencedRelation: "content_topics";
						referencedColumns: ["id"];
					},
				];
			};
			content_items: {
				Row: {
					approved_at: string | null;
					approved_by: string | null;
					church_id: string;
					content_type: Database["public"]["Enums"]["content_type"];
					created_at: string;
					created_by: string;
					description: string;
					id: string;
					language: string;
					like_count: number;
					published_at: string | null;
					rejected_reason: string | null;
					save_count: number;
					share_count: number;
					status: Database["public"]["Enums"]["content_status"];
					subtitle: string | null;
					thumbnail_url: string | null;
					title: string;
					updated_at: string;
					view_count: number;
				};
				Insert: {
					approved_at?: string | null;
					approved_by?: string | null;
					church_id: string;
					content_type: Database["public"]["Enums"]["content_type"];
					created_at?: string;
					created_by: string;
					description?: string;
					id?: string;
					language?: string;
					like_count?: number;
					published_at?: string | null;
					rejected_reason?: string | null;
					save_count?: number;
					share_count?: number;
					status?: Database["public"]["Enums"]["content_status"];
					subtitle?: string | null;
					thumbnail_url?: string | null;
					title?: string;
					updated_at?: string;
					view_count?: number;
				};
				Update: {
					approved_at?: string | null;
					approved_by?: string | null;
					church_id?: string;
					content_type?: Database["public"]["Enums"]["content_type"];
					created_at?: string;
					created_by?: string;
					description?: string;
					id?: string;
					language?: string;
					like_count?: number;
					published_at?: string | null;
					rejected_reason?: string | null;
					save_count?: number;
					share_count?: number;
					status?: Database["public"]["Enums"]["content_status"];
					subtitle?: string | null;
					thumbnail_url?: string | null;
					title?: string;
					updated_at?: string;
					view_count?: number;
				};
				Relationships: [
					{
						foreignKeyName: "content_items_approved_by_fkey";
						columns: ["approved_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "content_items_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "content_items_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			content_likes: {
				Row: {
					content_id: string;
					created_at: string | null;
					id: string;
					user_id: string;
				};
				Insert: {
					content_id: string;
					created_at?: string | null;
					id?: string;
					user_id: string;
				};
				Update: {
					content_id?: string;
					created_at?: string | null;
					id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "content_likes_content_id_fkey";
						columns: ["content_id"];
						isOneToOne: false;
						referencedRelation: "content_items";
						referencedColumns: ["id"];
					},
				];
			};
			content_notes: {
				Row: {
					anchor: string | null;
					body: string;
					content_item_id: string;
					created_at: string;
					id: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					anchor?: string | null;
					body: string;
					content_item_id: string;
					created_at?: string;
					id?: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					anchor?: string | null;
					body?: string;
					content_item_id?: string;
					created_at?: string;
					id?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "content_notes_content_item_id_fkey";
						columns: ["content_item_id"];
						isOneToOne: false;
						referencedRelation: "content_items";
						referencedColumns: ["id"];
					},
				];
			};
			content_saves: {
				Row: {
					content_item_id: string;
					saved_at: string;
					user_id: string;
				};
				Insert: {
					content_item_id: string;
					saved_at?: string;
					user_id: string;
				};
				Update: {
					content_item_id?: string;
					saved_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "content_saves_content_item_id_fkey";
						columns: ["content_item_id"];
						isOneToOne: false;
						referencedRelation: "content_items";
						referencedColumns: ["id"];
					},
				];
			};
			content_topics: {
				Row: {
					color: string;
					created_at: string;
					icon: string;
					id: string;
					is_active: boolean;
					name: string;
					slug: string;
					sort_order: number;
					updated_at: string;
				};
				Insert: {
					color?: string;
					created_at?: string;
					icon?: string;
					id?: string;
					is_active?: boolean;
					name: string;
					slug: string;
					sort_order?: number;
					updated_at?: string;
				};
				Update: {
					color?: string;
					created_at?: string;
					icon?: string;
					id?: string;
					is_active?: boolean;
					name?: string;
					slug?: string;
					sort_order?: number;
					updated_at?: string;
				};
				Relationships: [];
			};
			donation_allocations: {
				Row: {
					campaign_id: string;
					color: string;
					created_at: string;
					id: string;
					percentage: number;
					sort_order: number;
					title: string;
					updated_at: string;
				};
				Insert: {
					campaign_id: string;
					color?: string;
					created_at?: string;
					id?: string;
					percentage: number;
					sort_order?: number;
					title: string;
					updated_at?: string;
				};
				Update: {
					campaign_id?: string;
					color?: string;
					created_at?: string;
					id?: string;
					percentage?: number;
					sort_order?: number;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "donation_allocations_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "donation_campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			donation_campaigns: {
				Row: {
					bank_account_id: string | null;
					category_id: string | null;
					church_id: string;
					cover_image_url: string | null;
					created_at: string;
					created_by: string;
					currency: string;
					current_amount: number;
					description: string;
					end_date: string | null;
					goal_amount: number;
					id: string;
					language: string;
					rejected_reason: string | null;
					start_date: string;
					status: Database["public"]["Enums"]["campaign_status"];
					title: string;
					updated_at: string;
					verified_at: string | null;
					verified_by: string | null;
				};
				Insert: {
					bank_account_id?: string | null;
					category_id?: string | null;
					church_id: string;
					cover_image_url?: string | null;
					created_at?: string;
					created_by: string;
					currency?: string;
					current_amount?: number;
					description?: string;
					end_date?: string | null;
					goal_amount: number;
					id?: string;
					language?: string;
					rejected_reason?: string | null;
					start_date?: string;
					status?: Database["public"]["Enums"]["campaign_status"];
					title?: string;
					updated_at?: string;
					verified_at?: string | null;
					verified_by?: string | null;
				};
				Update: {
					bank_account_id?: string | null;
					category_id?: string | null;
					church_id?: string;
					cover_image_url?: string | null;
					created_at?: string;
					created_by?: string;
					currency?: string;
					current_amount?: number;
					description?: string;
					end_date?: string | null;
					goal_amount?: number;
					id?: string;
					language?: string;
					rejected_reason?: string | null;
					start_date?: string;
					status?: Database["public"]["Enums"]["campaign_status"];
					title?: string;
					updated_at?: string;
					verified_at?: string | null;
					verified_by?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "donation_campaigns_bank_account_id_fkey";
						columns: ["bank_account_id"];
						isOneToOne: false;
						referencedRelation: "bank_accounts";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "donation_campaigns_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "donation_categories";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "donation_campaigns_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "donation_paths";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "donation_campaigns_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "donation_campaigns_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "donation_campaigns_verified_by_fkey";
						columns: ["verified_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			donation_categories: {
				Row: {
					color: string | null;
					created_at: string;
					description: string;
					icon: string | null;
					id: string;
					name: string;
					updated_at: string;
				};
				Insert: {
					color?: string | null;
					created_at?: string;
					description?: string;
					icon?: string | null;
					id?: string;
					name?: string;
					updated_at?: string;
				};
				Update: {
					color?: string | null;
					created_at?: string;
					description?: string;
					icon?: string | null;
					id?: string;
					name?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			donation_progress: {
				Row: {
					campaign_id: string;
					created_at: string;
					description: string | null;
					happened_at: string;
					icon: string;
					icon_color: string | null;
					id: string;
					is_highlight: boolean;
					title: string;
					updated_at: string;
				};
				Insert: {
					campaign_id: string;
					created_at?: string;
					description?: string | null;
					happened_at?: string;
					icon?: string;
					icon_color?: string | null;
					id?: string;
					is_highlight?: boolean;
					title: string;
					updated_at?: string;
				};
				Update: {
					campaign_id?: string;
					created_at?: string;
					description?: string | null;
					happened_at?: string;
					icon?: string;
					icon_color?: string | null;
					id?: string;
					is_highlight?: boolean;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "donation_progress_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "donation_campaigns";
						referencedColumns: ["id"];
					},
				];
			};
			donations: {
				Row: {
					amount: number;
					campaign_id: string | null;
					completed_at: string | null;
					created_at: string;
					currency: string;
					event_id: string | null;
					from_wallet: boolean;
					id: string;
					is_anonymous: boolean;
					message: string | null;
					payment_id: string | null;
					status: Database["public"]["Enums"]["donation_status"];
					user_id: string;
				};
				Insert: {
					amount: number;
					campaign_id?: string | null;
					completed_at?: string | null;
					created_at?: string;
					currency?: string;
					event_id?: string | null;
					from_wallet?: boolean;
					id?: string;
					is_anonymous?: boolean;
					message?: string | null;
					payment_id?: string | null;
					status?: Database["public"]["Enums"]["donation_status"];
					user_id: string;
				};
				Update: {
					amount?: number;
					campaign_id?: string | null;
					completed_at?: string | null;
					created_at?: string;
					currency?: string;
					event_id?: string | null;
					from_wallet?: boolean;
					id?: string;
					is_anonymous?: boolean;
					message?: string | null;
					payment_id?: string | null;
					status?: Database["public"]["Enums"]["donation_status"];
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "donations_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "donation_campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "donations_event_id_fkey";
						columns: ["event_id"];
						isOneToOne: false;
						referencedRelation: "events";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "donations_payment_id_fkey";
						columns: ["payment_id"];
						isOneToOne: false;
						referencedRelation: "payments";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "donations_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			event_categories: {
				Row: {
					color: string | null;
					created_at: string;
					description: string;
					icon: string | null;
					id: string;
					name: string;
					updated_at: string;
				};
				Insert: {
					color?: string | null;
					created_at?: string;
					description?: string;
					icon?: string | null;
					id?: string;
					name?: string;
					updated_at?: string;
				};
				Update: {
					color?: string | null;
					created_at?: string;
					description?: string;
					icon?: string | null;
					id?: string;
					name?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			event_co_hosts: {
				Row: {
					church_id: string;
					event_id: string;
					id: string;
					invited_at: string;
					invited_by: string;
					responded_at: string | null;
					responded_by: string | null;
					status: Database["public"]["Enums"]["event_co_host_status"];
				};
				Insert: {
					church_id: string;
					event_id: string;
					id?: string;
					invited_at?: string;
					invited_by: string;
					responded_at?: string | null;
					responded_by?: string | null;
					status?: Database["public"]["Enums"]["event_co_host_status"];
				};
				Update: {
					church_id?: string;
					event_id?: string;
					id?: string;
					invited_at?: string;
					invited_by?: string;
					responded_at?: string | null;
					responded_by?: string | null;
					status?: Database["public"]["Enums"]["event_co_host_status"];
				};
				Relationships: [
					{
						foreignKeyName: "event_co_hosts_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "event_co_hosts_event_id_fkey";
						columns: ["event_id"];
						isOneToOne: false;
						referencedRelation: "events";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "event_co_hosts_invited_by_fkey";
						columns: ["invited_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "event_co_hosts_responded_by_fkey";
						columns: ["responded_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			event_reminders: {
				Row: {
					created_at: string;
					event_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					event_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					event_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "event_reminders_event_id_fkey";
						columns: ["event_id"];
						isOneToOne: false;
						referencedRelation: "events";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "event_reminders_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			event_rsvps: {
				Row: {
					created_at: string;
					event_id: string;
					guest_count: number;
					id: string;
					status: Database["public"]["Enums"]["rsvp_status"];
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					event_id: string;
					guest_count?: number;
					id?: string;
					status?: Database["public"]["Enums"]["rsvp_status"];
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					event_id?: string;
					guest_count?: number;
					id?: string;
					status?: Database["public"]["Enums"]["rsvp_status"];
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "event_rsvps_event_id_fkey";
						columns: ["event_id"];
						isOneToOne: false;
						referencedRelation: "events";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "event_rsvps_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			events: {
				Row: {
					address: string | null;
					category_id: string | null;
					church_id: string;
					coordinates: unknown;
					cover_image_url: string | null;
					created_at: string;
					created_by: string;
					description: string;
					donation_currency: string | null;
					donation_current_amount: number;
					donation_goal_amount: number | null;
					end_time: string;
					has_donation: boolean;
					id: string;
					is_online: boolean;
					language: string;
					location: Json | null;
					max_attendees: number | null;
					meeting_url: string | null;
					rsvp_deadline: string | null;
					start_time: string;
					status: Database["public"]["Enums"]["event_status"];
					title: string;
					updated_at: string;
				};
				Insert: {
					address?: string | null;
					category_id?: string | null;
					church_id: string;
					coordinates?: unknown;
					cover_image_url?: string | null;
					created_at?: string;
					created_by: string;
					description?: string;
					donation_currency?: string | null;
					donation_current_amount?: number;
					donation_goal_amount?: number | null;
					end_time: string;
					has_donation?: boolean;
					id?: string;
					is_online?: boolean;
					language?: string;
					location?: Json | null;
					max_attendees?: number | null;
					meeting_url?: string | null;
					rsvp_deadline?: string | null;
					start_time: string;
					status?: Database["public"]["Enums"]["event_status"];
					title?: string;
					updated_at?: string;
				};
				Update: {
					address?: string | null;
					category_id?: string | null;
					church_id?: string;
					coordinates?: unknown;
					cover_image_url?: string | null;
					created_at?: string;
					created_by?: string;
					description?: string;
					donation_currency?: string | null;
					donation_current_amount?: number;
					donation_goal_amount?: number | null;
					end_time?: string;
					has_donation?: boolean;
					id?: string;
					is_online?: boolean;
					language?: string;
					location?: Json | null;
					max_attendees?: number | null;
					meeting_url?: string | null;
					rsvp_deadline?: string | null;
					start_time?: string;
					status?: Database["public"]["Enums"]["event_status"];
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "events_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "event_categories";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "events_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "events_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			fasting_occurrences: {
				Row: {
					created_at: string;
					end_eth_day: number | null;
					end_eth_month: number | null;
					end_eth_year: number | null;
					end_gregorian_date: string;
					ethiopian_year: number;
					fasting_id: string;
					id: string;
					notes: Json | null;
					start_eth_day: number | null;
					start_eth_month: number | null;
					start_eth_year: number | null;
					start_gregorian_date: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					end_eth_day?: number | null;
					end_eth_month?: number | null;
					end_eth_year?: number | null;
					end_gregorian_date: string;
					ethiopian_year: number;
					fasting_id: string;
					id?: string;
					notes?: Json | null;
					start_eth_day?: number | null;
					start_eth_month?: number | null;
					start_eth_year?: number | null;
					start_gregorian_date: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					end_eth_day?: number | null;
					end_eth_month?: number | null;
					end_eth_year?: number | null;
					end_gregorian_date?: string;
					ethiopian_year?: number;
					fasting_id?: string;
					id?: string;
					notes?: Json | null;
					start_eth_day?: number | null;
					start_eth_month?: number | null;
					start_eth_year?: number | null;
					start_gregorian_date?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "fasting_occurrences_fasting_id_fkey";
						columns: ["fasting_id"];
						isOneToOne: false;
						referencedRelation: "fasting_periods";
						referencedColumns: ["id"];
					},
				];
			};
			fasting_periods: {
				Row: {
					created_at: string;
					description: Json | null;
					duration_days: number | null;
					end_eth_day: number | null;
					end_eth_month: number | null;
					fasting_key: string;
					id: string;
					is_weekly: boolean;
					name: Json;
					rules: Json;
					severity: string;
					sort_order: number;
					start_eth_day: number | null;
					start_eth_month: number | null;
					type: string;
					updated_at: string;
					weekly_days: string[] | null;
				};
				Insert: {
					created_at?: string;
					description?: Json | null;
					duration_days?: number | null;
					end_eth_day?: number | null;
					end_eth_month?: number | null;
					fasting_key: string;
					id?: string;
					is_weekly?: boolean;
					name: Json;
					rules?: Json;
					severity: string;
					sort_order?: number;
					start_eth_day?: number | null;
					start_eth_month?: number | null;
					type: string;
					updated_at?: string;
					weekly_days?: string[] | null;
				};
				Update: {
					created_at?: string;
					description?: Json | null;
					duration_days?: number | null;
					end_eth_day?: number | null;
					end_eth_month?: number | null;
					fasting_key?: string;
					id?: string;
					is_weekly?: boolean;
					name?: Json;
					rules?: Json;
					severity?: string;
					sort_order?: number;
					start_eth_day?: number | null;
					start_eth_month?: number | null;
					type?: string;
					updated_at?: string;
					weekly_days?: string[] | null;
				};
				Relationships: [];
			};
			feature_flags: {
				Row: {
					church_id: string | null;
					created_at: string;
					created_by: string;
					description: Json | null;
					id: string;
					is_enabled: boolean;
					key: string;
					name: Json;
					scope: Database["public"]["Enums"]["feature_flag_scope"];
					updated_at: string;
				};
				Insert: {
					church_id?: string | null;
					created_at?: string;
					created_by: string;
					description?: Json | null;
					id?: string;
					is_enabled?: boolean;
					key: string;
					name?: Json;
					scope?: Database["public"]["Enums"]["feature_flag_scope"];
					updated_at?: string;
				};
				Update: {
					church_id?: string | null;
					created_at?: string;
					created_by?: string;
					description?: Json | null;
					id?: string;
					is_enabled?: boolean;
					key?: string;
					name?: Json;
					scope?: Database["public"]["Enums"]["feature_flag_scope"];
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "feature_flags_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "feature_flags_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			invitations: {
				Row: {
					accepted_at: string | null;
					accepted_by: string | null;
					church_id: string | null;
					created_at: string;
					expires_at: string;
					id: string;
					invited_by: string;
					phone_number: string;
					role: Database["public"]["Enums"]["user_role"];
					status: Database["public"]["Enums"]["invitation_status"];
					token: string;
				};
				Insert: {
					accepted_at?: string | null;
					accepted_by?: string | null;
					church_id?: string | null;
					created_at?: string;
					expires_at?: string;
					id?: string;
					invited_by: string;
					phone_number: string;
					role: Database["public"]["Enums"]["user_role"];
					status?: Database["public"]["Enums"]["invitation_status"];
					token: string;
				};
				Update: {
					accepted_at?: string | null;
					accepted_by?: string | null;
					church_id?: string | null;
					created_at?: string;
					expires_at?: string;
					id?: string;
					invited_by?: string;
					phone_number?: string;
					role?: Database["public"]["Enums"]["user_role"];
					status?: Database["public"]["Enums"]["invitation_status"];
					token?: string;
				};
				Relationships: [
					{
						foreignKeyName: "invitations_accepted_by_fkey";
						columns: ["accepted_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "invitations_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "invitations_invited_by_fkey";
						columns: ["invited_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			notification_reads: {
				Row: {
					id: string;
					notification_id: string;
					read_at: string;
					user_id: string;
				};
				Insert: {
					id?: string;
					notification_id: string;
					read_at?: string;
					user_id: string;
				};
				Update: {
					id?: string;
					notification_id?: string;
					read_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "notification_reads_notification_id_fkey";
						columns: ["notification_id"];
						isOneToOne: false;
						referencedRelation: "notifications";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "notification_reads_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			notifications: {
				Row: {
					body: Json;
					body_text: string | null;
					created_at: string;
					data: Json | null;
					id: string;
					is_broadcast: boolean;
					is_read: boolean;
					is_silent: boolean;
					read_at: string | null;
					sent_by: string | null;
					title: Json;
					title_text: string | null;
					type: Database["public"]["Enums"]["notification_type"];
					user_id: string | null;
				};
				Insert: {
					body?: Json;
					body_text?: string | null;
					created_at?: string;
					data?: Json | null;
					id?: string;
					is_broadcast?: boolean;
					is_read?: boolean;
					is_silent?: boolean;
					read_at?: string | null;
					sent_by?: string | null;
					title?: Json;
					title_text?: string | null;
					type: Database["public"]["Enums"]["notification_type"];
					user_id?: string | null;
				};
				Update: {
					body?: Json;
					body_text?: string | null;
					created_at?: string;
					data?: Json | null;
					id?: string;
					is_broadcast?: boolean;
					is_read?: boolean;
					is_silent?: boolean;
					read_at?: string | null;
					sent_by?: string | null;
					title?: Json;
					title_text?: string | null;
					type?: Database["public"]["Enums"]["notification_type"];
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "notifications_sent_by_fkey";
						columns: ["sent_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "notifications_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			payment_gateways: {
				Row: {
					api_key: string | null;
					color: string | null;
					config: Json | null;
					created_at: string;
					description: Json | null;
					display_name: Json;
					icon_url: string | null;
					id: string;
					is_active: boolean;
					name: string;
					slug: string;
					test_mode: boolean;
					updated_at: string;
					webhook_secret: string | null;
				};
				Insert: {
					api_key?: string | null;
					color?: string | null;
					config?: Json | null;
					created_at?: string;
					description?: Json | null;
					display_name?: Json;
					icon_url?: string | null;
					id?: string;
					is_active?: boolean;
					name: string;
					slug: string;
					test_mode?: boolean;
					updated_at?: string;
					webhook_secret?: string | null;
				};
				Update: {
					api_key?: string | null;
					color?: string | null;
					config?: Json | null;
					created_at?: string;
					description?: Json | null;
					display_name?: Json;
					icon_url?: string | null;
					id?: string;
					is_active?: boolean;
					name?: string;
					slug?: string;
					test_mode?: boolean;
					updated_at?: string;
					webhook_secret?: string | null;
				};
				Relationships: [];
			};
			payments: {
				Row: {
					amount: number;
					church_payment_method_id: string | null;
					completed_at: string | null;
					created_at: string;
					currency: string;
					error_message: string | null;
					failed_at: string | null;
					gateway_reference: string | null;
					gateway_response: Json | null;
					gateway_transaction_id: string | null;
					id: string;
					payment_details: Json | null;
					payment_gateway: string | null;
					payment_method: string;
					status: Database["public"]["Enums"]["donation_status"];
					user_id: string;
				};
				Insert: {
					amount: number;
					church_payment_method_id?: string | null;
					completed_at?: string | null;
					created_at?: string;
					currency?: string;
					error_message?: string | null;
					failed_at?: string | null;
					gateway_reference?: string | null;
					gateway_response?: Json | null;
					gateway_transaction_id?: string | null;
					id?: string;
					payment_details?: Json | null;
					payment_gateway?: string | null;
					payment_method: string;
					status?: Database["public"]["Enums"]["donation_status"];
					user_id: string;
				};
				Update: {
					amount?: number;
					church_payment_method_id?: string | null;
					completed_at?: string | null;
					created_at?: string;
					currency?: string;
					error_message?: string | null;
					failed_at?: string | null;
					gateway_reference?: string | null;
					gateway_response?: Json | null;
					gateway_transaction_id?: string | null;
					id?: string;
					payment_details?: Json | null;
					payment_gateway?: string | null;
					payment_method?: string;
					status?: Database["public"]["Enums"]["donation_status"];
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "payments_church_payment_method_id_fkey";
						columns: ["church_payment_method_id"];
						isOneToOne: false;
						referencedRelation: "church_payment_methods";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "payments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			point_transactions: {
				Row: {
					amount: number;
					created_at: string | null;
					description: string | null;
					id: string;
					reference_id: string | null;
					type: string;
					user_id: string;
				};
				Insert: {
					amount: number;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					reference_id?: string | null;
					type: string;
					user_id: string;
				};
				Update: {
					amount?: number;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					reference_id?: string | null;
					type?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "point_transactions_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			profiles: {
				Row: {
					anonymous_giving: boolean;
					avatar_url: string | null;
					bio: string | null;
					city: string | null;
					country: string | null;
					created_at: string;
					date_of_birth: string | null;
					email: string | null;
					email_verified: boolean;
					first_name: string | null;
					gender: string | null;
					id: string;
					language_preference: string | null;
					last_name: string | null;
					notification_enabled: boolean;
					phone_number: string | null;
					phone_verified: boolean;
					points: number | null;
					referral_code: string | null;
					referred_by: string | null;
					status: Database["public"]["Enums"]["user_account_status"];
					updated_at: string;
				};
				Insert: {
					anonymous_giving?: boolean;
					avatar_url?: string | null;
					bio?: string | null;
					city?: string | null;
					country?: string | null;
					created_at?: string;
					date_of_birth?: string | null;
					email?: string | null;
					email_verified?: boolean;
					first_name?: string | null;
					gender?: string | null;
					id: string;
					language_preference?: string | null;
					last_name?: string | null;
					notification_enabled?: boolean;
					phone_number?: string | null;
					phone_verified?: boolean;
					points?: number | null;
					referral_code?: string | null;
					referred_by?: string | null;
					status?: Database["public"]["Enums"]["user_account_status"];
					updated_at?: string;
				};
				Update: {
					anonymous_giving?: boolean;
					avatar_url?: string | null;
					bio?: string | null;
					city?: string | null;
					country?: string | null;
					created_at?: string;
					date_of_birth?: string | null;
					email?: string | null;
					email_verified?: boolean;
					first_name?: string | null;
					gender?: string | null;
					id?: string;
					language_preference?: string | null;
					last_name?: string | null;
					notification_enabled?: boolean;
					phone_number?: string | null;
					phone_verified?: boolean;
					points?: number | null;
					referral_code?: string | null;
					referred_by?: string | null;
					status?: Database["public"]["Enums"]["user_account_status"];
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "profiles_referred_by_fkey";
						columns: ["referred_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			push_tokens: {
				Row: {
					created_at: string;
					device_id: string | null;
					id: string;
					is_active: boolean;
					platform: string;
					token: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					device_id?: string | null;
					id?: string;
					is_active?: boolean;
					platform: string;
					token: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					device_id?: string | null;
					id?: string;
					is_active?: boolean;
					platform?: string;
					token?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "push_tokens_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			referrals: {
				Row: {
					completed_at: string | null;
					created_at: string | null;
					id: string;
					points_awarded: number;
					referred_id: string;
					referrer_id: string;
					status: string;
				};
				Insert: {
					completed_at?: string | null;
					created_at?: string | null;
					id?: string;
					points_awarded?: number;
					referred_id: string;
					referrer_id: string;
					status?: string;
				};
				Update: {
					completed_at?: string | null;
					created_at?: string | null;
					id?: string;
					points_awarded?: number;
					referred_id?: string;
					referrer_id?: string;
					status?: string;
				};
				Relationships: [
					{
						foreignKeyName: "referrals_referred_id_fkey";
						columns: ["referred_id"];
						isOneToOne: true;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "referrals_referrer_id_fkey";
						columns: ["referrer_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			region_categories: {
				Row: {
					color_end: string;
					color_start: string;
					created_at: string;
					description: Json | null;
					display_name: Json;
					display_order: number;
					id: string;
					is_active: boolean;
					name: string;
					slug: string;
					updated_at: string;
				};
				Insert: {
					color_end: string;
					color_start: string;
					created_at?: string;
					description?: Json | null;
					display_name?: Json;
					display_order?: number;
					id?: string;
					is_active?: boolean;
					name: string;
					slug: string;
					updated_at?: string;
				};
				Update: {
					color_end?: string;
					color_start?: string;
					created_at?: string;
					description?: Json | null;
					display_name?: Json;
					display_order?: number;
					id?: string;
					is_active?: boolean;
					name?: string;
					slug?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			report_reasons: {
				Row: {
					created_at: string;
					description: Json | null;
					id: string;
					is_active: boolean;
					label: Json;
					reason_key: string;
					sort_order: number;
					target_type: Database["public"]["Enums"]["report_target_type"];
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description?: Json | null;
					id?: string;
					is_active?: boolean;
					label: Json;
					reason_key: string;
					sort_order?: number;
					target_type: Database["public"]["Enums"]["report_target_type"];
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: Json | null;
					id?: string;
					is_active?: boolean;
					label?: Json;
					reason_key?: string;
					sort_order?: number;
					target_type?: Database["public"]["Enums"]["report_target_type"];
					updated_at?: string;
				};
				Relationships: [];
			};
			reports: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					reason_key: string;
					reporter_id: string;
					resolution_note: string | null;
					resolved_at: string | null;
					resolved_by: string | null;
					status: Database["public"]["Enums"]["report_status"];
					target_id: string;
					target_type: Database["public"]["Enums"]["report_target_type"];
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					reason_key: string;
					reporter_id: string;
					resolution_note?: string | null;
					resolved_at?: string | null;
					resolved_by?: string | null;
					status?: Database["public"]["Enums"]["report_status"];
					target_id: string;
					target_type: Database["public"]["Enums"]["report_target_type"];
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					reason_key?: string;
					reporter_id?: string;
					resolution_note?: string | null;
					resolved_at?: string | null;
					resolved_by?: string | null;
					status?: Database["public"]["Enums"]["report_status"];
					target_id?: string;
					target_type?: Database["public"]["Enums"]["report_target_type"];
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "reports_reason_fk";
						columns: ["target_type", "reason_key"];
						isOneToOne: false;
						referencedRelation: "report_reasons";
						referencedColumns: ["target_type", "reason_key"];
					},
					{
						foreignKeyName: "reports_reporter_id_fkey";
						columns: ["reporter_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "reports_resolved_by_fkey";
						columns: ["resolved_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			role_permissions: {
				Row: {
					id: number;
					permission: Database["public"]["Enums"]["app_permission"];
					role: Database["public"]["Enums"]["user_role"];
				};
				Insert: {
					id?: number;
					permission: Database["public"]["Enums"]["app_permission"];
					role: Database["public"]["Enums"]["user_role"];
				};
				Update: {
					id?: number;
					permission?: Database["public"]["Enums"]["app_permission"];
					role?: Database["public"]["Enums"]["user_role"];
				};
				Relationships: [];
			};
			room_content: {
				Row: {
					actual_start_time: string | null;
					cover_image_url: string | null;
					end_time: string | null;
					hms_room_id: string | null;
					hms_template_id: string | null;
					id: string;
					max_duration_seconds: number;
					max_speakers: number | null;
					recording_enabled: boolean;
					recording_url: string | null;
					room_status: Database["public"]["Enums"]["room_status"];
					scheduled_start_time: string | null;
					stream_key: string | null;
				};
				Insert: {
					actual_start_time?: string | null;
					cover_image_url?: string | null;
					end_time?: string | null;
					hms_room_id?: string | null;
					hms_template_id?: string | null;
					id: string;
					max_duration_seconds?: number;
					max_speakers?: number | null;
					recording_enabled?: boolean;
					recording_url?: string | null;
					room_status?: Database["public"]["Enums"]["room_status"];
					scheduled_start_time?: string | null;
					stream_key?: string | null;
				};
				Update: {
					actual_start_time?: string | null;
					cover_image_url?: string | null;
					end_time?: string | null;
					hms_room_id?: string | null;
					hms_template_id?: string | null;
					id?: string;
					max_duration_seconds?: number;
					max_speakers?: number | null;
					recording_enabled?: boolean;
					recording_url?: string | null;
					room_status?: Database["public"]["Enums"]["room_status"];
					scheduled_start_time?: string | null;
					stream_key?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "room_content_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "content_items";
						referencedColumns: ["id"];
					},
				];
			};
			room_participants: {
				Row: {
					id: string;
					joined_at: string;
					left_at: string | null;
					role: Database["public"]["Enums"]["room_participant_role"];
					room_id: string;
					user_id: string;
				};
				Insert: {
					id?: string;
					joined_at?: string;
					left_at?: string | null;
					role?: Database["public"]["Enums"]["room_participant_role"];
					room_id: string;
					user_id: string;
				};
				Update: {
					id?: string;
					joined_at?: string;
					left_at?: string | null;
					role?: Database["public"]["Enums"]["room_participant_role"];
					room_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "room_participants_room_id_fkey";
						columns: ["room_id"];
						isOneToOne: false;
						referencedRelation: "room_content";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "room_participants_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			scheduled_donations: {
				Row: {
					amount: number;
					campaign_id: string | null;
					created_at: string;
					currency: string;
					end_date: string | null;
					event_id: string | null;
					frequency: string;
					id: string;
					is_active: boolean;
					next_donation_date: string;
					updated_at: string;
					use_wallet: boolean;
					user_id: string;
				};
				Insert: {
					amount: number;
					campaign_id?: string | null;
					created_at?: string;
					currency?: string;
					end_date?: string | null;
					event_id?: string | null;
					frequency: string;
					id?: string;
					is_active?: boolean;
					next_donation_date: string;
					updated_at?: string;
					use_wallet?: boolean;
					user_id: string;
				};
				Update: {
					amount?: number;
					campaign_id?: string | null;
					created_at?: string;
					currency?: string;
					end_date?: string | null;
					event_id?: string | null;
					frequency?: string;
					id?: string;
					is_active?: boolean;
					next_donation_date?: string;
					updated_at?: string;
					use_wallet?: boolean;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "scheduled_donations_campaign_id_fkey";
						columns: ["campaign_id"];
						isOneToOne: false;
						referencedRelation: "donation_campaigns";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "scheduled_donations_event_id_fkey";
						columns: ["event_id"];
						isOneToOne: false;
						referencedRelation: "events";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "scheduled_donations_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			service_settings: {
				Row: {
					key: string;
					updated_at: string;
					value: Json;
				};
				Insert: {
					key: string;
					updated_at?: string;
					value: Json;
				};
				Update: {
					key?: string;
					updated_at?: string;
					value?: Json;
				};
				Relationships: [];
			};
			service_types: {
				Row: {
					applicable_to: Database["public"]["Enums"]["church_category"][];
					created_at: string;
					icon: string | null;
					id: string;
					key: string;
					name: Json;
					updated_at: string;
				};
				Insert: {
					applicable_to?: Database["public"]["Enums"]["church_category"][];
					created_at?: string;
					icon?: string | null;
					id?: string;
					key: string;
					name: Json;
					updated_at?: string;
				};
				Update: {
					applicable_to?: Database["public"]["Enums"]["church_category"][];
					created_at?: string;
					icon?: string | null;
					id?: string;
					key?: string;
					name?: Json;
					updated_at?: string;
				};
				Relationships: [];
			};
			space_kicks: {
				Row: {
					id: string;
					kicked_at: string;
					kicked_by: string | null;
					reason: string | null;
					room_id: string;
					user_id: string;
				};
				Insert: {
					id?: string;
					kicked_at?: string;
					kicked_by?: string | null;
					reason?: string | null;
					room_id: string;
					user_id: string;
				};
				Update: {
					id?: string;
					kicked_at?: string;
					kicked_by?: string | null;
					reason?: string | null;
					room_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "space_kicks_kicked_by_fkey";
						columns: ["kicked_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "space_kicks_room_id_fkey";
						columns: ["room_id"];
						isOneToOne: false;
						referencedRelation: "room_content";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "space_kicks_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			space_role_assignments: {
				Row: {
					assigned_at: string;
					assigned_by: string | null;
					id: string;
					role: string;
					room_id: string;
					user_id: string;
				};
				Insert: {
					assigned_at?: string;
					assigned_by?: string | null;
					id?: string;
					role: string;
					room_id: string;
					user_id: string;
				};
				Update: {
					assigned_at?: string;
					assigned_by?: string | null;
					id?: string;
					role?: string;
					room_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "space_role_assignments_assigned_by_fkey";
						columns: ["assigned_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "space_role_assignments_room_id_fkey";
						columns: ["room_id"];
						isOneToOne: false;
						referencedRelation: "room_content";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "space_role_assignments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			story_content: {
				Row: {
					expires_at: string;
					id: string;
					media_type: string;
					media_url: string;
				};
				Insert: {
					expires_at?: string;
					id: string;
					media_type: string;
					media_url: string;
				};
				Update: {
					expires_at?: string;
					id?: string;
					media_type?: string;
					media_url?: string;
				};
				Relationships: [
					{
						foreignKeyName: "story_content_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "content_items";
						referencedColumns: ["id"];
					},
				];
			};
			subcities: {
				Row: {
					created_at: string;
					display_name: Json;
					display_order: number;
					id: string;
					is_active: boolean;
					name: string;
					region_id: string;
					slug: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					display_name?: Json;
					display_order?: number;
					id?: string;
					is_active?: boolean;
					name: string;
					region_id: string;
					slug: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					display_name?: Json;
					display_order?: number;
					id?: string;
					is_active?: boolean;
					name?: string;
					region_id?: string;
					slug?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "subcities_region_id_fkey";
						columns: ["region_id"];
						isOneToOne: false;
						referencedRelation: "region_categories";
						referencedColumns: ["id"];
					},
				];
			};
			user_follows: {
				Row: {
					church_id: string;
					followed_at: string;
					id: string;
					is_favorite: boolean;
					user_id: string;
				};
				Insert: {
					church_id: string;
					followed_at?: string;
					id?: string;
					is_favorite?: boolean;
					user_id: string;
				};
				Update: {
					church_id?: string;
					followed_at?: string;
					id?: string;
					is_favorite?: boolean;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_follows_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_follows_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			user_preferences: {
				Row: {
					created_at: string;
					id: string;
					notify_achievements: boolean;
					notify_co_hosting: boolean;
					notify_content_review: boolean;
					notify_donations: boolean;
					notify_events: boolean;
					notify_fasting: boolean;
					notify_followers: boolean;
					notify_new_content: boolean;
					notify_reminders: boolean;
					notify_reports: boolean;
					notify_rsvp: boolean;
					notify_verse_of_day: boolean;
					notify_wallet: boolean;
					theme_preference: Json;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					id: string;
					notify_achievements?: boolean;
					notify_co_hosting?: boolean;
					notify_content_review?: boolean;
					notify_donations?: boolean;
					notify_events?: boolean;
					notify_fasting?: boolean;
					notify_followers?: boolean;
					notify_new_content?: boolean;
					notify_reminders?: boolean;
					notify_reports?: boolean;
					notify_rsvp?: boolean;
					notify_verse_of_day?: boolean;
					notify_wallet?: boolean;
					theme_preference?: Json;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					notify_achievements?: boolean;
					notify_co_hosting?: boolean;
					notify_content_review?: boolean;
					notify_donations?: boolean;
					notify_events?: boolean;
					notify_fasting?: boolean;
					notify_followers?: boolean;
					notify_new_content?: boolean;
					notify_reminders?: boolean;
					notify_reports?: boolean;
					notify_rsvp?: boolean;
					notify_verse_of_day?: boolean;
					notify_wallet?: boolean;
					theme_preference?: Json;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_preferences_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			user_roles: {
				Row: {
					assigned_at: string;
					assigned_by: string | null;
					church_id: string | null;
					id: string;
					role: Database["public"]["Enums"]["user_role"];
					user_id: string;
				};
				Insert: {
					assigned_at?: string;
					assigned_by?: string | null;
					church_id?: string | null;
					id?: string;
					role: Database["public"]["Enums"]["user_role"];
					user_id: string;
				};
				Update: {
					assigned_at?: string;
					assigned_by?: string | null;
					church_id?: string | null;
					id?: string;
					role?: Database["public"]["Enums"]["user_role"];
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_roles_assigned_by_fkey";
						columns: ["assigned_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_roles_church_id_fkey";
						columns: ["church_id"];
						isOneToOne: false;
						referencedRelation: "churches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_roles_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			user_status_log: {
				Row: {
					changed_by: string;
					created_at: string;
					id: string;
					new_status: Database["public"]["Enums"]["user_account_status"];
					old_status: Database["public"]["Enums"]["user_account_status"] | null;
					reason: string | null;
					user_id: string;
				};
				Insert: {
					changed_by: string;
					created_at?: string;
					id?: string;
					new_status: Database["public"]["Enums"]["user_account_status"];
					old_status?:
						| Database["public"]["Enums"]["user_account_status"]
						| null;
					reason?: string | null;
					user_id: string;
				};
				Update: {
					changed_by?: string;
					created_at?: string;
					id?: string;
					new_status?: Database["public"]["Enums"]["user_account_status"];
					old_status?:
						| Database["public"]["Enums"]["user_account_status"]
						| null;
					reason?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_status_log_changed_by_fkey";
						columns: ["changed_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_status_log_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			user_wallets: {
				Row: {
					balance: number;
					created_at: string;
					currency: string;
					id: string;
					is_active: boolean;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					balance?: number;
					created_at?: string;
					currency?: string;
					id?: string;
					is_active?: boolean;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					balance?: number;
					created_at?: string;
					currency?: string;
					id?: string;
					is_active?: boolean;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_wallets_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: true;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			verse_of_the_day: {
				Row: {
					created_at: string;
					created_by: string | null;
					id: string;
					scheduled_date: string;
					verse_id: string;
				};
				Insert: {
					created_at?: string;
					created_by?: string | null;
					id?: string;
					scheduled_date: string;
					verse_id: string;
				};
				Update: {
					created_at?: string;
					created_by?: string | null;
					id?: string;
					scheduled_date?: string;
					verse_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "verse_of_the_day_verse_id_fkey";
						columns: ["verse_id"];
						isOneToOne: false;
						referencedRelation: "bible_verses";
						referencedColumns: ["id"];
					},
				];
			};
			video_content: {
				Row: {
					aspect_ratio: string | null;
					duration_seconds: number | null;
					file_size_bytes: number | null;
					id: string;
					linked_bible_reference: string | null;
					resolution: string | null;
					video_url: string;
				};
				Insert: {
					aspect_ratio?: string | null;
					duration_seconds?: number | null;
					file_size_bytes?: number | null;
					id: string;
					linked_bible_reference?: string | null;
					resolution?: string | null;
					video_url: string;
				};
				Update: {
					aspect_ratio?: string | null;
					duration_seconds?: number | null;
					file_size_bytes?: number | null;
					id?: string;
					linked_bible_reference?: string | null;
					resolution?: string | null;
					video_url?: string;
				};
				Relationships: [
					{
						foreignKeyName: "video_content_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "content_items";
						referencedColumns: ["id"];
					},
				];
			};
			video_lessons: {
				Row: {
					created_at: string;
					description: string | null;
					duration_minutes: number | null;
					id: string;
					is_current: boolean;
					sort_order: number;
					title: string;
					updated_at: string;
					video_content_id: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					duration_minutes?: number | null;
					id?: string;
					is_current?: boolean;
					sort_order?: number;
					title: string;
					updated_at?: string;
					video_content_id: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					duration_minutes?: number | null;
					id?: string;
					is_current?: boolean;
					sort_order?: number;
					title?: string;
					updated_at?: string;
					video_content_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "video_lessons_video_content_id_fkey";
						columns: ["video_content_id"];
						isOneToOne: false;
						referencedRelation: "video_content";
						referencedColumns: ["id"];
					},
				];
			};
			wallet_transactions: {
				Row: {
					amount: number;
					completed_at: string | null;
					created_at: string;
					currency: string;
					description: string | null;
					id: string;
					metadata: Json | null;
					reference_id: string | null;
					reference_type: string | null;
					status: Database["public"]["Enums"]["wallet_transaction_status"];
					transaction_type: Database["public"]["Enums"]["wallet_transaction_type"];
					wallet_id: string;
				};
				Insert: {
					amount: number;
					completed_at?: string | null;
					created_at?: string;
					currency?: string;
					description?: string | null;
					id?: string;
					metadata?: Json | null;
					reference_id?: string | null;
					reference_type?: string | null;
					status?: Database["public"]["Enums"]["wallet_transaction_status"];
					transaction_type: Database["public"]["Enums"]["wallet_transaction_type"];
					wallet_id: string;
				};
				Update: {
					amount?: number;
					completed_at?: string | null;
					created_at?: string;
					currency?: string;
					description?: string | null;
					id?: string;
					metadata?: Json | null;
					reference_id?: string | null;
					reference_type?: string | null;
					status?: Database["public"]["Enums"]["wallet_transaction_status"];
					transaction_type?: Database["public"]["Enums"]["wallet_transaction_type"];
					wallet_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "wallet_transactions_wallet_id_fkey";
						columns: ["wallet_id"];
						isOneToOne: false;
						referencedRelation: "user_wallets";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			donation_paths: {
				Row: {
					active_campaign_count: number | null;
					color: string | null;
					description: string | null;
					icon: string | null;
					id: string | null;
					name: string | null;
					total_goal: number | null;
					total_raised: number | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			_fasting_is_weekly_excluded: {
				Args: { d: string; p_eth_year: number; p_rules: Json };
				Returns: boolean;
			};
			_notif_en_am_plain: {
				Args: { p_lang: string; p_text: string };
				Returns: Json;
			};
			_notif_pick_text: {
				Args: { p_jsonb: Json; p_lang: string };
				Returns: string;
			};
			accept_invitation: {
				Args: { accepting_user_id: string; invitation_token: string };
				Returns: Json;
			};
			assign_member_role: {
				Args: {
					p_church_id: string;
					p_role: Database["public"]["Enums"]["user_role"];
					p_user_id: string;
				};
				Returns: string;
			};
			authorize: {
				Args: {
					requested_permission: Database["public"]["Enums"]["app_permission"];
				};
				Returns: boolean;
			};
			can_report_target: {
				Args: {
					p_target_id: string;
					p_target_type: Database["public"]["Enums"]["report_target_type"];
					p_user: string;
				};
				Returns: boolean;
			};
			can_review_report: {
				Args: {
					p_target_id: string;
					p_target_type: Database["public"]["Enums"]["report_target_type"];
					p_user: string;
				};
				Returns: boolean;
			};
			change_member_role: {
				Args: {
					new_role: string;
					old_role: string;
					requester_id: string;
					target_church_id: string;
					target_user_id: string;
				};
				Returns: Json;
			};
			check_phone_exists: { Args: { phone_number: string }; Returns: boolean };
			cleanup_old_bot_sessions: { Args: never; Returns: undefined };
			clear_favorite_church: { Args: never; Returns: undefined };
			close_completed_events: { Args: never; Returns: undefined };
			create_notification: {
				Args: {
					p_body: Json;
					p_data?: Json;
					p_pref_category?: string;
					p_title: Json;
					p_type: Database["public"]["Enums"]["notification_type"];
					p_user_id: string;
				};
				Returns: string;
			};
			custom_access_token_hook: { Args: { event: Json }; Returns: Json };
			decrement_like_count: {
				Args: { content_id: string };
				Returns: undefined;
			};
			diagnose_push_trigger: {
				Args: never;
				Returns: {
					check_name: string;
					status: string;
					value: string;
				}[];
			};
			ethiopian_to_gregorian: {
				Args: { eth_day: number; eth_month: number; eth_year: number };
				Returns: string;
			};
			ethiopian_year_of: { Args: { d: string }; Returns: number };
			expire_old_invitations: { Args: never; Returns: undefined };
			expire_old_stories: { Args: never; Returns: undefined };
			extract_church_coordinates: {
				Args: never;
				Returns: {
					address: string;
					category: string;
					city: string;
					coordinates: unknown;
					country: string;
					cover_image_url: string;
					created_at: string;
					denomination: string;
					description: string;
					email: string;
					founded_year: number;
					id: string;
					language: string;
					latitude: number;
					location: Json;
					logo_url: string;
					longitude: number;
					name: string;
					phone_number: string;
					region_id: string;
					rejected_reason: string;
					state: string;
					status: Database["public"]["Enums"]["church_status"];
					subcity_id: string;
					updated_at: string;
					verified_at: string;
					verified_by: string;
					website: string;
				}[];
			};
			fn_send_event_reminders: { Args: never; Returns: undefined };
			fn_send_fasting_reminders: { Args: never; Returns: undefined };
			fn_send_verse_of_the_day: { Args: never; Returns: undefined };
			generate_referral_code: { Args: never; Returns: string };
			get_active_fasts: {
				Args: { d: string };
				Returns: {
					description: Json;
					fasting_id: string;
					fasting_key: string;
					is_weekly: boolean;
					name: Json;
					occurrence_end: string;
					occurrence_start: string;
					rules: Json;
					severity: string;
					type: string;
				}[];
			};
			get_campaign_donor_summaries: {
				Args: { p_campaign_ids: string[] };
				Returns: {
					campaign_id: string;
					donor_count: number;
					donor_samples: Json;
				}[];
			};
			get_campaign_donors: {
				Args: { p_campaign_id: string; p_limit?: number };
				Returns: {
					amount: number;
					avatar: string;
					created_at: string;
					id: string;
					is_anonymous: boolean;
					name: string;
				}[];
			};
			get_church_admin_ids: {
				Args: { p_church_id: string };
				Returns: string[];
			};
			get_church_admin_only_ids: {
				Args: { p_church_id: string };
				Returns: string[];
			};
			get_church_follower_ids: {
				Args: { p_church_id: string };
				Returns: string[];
			};
			get_donation_paths_with_campaigns: {
				Args: { limit_per_path?: number };
				Returns: {
					active_campaign_count: number;
					campaigns: Json;
					path_color: string;
					path_description: string;
					path_icon: string;
					path_id: string;
					path_name: string;
				}[];
			};
			get_fasts_in_range: {
				Args: { p_end: string; p_start: string };
				Returns: {
					d: string;
					fasting_keys: string[];
					is_fasting: boolean;
					names: Json;
					tier: string;
				}[];
			};
			get_followed_churches: {
				Args: { check_user_id: string };
				Returns: {
					church_id: string;
					church_logo_url: string;
					church_name: string;
					followed_at: string;
				}[];
			};
			get_linked_bible_reference: {
				Args: { p_content_item_id: string };
				Returns: string;
			};
			get_nearby_churches: {
				Args: { radius_km?: number; user_lat: number; user_lng: number };
				Returns: {
					address: string;
					category: string;
					city: string;
					coordinates: unknown;
					country: string;
					cover_image_url: string;
					created_at: string;
					description: string;
					distance_km: number;
					email: string;
					founded_year: number;
					id: string;
					language: string;
					latitude: number;
					location: Json;
					logo_url: string;
					longitude: number;
					name: string;
					phone_number: string;
					region_id: string;
					rejected_reason: string;
					state: string;
					status: string;
					subcity_id: string;
					updated_at: string;
					verified_at: string;
					verified_by: string;
					website: string;
				}[];
			};
			get_or_create_referral_code: {
				Args: { p_user_id: string };
				Returns: string;
			};
			get_teachings_feed: {
				Args: {
					p_content_type?: string;
					p_limit?: number;
					p_offset?: number;
					p_saved_only?: boolean;
					p_topic_slug?: string;
				};
				Returns: {
					article_body: string;
					article_read_minutes: number;
					audio_duration: number;
					audio_url: string;
					church_id: string;
					church_logo_url: string;
					church_name: string;
					content_type: string;
					created_at: string;
					description: string;
					id: string;
					is_liked: boolean;
					is_saved: boolean;
					language: string;
					like_count: number;
					save_count: number;
					share_count: number;
					subtitle: string;
					thumbnail_url: string;
					title: string;
					topic_names: string[];
					topic_slugs: string[];
					video_duration: number;
					video_url: string;
					view_count: number;
				}[];
			};
			get_user_churches: {
				Args: { check_user_id: string };
				Returns: {
					church_id: string;
					church_logo_url: string;
					church_name: string;
					user_role: Database["public"]["Enums"]["user_role"];
				}[];
			};
			get_user_wallet_balance: {
				Args: { check_user_id: string };
				Returns: number;
			};
			get_verse_of_day: {
				Args: never;
				Returns: {
					book_id: string;
					book_name: Json;
					book_number: number;
					chapter_id: string;
					chapter_number: number;
					testament: string;
					verse_id: string;
					verse_number: number;
					verse_text: Json;
				}[];
			};
			gregorian_to_ethiopian: {
				Args: { d: string };
				Returns: {
					day: number;
					month: number;
					year: number;
				}[];
			};
			increment_content_view_count: {
				Args: { content_id: string };
				Returns: undefined;
			};
			increment_like_count: {
				Args: { content_id: string };
				Returns: undefined;
			};
			is_admin: { Args: { check_user_id: string }; Returns: boolean };
			is_church_admin: {
				Args: { church_id: string; user_id: string };
				Returns: boolean;
			};
			is_content_admin: {
				Args: { church_id: string; user_id: string };
				Returns: boolean;
			};
			is_content_creator: {
				Args: { church_id: string; user_id: string };
				Returns: boolean;
			};
			is_fasting_day: { Args: { d: string }; Returns: boolean };
			is_space_moderator: {
				Args: { p_room_id: string; p_user_id: string };
				Returns: boolean;
			};
			is_super_admin: { Args: { user_id: string }; Returns: boolean };
			list_expired_active_spaces: {
				Args: never;
				Returns: {
					actual_start_time: string;
					hms_room_id: string;
					max_duration_seconds: number;
					room_id: string;
				}[];
			};
			lookup_phone_profile: { Args: { phone_number: string }; Returns: Json };
			lookup_referral_code: { Args: { p_code: string }; Returns: Json };
			process_referral: {
				Args: { p_referred_user_id: string; p_referrer_code: string };
				Returns: Json;
			};
			process_scheduled_donation: {
				Args: { scheduled_donation_id: string };
				Returns: Json;
			};
			remove_church_member: {
				Args: {
					requester_id: string;
					target_church_id: string;
					target_user_id: string;
				};
				Returns: Json;
			};
			report_target_church: {
				Args: {
					p_target_id: string;
					p_target_type: Database["public"]["Enums"]["report_target_type"];
				};
				Returns: string;
			};
			search_bible_books: {
				Args: { search_query: string };
				Returns: {
					book_number: number;
					category: string;
					chapter_count: number;
					created_at: string;
					id: string;
					name: Json;
					paratext_code: string;
					testament: string;
				}[];
				SetofOptions: {
					from: "*";
					to: "bible_books";
					isOneToOne: false;
					isSetofReturn: true;
				};
			};
			search_bible_verses_text: {
				Args: {
					lang?: string;
					lim?: number;
					off_set?: number;
					search_query: string;
				};
				Returns: {
					book_id: string;
					book_name: Json;
					book_number: number;
					chapter_count: number;
					chapter_id: string;
					chapter_number: number;
					testament: string;
					text: Json;
					verse_count: number;
					verse_id: string;
					verse_number: number;
				}[];
			};
			search_campaigns: {
				Args: {
					p_category?: string;
					p_church?: string;
					p_limit?: number;
					p_offset?: number;
					search?: string;
				};
				Returns: {
					bank_account_id: string;
					category_id: string;
					category_name: string;
					church_address: string;
					church_city: string;
					church_country: string;
					church_id: string;
					church_name: string;
					church_state: string;
					cover_image_url: string;
					created_at: string;
					created_by: string;
					currency: string;
					current_amount: number;
					description: string;
					end_date: string;
					goal_amount: number;
					id: string;
					language: string;
					rejected_reason: string;
					start_date: string;
					status: Database["public"]["Enums"]["campaign_status"];
					title: string;
					updated_at: string;
					verified_at: string;
					verified_by: string;
				}[];
			};
			search_churches: {
				Args: {
					p_category?: string;
					p_limit?: number;
					p_offset?: number;
					search?: string;
				};
				Returns: {
					address: string;
					category: string;
					city: string;
					coordinates: unknown;
					country: string;
					cover_image_url: string;
					created_at: string;
					description: string;
					email: string;
					founded_year: number;
					id: string;
					language: string;
					latitude: number;
					location: Json;
					logo_url: string;
					longitude: number;
					name: string;
					phone_number: string;
					region_id: string;
					rejected_reason: string;
					state: string;
					status: Database["public"]["Enums"]["church_status"];
					subcity_id: string;
					updated_at: string;
					verified_at: string;
					verified_by: string;
					website: string;
				}[];
			};
			search_events: {
				Args: {
					p_category?: string;
					p_limit?: number;
					p_offset?: number;
					search?: string;
				};
				Returns: {
					address: string;
					category_id: string;
					church_id: string;
					church_name: string;
					coordinates: unknown;
					cover_image_url: string;
					created_at: string;
					created_by: string;
					description: string;
					donation_currency: string;
					donation_current_amount: number;
					donation_goal_amount: number;
					end_time: string;
					has_donation: boolean;
					id: string;
					is_online: boolean;
					language: string;
					location: Json;
					max_attendees: number;
					meeting_url: string;
					rsvp_deadline: string;
					start_time: string;
					status: Database["public"]["Enums"]["event_status"];
					title: string;
					updated_at: string;
				}[];
			};
			send_sms_hook: { Args: { event: Json }; Returns: Json };
			set_favorite_church: {
				Args: { target_church_id: string };
				Returns: string;
			};
			should_send_push: {
				Args: { p_category: string; p_user_id: string };
				Returns: boolean;
			};
			show_limit: { Args: never; Returns: number };
			show_trgm: { Args: { "": string }; Returns: string[] };
			toggle_content_save: {
				Args: { p_content_item_id: string };
				Returns: boolean;
			};
			user_has_church_role: {
				Args: {
					p_church_id: string;
					p_role: Database["public"]["Enums"]["user_role"];
					p_user_id: string;
				};
				Returns: boolean;
			};
			user_has_role: {
				Args: {
					p_role: Database["public"]["Enums"]["user_role"];
					p_user_id: string;
				};
				Returns: boolean;
			};
			user_has_role_in_church: {
				Args: {
					check_church_id: string;
					check_role: Database["public"]["Enums"]["user_role"];
					check_user_id: string;
				};
				Returns: boolean;
			};
			verify_otp_hook: { Args: { event: Json }; Returns: Json };
		};
		Enums: {
			app_permission:
				| "content.create"
				| "content.update"
				| "content.delete"
				| "content.approve"
				| "church.manage"
				| "users.manage"
				| "donations.manage"
				| "events.manage";
			campaign_status:
				| "draft"
				| "active"
				| "paused"
				| "completed"
				| "cancelled";
			church_category: "church" | "monastery" | "female-monastery";
			church_status: "pending" | "approved" | "rejected" | "suspended";
			content_status:
				| "draft"
				| "pending_approval"
				| "approved"
				| "rejected"
				| "archived";
			content_type: "audio" | "video" | "room" | "article" | "story" | "short";
			donation_status: "pending" | "completed" | "failed" | "refunded";
			event_co_host_status: "pending" | "accepted" | "declined";
			event_status: "draft" | "published" | "cancelled" | "completed";
			feature_flag_scope: "global" | "church";
			invitation_status: "pending" | "accepted" | "declined" | "expired";
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
				| "new_event"
				| "event_cancelled"
				| "new_rsvp"
				| "rsvp_confirmed"
				| "rsvp_updated"
				| "rsvp_cancelled"
				| "new_donation"
				| "donation_milestone"
				| "donation_goal_reached"
				| "donation_exceeded"
				| "campaign_goal_changed"
				| "new_campaign"
				| "content_pending"
				| "co_host_invited"
				| "co_host_accepted"
				| "co_host_declined"
				| "new_follower"
				| "wallet_deposit"
				| "wallet_withdrawal"
				| "event_reminder_24h"
				| "event_reminder_1h"
				| "fasting_reminder"
				| "report_submitted";
			report_status:
				| "pending"
				| "reviewing"
				| "resolved"
				| "dismissed"
				| "action_taken";
			report_target_type: "event" | "donation" | "content" | "church";
			room_participant_role: "host" | "speaker" | "listener";
			room_status: "scheduled" | "live" | "ended" | "cancelled";
			rsvp_status: "going" | "maybe" | "not_going";
			user_account_status: "active" | "inactive" | "suspended" | "banned";
			user_role:
				| "super_admin"
				| "admin"
				| "manager"
				| "editor"
				| "contributor"
				| "viewer";
			wallet_transaction_status:
				| "pending"
				| "completed"
				| "failed"
				| "cancelled";
			wallet_transaction_type: "deposit" | "withdrawal" | "refund" | "donation";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			app_permission: [
				"content.create",
				"content.update",
				"content.delete",
				"content.approve",
				"church.manage",
				"users.manage",
				"donations.manage",
				"events.manage",
			],
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
			content_type: ["audio", "video", "room", "article", "story", "short"],
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
				"new_event",
				"event_cancelled",
				"new_rsvp",
				"rsvp_confirmed",
				"rsvp_updated",
				"rsvp_cancelled",
				"new_donation",
				"donation_milestone",
				"donation_goal_reached",
				"donation_exceeded",
				"campaign_goal_changed",
				"new_campaign",
				"content_pending",
				"co_host_invited",
				"co_host_accepted",
				"co_host_declined",
				"new_follower",
				"wallet_deposit",
				"wallet_withdrawal",
				"event_reminder_24h",
				"event_reminder_1h",
				"fasting_reminder",
				"report_submitted",
			],
			report_status: [
				"pending",
				"reviewing",
				"resolved",
				"dismissed",
				"action_taken",
			],
			report_target_type: ["event", "donation", "content", "church"],
			room_participant_role: ["host", "speaker", "listener"],
			room_status: ["scheduled", "live", "ended", "cancelled"],
			rsvp_status: ["going", "maybe", "not_going"],
			user_account_status: ["active", "inactive", "suspended", "banned"],
			user_role: [
				"super_admin",
				"admin",
				"manager",
				"editor",
				"contributor",
				"viewer",
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
} as const;
