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
      customers: {
        Row: {
          address: string | null
          city: string | null
          code: string
          contact: string
          created_at: string
          created_by: string | null
          credit_limit: number | null
          customer_since: string | null
          email: string | null
          health_score: number | null
          health_status: string | null
          id: string
          language: Database["public"]["Enums"]["customer_language"] | null
          last_activity_date: string | null
          last_activity_type: string | null
          name: string
          name_am: string
          notes: string | null
          outstanding: number | null
          payment_terms: string | null
          phone: string
          phone_secondary: string | null
          preferred_contact:
            | Database["public"]["Enums"]["preferred_contact"]
            | null
          projects_count: number | null
          referred_by: string | null
          segments: string[] | null
          shipping_address: string | null
          source: string | null
          status: Database["public"]["Enums"]["customer_status"]
          sub_city: string | null
          tags: string[] | null
          tax_id: string | null
          total_value: number | null
          type: Database["public"]["Enums"]["customer_type"]
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code: string
          contact: string
          created_at?: string
          created_by?: string | null
          credit_limit?: number | null
          customer_since?: string | null
          email?: string | null
          health_score?: number | null
          health_status?: string | null
          id?: string
          language?: Database["public"]["Enums"]["customer_language"] | null
          last_activity_date?: string | null
          last_activity_type?: string | null
          name: string
          name_am?: string
          notes?: string | null
          outstanding?: number | null
          payment_terms?: string | null
          phone: string
          phone_secondary?: string | null
          preferred_contact?:
            | Database["public"]["Enums"]["preferred_contact"]
            | null
          projects_count?: number | null
          referred_by?: string | null
          segments?: string[] | null
          shipping_address?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          sub_city?: string | null
          tags?: string[] | null
          tax_id?: string | null
          total_value?: number | null
          type?: Database["public"]["Enums"]["customer_type"]
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string
          contact?: string
          created_at?: string
          created_by?: string | null
          credit_limit?: number | null
          customer_since?: string | null
          email?: string | null
          health_score?: number | null
          health_status?: string | null
          id?: string
          language?: Database["public"]["Enums"]["customer_language"] | null
          last_activity_date?: string | null
          last_activity_type?: string | null
          name?: string
          name_am?: string
          notes?: string | null
          outstanding?: number | null
          payment_terms?: string | null
          phone?: string
          phone_secondary?: string | null
          preferred_contact?:
            | Database["public"]["Enums"]["preferred_contact"]
            | null
          projects_count?: number | null
          referred_by?: string | null
          segments?: string[] | null
          shipping_address?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          sub_city?: string | null
          tags?: string[] | null
          tax_id?: string | null
          total_value?: number | null
          type?: Database["public"]["Enums"]["customer_type"]
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          batch_number: string | null
          bin: string | null
          created_at: string
          created_by: string | null
          id: string
          is_remnant: boolean
          is_reusable: boolean | null
          item_code: string
          notes: string | null
          original_length: number | null
          parent_item_id: string | null
          product_id: string | null
          quality_status: Database["public"]["Enums"]["inventory_quality_status"]
          rack: string | null
          received_date: string | null
          remaining_length: number | null
          reserved: number
          shelf: string | null
          status: Database["public"]["Enums"]["inventory_item_status"]
          stock: number
          supplier_batch: string | null
          unit_cost: number
          updated_at: string
          updated_by: string | null
          warehouse: string | null
          zone: string | null
        }
        Insert: {
          batch_number?: string | null
          bin?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_remnant?: boolean
          is_reusable?: boolean | null
          item_code: string
          notes?: string | null
          original_length?: number | null
          parent_item_id?: string | null
          product_id?: string | null
          quality_status?: Database["public"]["Enums"]["inventory_quality_status"]
          rack?: string | null
          received_date?: string | null
          remaining_length?: number | null
          reserved?: number
          shelf?: string | null
          status?: Database["public"]["Enums"]["inventory_item_status"]
          stock?: number
          supplier_batch?: string | null
          unit_cost?: number
          updated_at?: string
          updated_by?: string | null
          warehouse?: string | null
          zone?: string | null
        }
        Update: {
          batch_number?: string | null
          bin?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_remnant?: boolean
          is_reusable?: boolean | null
          item_code?: string
          notes?: string | null
          original_length?: number | null
          parent_item_id?: string | null
          product_id?: string | null
          quality_status?: Database["public"]["Enums"]["inventory_quality_status"]
          rack?: string | null
          received_date?: string | null
          remaining_length?: number | null
          reserved?: number
          shelf?: string | null
          status?: Database["public"]["Enums"]["inventory_item_status"]
          stock?: number
          supplier_batch?: string | null
          unit_cost?: number
          updated_at?: string
          updated_by?: string | null
          warehouse?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_parent_item_id_fkey"
            columns: ["parent_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          from_location: string | null
          id: string
          inventory_item_id: string
          movement_number: string
          new_stock: number
          notes: string | null
          previous_stock: number
          quantity: number
          source_id: string | null
          source_type: string | null
          to_location: string | null
          type: Database["public"]["Enums"]["inventory_movement_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          from_location?: string | null
          id?: string
          inventory_item_id: string
          movement_number: string
          new_stock: number
          notes?: string | null
          previous_stock: number
          quantity: number
          source_id?: string | null
          source_type?: string | null
          to_location?: string | null
          type: Database["public"]["Enums"]["inventory_movement_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          from_location?: string | null
          id?: string
          inventory_item_id?: string
          movement_number?: string
          new_stock?: number
          notes?: string | null
          previous_stock?: number
          quantity?: number
          source_id?: string | null
          source_type?: string | null
          to_location?: string | null
          type?: Database["public"]["Enums"]["inventory_movement_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
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
      suppliers: {
        Row: {
          address: string | null
          approved: boolean
          average_lead_time: number
          average_order_value: number
          bank_account: string | null
          bank_name: string | null
          business_type: Database["public"]["Enums"]["supplier_business_type"]
          certifications: string[] | null
          city: string | null
          company_name: string
          company_name_am: string
          contact_person: string
          country: string
          created_at: string
          created_by: string | null
          credit_limit: number
          credit_used: number
          currency: Database["public"]["Enums"]["proc_currency"]
          email: string
          id: string
          last_order_date: string | null
          min_order_qty: number | null
          notes: string | null
          on_time_delivery_rate: number
          payment_terms: Database["public"]["Enums"]["payment_terms"]
          phone: string
          phone_secondary: string | null
          position: string | null
          preferred: boolean
          product_categories: string[] | null
          quality_rating: number
          rating: number
          response_time_hrs: number
          shipping_terms: string[] | null
          status: Database["public"]["Enums"]["supplier_status"]
          supplier_code: string
          swift_code: string | null
          tax_id: string | null
          total_orders: number
          total_spent: number
          trading_name: string | null
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          approved?: boolean
          average_lead_time?: number
          average_order_value?: number
          bank_account?: string | null
          bank_name?: string | null
          business_type?: Database["public"]["Enums"]["supplier_business_type"]
          certifications?: string[] | null
          city?: string | null
          company_name: string
          company_name_am?: string
          contact_person?: string
          country?: string
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          credit_used?: number
          currency?: Database["public"]["Enums"]["proc_currency"]
          email?: string
          id?: string
          last_order_date?: string | null
          min_order_qty?: number | null
          notes?: string | null
          on_time_delivery_rate?: number
          payment_terms?: Database["public"]["Enums"]["payment_terms"]
          phone?: string
          phone_secondary?: string | null
          position?: string | null
          preferred?: boolean
          product_categories?: string[] | null
          quality_rating?: number
          rating?: number
          response_time_hrs?: number
          shipping_terms?: string[] | null
          status?: Database["public"]["Enums"]["supplier_status"]
          supplier_code: string
          swift_code?: string | null
          tax_id?: string | null
          total_orders?: number
          total_spent?: number
          trading_name?: string | null
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          approved?: boolean
          average_lead_time?: number
          average_order_value?: number
          bank_account?: string | null
          bank_name?: string | null
          business_type?: Database["public"]["Enums"]["supplier_business_type"]
          certifications?: string[] | null
          city?: string | null
          company_name?: string
          company_name_am?: string
          contact_person?: string
          country?: string
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          credit_used?: number
          currency?: Database["public"]["Enums"]["proc_currency"]
          email?: string
          id?: string
          last_order_date?: string | null
          min_order_qty?: number | null
          notes?: string | null
          on_time_delivery_rate?: number
          payment_terms?: Database["public"]["Enums"]["payment_terms"]
          phone?: string
          phone_secondary?: string | null
          position?: string | null
          preferred?: boolean
          product_categories?: string[] | null
          quality_rating?: number
          rating?: number
          response_time_hrs?: number
          shipping_terms?: string[] | null
          status?: Database["public"]["Enums"]["supplier_status"]
          supplier_code?: string
          swift_code?: string | null
          tax_id?: string | null
          total_orders?: number
          total_spent?: number
          trading_name?: string | null
          updated_at?: string
          updated_by?: string | null
          website?: string | null
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
      customer_language: "en" | "am" | "both"
      customer_status: "Active" | "Inactive"
      customer_type:
        | "Individual"
        | "Company"
        | "Contractor"
        | "Developer"
        | "Retail"
        | "Wholesale"
        | "Fabricator"
        | "Distributor"
      inventory_item_status: "active" | "inactive" | "discontinued" | "obsolete"
      inventory_movement_type:
        | "receipt"
        | "issue"
        | "transfer"
        | "adjustment"
        | "return"
        | "damaged"
        | "count"
      inventory_quality_status:
        | "quarantine"
        | "approved"
        | "rejected"
        | "returned"
      payment_terms:
        | "COD"
        | "Net 15"
        | "Net 30"
        | "Net 45"
        | "Net 60"
        | "LC"
        | "TT Advance"
        | "TT Partial"
      preferred_contact:
        | "phone"
        | "email"
        | "whatsapp"
        | "in-person"
        | "telegram"
      proc_currency: "ETB" | "USD" | "EUR" | "CNY" | "GBP" | "AED" | "TRY"
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
      supplier_business_type:
        | "Manufacturer"
        | "Distributor"
        | "Agent"
        | "Trader"
        | "Importer"
      supplier_status:
        | "Active"
        | "Inactive"
        | "Blacklisted"
        | "Pending"
        | "Prospect"
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
      customer_language: ["en", "am", "both"],
      customer_status: ["Active", "Inactive"],
      customer_type: [
        "Individual",
        "Company",
        "Contractor",
        "Developer",
        "Retail",
        "Wholesale",
        "Fabricator",
        "Distributor",
      ],
      inventory_item_status: ["active", "inactive", "discontinued", "obsolete"],
      inventory_movement_type: [
        "receipt",
        "issue",
        "transfer",
        "adjustment",
        "return",
        "damaged",
        "count",
      ],
      inventory_quality_status: [
        "quarantine",
        "approved",
        "rejected",
        "returned",
      ],
      payment_terms: [
        "COD",
        "Net 15",
        "Net 30",
        "Net 45",
        "Net 60",
        "LC",
        "TT Advance",
        "TT Partial",
      ],
      preferred_contact: [
        "phone",
        "email",
        "whatsapp",
        "in-person",
        "telegram",
      ],
      proc_currency: ["ETB", "USD", "EUR", "CNY", "GBP", "AED", "TRY"],
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
      supplier_business_type: [
        "Manufacturer",
        "Distributor",
        "Agent",
        "Trader",
        "Importer",
      ],
      supplier_status: [
        "Active",
        "Inactive",
        "Blacklisted",
        "Pending",
        "Prospect",
      ],
    },
  },
} as const
