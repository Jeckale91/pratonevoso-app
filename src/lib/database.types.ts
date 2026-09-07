export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "allievo" | "maestro" | "admin";
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type SheetStatus = "assigned" | "in_progress" | "completed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: UserRole;
          level_id: string | null;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          level_id?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: UserRole;
          level_id?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_level_id_fkey";
            columns: ["level_id"];
            isOneToOne: false;
            referencedRelation: "levels";
            referencedColumns: ["id"];
          },
        ];
      };
      levels: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          sort_order: number;
          color: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          color?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          color?: string | null;
        };
        Relationships: [];
      };
      maestro_allievo: {
        Row: {
          id: string;
          maestro_id: string;
          allievo_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          maestro_id: string;
          allievo_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          maestro_id?: string;
          allievo_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "maestro_allievo_maestro_id_fkey";
            columns: ["maestro_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "maestro_allievo_allievo_id_fkey";
            columns: ["allievo_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          maestro_id: string;
          level_id: string | null;
          starts_at: string;
          ends_at: string;
          capacity: number;
          location: string | null;
          lesson_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          maestro_id: string;
          level_id?: string | null;
          starts_at: string;
          ends_at: string;
          capacity?: number;
          location?: string | null;
          lesson_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          maestro_id?: string;
          level_id?: string | null;
          starts_at?: string;
          ends_at?: string;
          capacity?: number;
          location?: string | null;
          lesson_type?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_maestro_id_fkey";
            columns: ["maestro_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lessons_level_id_fkey";
            columns: ["level_id"];
            isOneToOne: false;
            referencedRelation: "levels";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          id: string;
          lesson_id: string;
          allievo_id: string;
          status: BookingStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          allievo_id: string;
          status?: BookingStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          allievo_id?: string;
          status?: BookingStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_allievo_id_fkey";
            columns: ["allievo_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      sheet_templates: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content: Json;
          level_id: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          content?: Json;
          level_id?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          content?: Json;
          level_id?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sheet_templates_level_id_fkey";
            columns: ["level_id"];
            isOneToOne: false;
            referencedRelation: "levels";
            referencedColumns: ["id"];
          },
        ];
      };
      sheets: {
        Row: {
          id: string;
          template_id: string | null;
          allievo_id: string;
          maestro_id: string;
          title: string;
          content: Json;
          status: SheetStatus;
          assigned_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          template_id?: string | null;
          allievo_id: string;
          maestro_id: string;
          title: string;
          content?: Json;
          status?: SheetStatus;
          assigned_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          template_id?: string | null;
          allievo_id?: string;
          maestro_id?: string;
          title?: string;
          content?: Json;
          status?: SheetStatus;
          assigned_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sheets_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "sheet_templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sheets_allievo_id_fkey";
            columns: ["allievo_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sheets_maestro_id_fkey";
            columns: ["maestro_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
        };
        Relationships: [];
      };
      badge_awards: {
        Row: {
          id: string;
          badge_id: string;
          allievo_id: string;
          awarded_by: string;
          note: string | null;
          awarded_at: string;
        };
        Insert: {
          id?: string;
          badge_id: string;
          allievo_id: string;
          awarded_by: string;
          note?: string | null;
          awarded_at?: string;
        };
        Update: {
          id?: string;
          badge_id?: string;
          allievo_id?: string;
          awarded_by?: string;
          note?: string | null;
          awarded_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "badge_awards_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "badge_awards_allievo_id_fkey";
            columns: ["allievo_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "badge_awards_awarded_by_fkey";
            columns: ["awarded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          subject: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          profile_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          profile_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          profile_id?: string;
          joined_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversation_participants_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          body?: string;
          created_at?: string;
          read_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      sheet_status: SheetStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
