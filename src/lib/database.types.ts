export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      reviewer_saves: {
        Row: {
          id: number;
          device_id: string;
          payload: Json;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          device_id: string;
          payload: Json;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          device_id?: string;
          payload?: Json;
          updated_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: number;
          source_id: number;
          stem: string;
          choices: string[];
          answer: number;
          explanation: string;
          rationales: string[];
          component: string;
          topic: string;
          topic_group: string;
          subtopic: string | null;
          difficulty: "easy" | "medium" | "hard";
          bloom: string | null;
          competency: string | null;
          source: string | null;
          source_version: string | null;
          source_verification_level: string | null;
          reviewer_status: string | null;
          last_verified: string | null;
          date_added: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          source_id: number;
          stem: string;
          choices: string[];
          answer: number;
          explanation: string;
          rationales: string[];
          component: string;
          topic: string;
          topic_group: string;
          subtopic?: string | null;
          difficulty: "easy" | "medium" | "hard";
          bloom?: string | null;
          competency?: string | null;
          source?: string | null;
          source_version?: string | null;
          source_verification_level?: string | null;
          reviewer_status?: string | null;
          last_verified?: string | null;
          date_added?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          source_id?: number;
          stem?: string;
          choices?: string[];
          answer?: number;
          explanation?: string;
          rationales?: string[];
          component?: string;
          topic?: string;
          topic_group?: string;
          subtopic?: string | null;
          difficulty?: "easy" | "medium" | "hard";
          bloom?: string | null;
          competency?: string | null;
          source?: string | null;
          source_version?: string | null;
          source_verification_level?: string | null;
          reviewer_status?: string | null;
          last_verified?: string | null;
          date_added?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
