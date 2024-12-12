export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaign_analytics: {
        Row: {
          browser_info: Json | null
          campaign_id: string
          clicked_at: string | null
          contact_id: string
          created_at: string
          device_info: Json | null
          id: string
          location_info: Json | null
          opened_at: string | null
        }
        Insert: {
          browser_info?: Json | null
          campaign_id: string
          clicked_at?: string | null
          contact_id: string
          created_at?: string
          device_info?: Json | null
          id?: string
          location_info?: Json | null
          opened_at?: string | null
        }
        Update: {
          browser_info?: Json | null
          campaign_id?: string
          clicked_at?: string | null
          contact_id?: string
          created_at?: string
          device_info?: Json | null
          id?: string
          location_info?: Json | null
          opened_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_analytics_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sends: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string
          id: string
          message_id: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string
          id?: string
          message_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string
          id?: string
          message_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sends_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          clicks_count: number | null
          completed_at: string | null
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          opens_count: number | null
          performance_metrics: Json | null
          schedule_at: string | null
          sent_count: number | null
          status: string
          subject: string
          total_recipients: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clicks_count?: number | null
          completed_at?: string | null
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          opens_count?: number | null
          performance_metrics?: Json | null
          schedule_at?: string | null
          sent_count?: number | null
          status?: string
          subject: string
          total_recipients?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clicks_count?: number | null
          completed_at?: string | null
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          opens_count?: number | null
          performance_metrics?: Json | null
          schedule_at?: string | null
          sent_count?: number | null
          status?: string
          subject?: string
          total_recipients?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          bounce_count: number | null
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          last_emailed_at: string | null
          metadata: Json | null
          name: string | null
          status: string
          tags: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bounce_count?: number | null
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          last_emailed_at?: string | null
          metadata?: Json | null
          name?: string | null
          status?: string
          tags?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bounce_count?: number | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          last_emailed_at?: string | null
          metadata?: Json | null
          name?: string | null
          status?: string
          tags?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string | null
          dkim_verified: boolean | null
          dmarc_verified: boolean | null
          dns_records: Json | null
          domain: string
          id: string
          spf_verified: boolean | null
          status: string
          updated_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          dkim_verified?: boolean | null
          dmarc_verified?: boolean | null
          dns_records?: Json | null
          domain: string
          id?: string
          spf_verified?: boolean | null
          status?: string
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          dkim_verified?: boolean | null
          dmarc_verified?: boolean | null
          dns_records?: Json | null
          domain?: string
          id?: string
          spf_verified?: boolean | null
          status?: string
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string | null
          id: string
          message_id: string | null
          sent_at: string | null
          status: string
          subject: string
          to_email: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id?: string | null
          sent_at?: string | null
          status: string
          subject: string
          to_email: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          to_email?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          content: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          subject: string | null
          updated_at: string | null
          user_id: string | null
          variables: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
          variables?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          daily_email_limit: number | null
          deleted_at: string | null
          email: string
          id: string
          monthly_email_limit: number | null
          photo_url: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          daily_email_limit?: number | null
          deleted_at?: string | null
          email: string
          id?: string
          monthly_email_limit?: number | null
          photo_url?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          daily_email_limit?: number | null
          deleted_at?: string | null
          email?: string
          id?: string
          monthly_email_limit?: number | null
          photo_url?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_current_user_id: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      update_campaign_with_recipients: {
        Args: {
          p_campaign_id: string
          p_user_id: string
          p_campaign_data: Json
          p_recipients: string[]
        }
        Returns: undefined
      }
    }
    Enums: {
      campaign_status:
        | "draft"
        | "scheduled"
        | "sending"
        | "completed"
        | "paused"
      contact_status: "active" | "unsubscribed" | "bounced" | "complained"
      email_status: "draft" | "queued" | "sent" | "failed" | "bounced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
