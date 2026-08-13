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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
