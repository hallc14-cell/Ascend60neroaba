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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      push_subscriptions: {
        Row: {
          alarm_mode: boolean
          auth: string
          created_at: string
          device_secret: string
          endpoint: string
          from_hour: number
          id: string
          last_sent_at: string | null
          last_task_key: string | null
          p256dh: string
          start_date: string | null
          task_reminders: boolean
          timezone: string
          to_hour: number
          user_agent: string | null
        }
        Insert: {
          alarm_mode?: boolean
          auth: string
          created_at?: string
          device_secret: string
          endpoint: string
          from_hour?: number
          id?: string
          last_sent_at?: string | null
          last_task_key?: string | null
          p256dh: string
          start_date?: string | null
          task_reminders?: boolean
          timezone?: string
          to_hour?: number
          user_agent?: string | null
        }
        Update: {
          alarm_mode?: boolean
          auth?: string
          created_at?: string
          device_secret?: string
          endpoint?: string
          from_hour?: number
          id?: string
          last_sent_at?: string | null
          last_task_key?: string | null
          p256dh?: string
          start_date?: string | null
          task_reminders?: boolean
          timezone?: string
          to_hour?: number
          user_agent?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          addiction_type: string
          protocol_id: string
          program_start_date: string | null
          primary_triggers: string[]
          preferred_coping: string[]
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          addiction_type?: string
          protocol_id?: string
          program_start_date?: string | null
          primary_triggers?: string[]
          preferred_coping?: string[]
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          addiction_type?: string
          protocol_id?: string
          program_start_date?: string | null
          primary_triggers?: string[]
          preferred_coping?: string[]
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          protocol_id: string
          state: Json
          start_date: string | null
          total_xp: number
          streak: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          protocol_id?: string
          state?: Json
          start_date?: string | null
          total_xp?: number
          streak?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          protocol_id?: string
          state?: Json
          start_date?: string | null
          total_xp?: number
          streak?: number
          updated_at?: string
        }
        Relationships: []
      }
      task_history: {
        Row: {
          id: string
          user_id: string
          protocol_id: string
          task_id: string
          task_date: string
          completed: boolean
          xp: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          protocol_id?: string
          task_id: string
          task_date: string
          completed?: boolean
          xp?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          protocol_id?: string
          task_id?: string
          task_date?: string
          completed?: boolean
          xp?: number
          created_at?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          enabled: boolean
          from_hour: number
          to_hour: number
          alarm_mode: boolean
          task_reminders: boolean
          timezone: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          enabled?: boolean
          from_hour?: number
          to_hour?: number
          alarm_mode?: boolean
          task_reminders?: boolean
          timezone?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          enabled?: boolean
          from_hour?: number
          to_hour?: number
          alarm_mode?: boolean
          task_reminders?: boolean
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      push_devices: {
        Row: {
          id: string
          user_id: string
          onesignal_player_id: string | null
          platform: string | null
          user_agent: string | null
          last_seen_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          onesignal_player_id?: string | null
          platform?: string | null
          user_agent?: string | null
          last_seen_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          onesignal_player_id?: string | null
          platform?: string | null
          user_agent?: string | null
          last_seen_at?: string
          created_at?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          id: string
          user_id: string | null
          channel: string
          title: string
          body: string | null
          success: boolean
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          channel: string
          title: string
          body?: string | null
          success?: boolean
          error?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          channel?: string
          title?: string
          body?: string | null
          success?: boolean
          error?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_device_secret: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
