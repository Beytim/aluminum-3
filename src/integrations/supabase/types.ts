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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      product_bom: {
        Row: {
          component_type: Database["public"]["Enums"]["bom_component_type"]
          created_at: string
          id: string
          inventory_item_id: string | null
          name: string
          product_id: string
          quantity: number
          sort_order: number | null
          total: number
          unit: string
          unit_cost: number
        }
        Insert: {
          component_type: Database["public"]["Enums"]["bom_component_type"]
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          name: string
          product_id: string
          quantity?: number
          sort_order?: number | null
          total?: number
          unit?: string
          unit_cost?: number
        }
        Update: {
          component_type?: Database["public"]["Enums"]["bom_component_type"]
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          name?: string
          product_id?: string
          quantity?: number
          sort_order?: number | null
          total?: number
          unit?: string
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_bom_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_price_history: {
        Row: {
          changed_by: string | null
          changed_by_name: string | null
          cost_price: number
          created_at: string
          id: string
          product_id: string
          reason: string | null
          selling_price: number
        }
        Insert: {
          changed_by?: string | null
          changed_by_name?: string | null
          cost_price: number
          created_at?: string
          id?: string
          product_id: string
          reason?: string | null
          selling_price: number
        }
        Update: {
          changed_by?: string | null
          changed_by_name?: string | null
          cost_price?: number
          created_at?: string
          id?: string
          product_id?: string
          reason?: string | null
          selling_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_quality_standards: {
        Row: {
          created_at: string
          id: string
          parameter: string
          product_id: string
          specification: string
          test_method: string | null
          tolerance: string
        }
        Insert: {
          created_at?: string
          id?: string
          parameter: string
          product_id: string
          specification: string
          test_method?: string | null
          tolerance?: string
        }
        Update: {
          created_at?: string
          id?: string
          parameter?: string
          product_id?: string
          specification?: string
          test_method?: string | null
          tolerance?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_quality_standards_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          accessories_cost: number
          alloy_type: string | null
          batch_number: string | null
          category: Database["public"]["Enums"]["product_category"]
          code: string
          colors: string[] | null
          created_at: string
          created_by: string | null
          current_stock: number
          date_received: string | null
          defect_rate: number | null
          diameter: number | null
          effective_date: string | null
          fab_labor_cost: number
          form: string | null
          glass: string | null
          glass_cost: number
          hardware_cost: number
          height: number | null
          id: string
          inspection_required: boolean
          install_labor_cost: number
          labor_hrs: number
          lead_time_days: number | null
          length: number | null
          markup_percent: number | null
          material_cost: number
          max_stock: number
          mill_certificate: boolean | null
          min_stock: number
          moq: number | null
          name: string
          name_am: string
          notes: string | null
          overhead_percent: number
          product_type: Database["public"]["Enums"]["product_type"]
          profile: string | null
          profile_cost: number
          purchase_price: number | null
          reserved_stock: number
          selling_price: number
          status: Database["public"]["Enums"]["product_status"]
          subcategory: string | null
          supplier_id: string | null
          supplier_name: string | null
          tags: string[] | null
          temper: string | null
          thickness: number | null
          unit: string
          updated_at: string
          updated_by: string | null
          version: string
          wall_thickness: number | null
          warehouse_location: string | null
          weight_per_meter: number | null
          weight_per_piece: number | null
          width: number | null
        }
        Insert: {
          accessories_cost?: number
          alloy_type?: string | null
          batch_number?: string | null
          category: Database["public"]["Enums"]["product_category"]
          code: string
          colors?: string[] | null
          created_at?: string
          created_by?: string | null
          current_stock?: number
          date_received?: string | null
          defect_rate?: number | null
          diameter?: number | null
          effective_date?: string | null
          fab_labor_cost?: number
          form?: string | null
          glass?: string | null
          glass_cost?: number
          hardware_cost?: number
          height?: number | null
          id?: string
          inspection_required?: boolean
          install_labor_cost?: number
          labor_hrs?: number
          lead_time_days?: number | null
          length?: number | null
          markup_percent?: number | null
          material_cost?: number
          max_stock?: number
          mill_certificate?: boolean | null
          min_stock?: number
          moq?: number | null
          name: string
          name_am?: string
          notes?: string | null
          overhead_percent?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          profile?: string | null
          profile_cost?: number
          purchase_price?: number | null
          reserved_stock?: number
          selling_price?: number
          status?: Database["public"]["Enums"]["product_status"]
          subcategory?: string | null
          supplier_id?: string | null
          supplier_name?: string | null
          tags?: string[] | null
          temper?: string | null
          thickness?: number | null
          unit?: string
          updated_at?: string
          updated_by?: string | null
          version?: string
          wall_thickness?: number | null
          warehouse_location?: string | null
          weight_per_meter?: number | null
          weight_per_piece?: number | null
          width?: number | null
        }
        Update: {
          accessories_cost?: number
          alloy_type?: string | null
          batch_number?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          code?: string
          colors?: string[] | null
          created_at?: string
          created_by?: string | null
          current_stock?: number
          date_received?: string | null
          defect_rate?: number | null
          diameter?: number | null
          effective_date?: string | null
          fab_labor_cost?: number
          form?: string | null
          glass?: string | null
          glass_cost?: number
          hardware_cost?: number
          height?: number | null
          id?: string
          inspection_required?: boolean
          install_labor_cost?: number
          labor_hrs?: number
          lead_time_days?: number | null
          length?: number | null
          markup_percent?: number | null
          material_cost?: number
          max_stock?: number
          mill_certificate?: boolean | null
          min_stock?: number
          moq?: number | null
          name?: string
          name_am?: string
          notes?: string | null
          overhead_percent?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          profile?: string | null
          profile_cost?: number
          purchase_price?: number | null
          reserved_stock?: number
          selling_price?: number
          status?: Database["public"]["Enums"]["product_status"]
          subcategory?: string | null
          supplier_id?: string | null
          supplier_name?: string | null
          tags?: string[] | null
          temper?: string | null
          thickness?: number | null
          unit?: string
          updated_at?: string
          updated_by?: string | null
          version?: string
          wall_thickness?: number | null
          warehouse_location?: string | null
          weight_per_meter?: number | null
          weight_per_piece?: number | null
          width?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved: boolean
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "user"
      bom_component_type:
        | "Profile"
        | "Hardware"
        | "Glass"
        | "Accessory"
        | "Other"
      product_category:
        | "Windows"
        | "Doors"
        | "Curtain Walls"
        | "Handrails"
        | "Louvers"
        | "Partitions"
        | "Sheet"
        | "Plate"
        | "Bar/Rod"
        | "Tube/Pipe"
        | "Angle"
        | "Channel"
        | "Beam"
        | "Profile"
        | "Coil"
        | "Custom"
      product_status: "Active" | "Inactive" | "Discontinued" | "Draft"
      product_type: "Raw Material" | "Fabricated" | "System" | "Custom"
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
      app_role: ["admin", "manager", "user"],
      bom_component_type: [
        "Profile",
        "Hardware",
        "Glass",
        "Accessory",
        "Other",
      ],
      product_category: [
        "Windows",
        "Doors",
        "Curtain Walls",
        "Handrails",
        "Louvers",
        "Partitions",
        "Sheet",
        "Plate",
        "Bar/Rod",
        "Tube/Pipe",
        "Angle",
        "Channel",
        "Beam",
        "Profile",
        "Coil",
        "Custom",
      ],
      product_status: ["Active", "Inactive", "Discontinued", "Draft"],
      product_type: ["Raw Material", "Fabricated", "System", "Custom"],
    },
  },
} as const
