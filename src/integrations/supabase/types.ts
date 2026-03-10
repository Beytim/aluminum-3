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
      customer_complaints: {
        Row: {
          activity_log: Json
          category: string
          channel: string
          complaint_number: string
          cost_of_resolution: number
          created_at: string
          created_by: string
          customer_id: string | null
          customer_name: string
          customer_satisfaction: number | null
          date: string
          description: string
          id: string
          installation_id: string | null
          ncr_id: string | null
          ncr_number: string | null
          notes: string | null
          order_id: string | null
          order_number: string | null
          product_id: string | null
          product_name: string | null
          received_by: string
          resolution: string | null
          resolved: boolean
          resolved_by: string | null
          resolved_date: string | null
          responded: boolean
          responded_date: string | null
          response_deadline: string | null
          response_notes: string | null
          response_required: boolean
          severity: Database["public"]["Enums"]["complaint_severity"]
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          activity_log?: Json
          category?: string
          channel?: string
          complaint_number: string
          cost_of_resolution?: number
          created_at?: string
          created_by?: string
          customer_id?: string | null
          customer_name?: string
          customer_satisfaction?: number | null
          date?: string
          description?: string
          id?: string
          installation_id?: string | null
          ncr_id?: string | null
          ncr_number?: string | null
          notes?: string | null
          order_id?: string | null
          order_number?: string | null
          product_id?: string | null
          product_name?: string | null
          received_by?: string
          resolution?: string | null
          resolved?: boolean
          resolved_by?: string | null
          resolved_date?: string | null
          responded?: boolean
          responded_date?: string | null
          response_deadline?: string | null
          response_notes?: string | null
          response_required?: boolean
          severity?: Database["public"]["Enums"]["complaint_severity"]
          status?: string
          subject?: string
          updated_at?: string
        }
        Update: {
          activity_log?: Json
          category?: string
          channel?: string
          complaint_number?: string
          cost_of_resolution?: number
          created_at?: string
          created_by?: string
          customer_id?: string | null
          customer_name?: string
          customer_satisfaction?: number | null
          date?: string
          description?: string
          id?: string
          installation_id?: string | null
          ncr_id?: string | null
          ncr_number?: string | null
          notes?: string | null
          order_id?: string | null
          order_number?: string | null
          product_id?: string | null
          product_name?: string | null
          received_by?: string
          resolution?: string | null
          resolved?: boolean
          resolved_by?: string | null
          resolved_date?: string | null
          responded?: boolean
          responded_date?: string | null
          response_deadline?: string | null
          response_notes?: string | null
          response_required?: boolean
          severity?: Database["public"]["Enums"]["complaint_severity"]
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_complaints_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_complaints_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      cutting_jobs: {
        Row: {
          alloy_type: string | null
          assignee: string | null
          created_at: string
          created_by: string | null
          cuts: number[] | null
          efficiency: number | null
          end_time: string | null
          id: string
          inventory_item_id: string | null
          job_number: string
          labor_cost: number | null
          machine: string | null
          material_category: string | null
          material_cost: number | null
          material_name: string | null
          notes: string | null
          optimization_layout: Json | null
          optimized: boolean | null
          priority: Database["public"]["Enums"]["work_order_priority"]
          quality_checked: boolean | null
          quality_notes: string | null
          quality_result:
            | Database["public"]["Enums"]["quality_check_result"]
            | null
          remnants: Json | null
          scheduled_date: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["cutting_job_status"]
          stock_length: number | null
          stocks_used: number | null
          temper: string | null
          total_cut_length: number | null
          total_cuts: number | null
          updated_at: string
          waste: number | null
          waste_cost: number | null
          waste_percent: number | null
          work_order_id: string | null
        }
        Insert: {
          alloy_type?: string | null
          assignee?: string | null
          created_at?: string
          created_by?: string | null
          cuts?: number[] | null
          efficiency?: number | null
          end_time?: string | null
          id?: string
          inventory_item_id?: string | null
          job_number: string
          labor_cost?: number | null
          machine?: string | null
          material_category?: string | null
          material_cost?: number | null
          material_name?: string | null
          notes?: string | null
          optimization_layout?: Json | null
          optimized?: boolean | null
          priority?: Database["public"]["Enums"]["work_order_priority"]
          quality_checked?: boolean | null
          quality_notes?: string | null
          quality_result?:
            | Database["public"]["Enums"]["quality_check_result"]
            | null
          remnants?: Json | null
          scheduled_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["cutting_job_status"]
          stock_length?: number | null
          stocks_used?: number | null
          temper?: string | null
          total_cut_length?: number | null
          total_cuts?: number | null
          updated_at?: string
          waste?: number | null
          waste_cost?: number | null
          waste_percent?: number | null
          work_order_id?: string | null
        }
        Update: {
          alloy_type?: string | null
          assignee?: string | null
          created_at?: string
          created_by?: string | null
          cuts?: number[] | null
          efficiency?: number | null
          end_time?: string | null
          id?: string
          inventory_item_id?: string | null
          job_number?: string
          labor_cost?: number | null
          machine?: string | null
          material_category?: string | null
          material_cost?: number | null
          material_name?: string | null
          notes?: string | null
          optimization_layout?: Json | null
          optimized?: boolean | null
          priority?: Database["public"]["Enums"]["work_order_priority"]
          quality_checked?: boolean | null
          quality_notes?: string | null
          quality_result?:
            | Database["public"]["Enums"]["quality_check_result"]
            | null
          remnants?: Json | null
          scheduled_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["cutting_job_status"]
          stock_length?: number | null
          stocks_used?: number | null
          temper?: string | null
          total_cut_length?: number | null
          total_cuts?: number | null
          updated_at?: string
          waste?: number | null
          waste_cost?: number | null
          waste_percent?: number | null
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cutting_jobs_assignee_fkey"
            columns: ["assignee"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cutting_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cutting_jobs_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cutting_jobs_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string
          attendance: Json
          bank_account: string | null
          bank_branch: string | null
          bank_name: string | null
          city: string
          confirmation_date: string | null
          created_at: string
          created_by: string
          date_of_birth: string | null
          department: Database["public"]["Enums"]["hr_department"]
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          employee_number: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          first_name: string
          first_name_am: string | null
          full_name: string
          full_name_am: string | null
          gender: string
          health_insurance: boolean
          hire_date: string
          housing_allowance: number
          id: string
          last_name: string
          last_name_am: string | null
          last_review_date: string | null
          leave_accrual_rate: number
          leave_balances: Json
          marital_status: string | null
          meal_allowance: number
          national_id: string | null
          next_review_date: string | null
          notes: string | null
          pension_enrolled: boolean
          pension_number: string | null
          performance_rating: number
          personal_email: string
          personal_phone: string
          position: string
          position_level: Database["public"]["Enums"]["position_level"]
          probation_end_date: string | null
          reports_to: string | null
          reports_to_name: string | null
          salary: number
          salary_currency: string
          skills: Json
          status: Database["public"]["Enums"]["employment_status"]
          sub_city: string | null
          tax_id: string | null
          termination_date: string | null
          termination_reason: string | null
          transportation_allowance: number
          updated_at: string
          updated_by: string
          work_email: string
          work_phone: string | null
        }
        Insert: {
          address?: string
          attendance?: Json
          bank_account?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          city?: string
          confirmation_date?: string | null
          created_at?: string
          created_by?: string
          date_of_birth?: string | null
          department?: Database["public"]["Enums"]["hr_department"]
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          employee_number: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          first_name?: string
          first_name_am?: string | null
          full_name?: string
          full_name_am?: string | null
          gender?: string
          health_insurance?: boolean
          hire_date?: string
          housing_allowance?: number
          id?: string
          last_name?: string
          last_name_am?: string | null
          last_review_date?: string | null
          leave_accrual_rate?: number
          leave_balances?: Json
          marital_status?: string | null
          meal_allowance?: number
          national_id?: string | null
          next_review_date?: string | null
          notes?: string | null
          pension_enrolled?: boolean
          pension_number?: string | null
          performance_rating?: number
          personal_email?: string
          personal_phone?: string
          position?: string
          position_level?: Database["public"]["Enums"]["position_level"]
          probation_end_date?: string | null
          reports_to?: string | null
          reports_to_name?: string | null
          salary?: number
          salary_currency?: string
          skills?: Json
          status?: Database["public"]["Enums"]["employment_status"]
          sub_city?: string | null
          tax_id?: string | null
          termination_date?: string | null
          termination_reason?: string | null
          transportation_allowance?: number
          updated_at?: string
          updated_by?: string
          work_email?: string
          work_phone?: string | null
        }
        Update: {
          address?: string
          attendance?: Json
          bank_account?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          city?: string
          confirmation_date?: string | null
          created_at?: string
          created_by?: string
          date_of_birth?: string | null
          department?: Database["public"]["Enums"]["hr_department"]
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          employee_number?: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          first_name?: string
          first_name_am?: string | null
          full_name?: string
          full_name_am?: string | null
          gender?: string
          health_insurance?: boolean
          hire_date?: string
          housing_allowance?: number
          id?: string
          last_name?: string
          last_name_am?: string | null
          last_review_date?: string | null
          leave_accrual_rate?: number
          leave_balances?: Json
          marital_status?: string | null
          meal_allowance?: number
          national_id?: string | null
          next_review_date?: string | null
          notes?: string | null
          pension_enrolled?: boolean
          pension_number?: string | null
          performance_rating?: number
          personal_email?: string
          personal_phone?: string
          position?: string
          position_level?: Database["public"]["Enums"]["position_level"]
          probation_end_date?: string | null
          reports_to?: string | null
          reports_to_name?: string | null
          salary?: number
          salary_currency?: string
          skills?: Json
          status?: Database["public"]["Enums"]["employment_status"]
          sub_city?: string | null
          tax_id?: string | null
          termination_date?: string | null
          termination_reason?: string | null
          transportation_allowance?: number
          updated_at?: string
          updated_by?: string
          work_email?: string
          work_phone?: string | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          capacity: string | null
          category: Database["public"]["Enums"]["equipment_category"]
          created_at: string
          criticality: string
          department: string
          equipment_number: string
          health_score: number
          id: string
          location: string
          maintenance_frequency: Json
          manufacturer: string
          model: string
          name: string
          name_am: string | null
          notes: string | null
          power_rating: string | null
          purchase_cost: number
          purchase_date: string
          serial_number: string
          status: Database["public"]["Enums"]["equipment_status"]
          supplier_id: string | null
          supplier_name: string | null
          total_operating_hours: number
          updated_at: string
          warranty_expiry: string | null
          year_of_manufacture: number
        }
        Insert: {
          capacity?: string | null
          category?: Database["public"]["Enums"]["equipment_category"]
          created_at?: string
          criticality?: string
          department?: string
          equipment_number: string
          health_score?: number
          id?: string
          location?: string
          maintenance_frequency?: Json
          manufacturer?: string
          model?: string
          name?: string
          name_am?: string | null
          notes?: string | null
          power_rating?: string | null
          purchase_cost?: number
          purchase_date?: string
          serial_number?: string
          status?: Database["public"]["Enums"]["equipment_status"]
          supplier_id?: string | null
          supplier_name?: string | null
          total_operating_hours?: number
          updated_at?: string
          warranty_expiry?: string | null
          year_of_manufacture?: number
        }
        Update: {
          capacity?: string | null
          category?: Database["public"]["Enums"]["equipment_category"]
          created_at?: string
          criticality?: string
          department?: string
          equipment_number?: string
          health_score?: number
          id?: string
          location?: string
          maintenance_frequency?: Json
          manufacturer?: string
          model?: string
          name?: string
          name_am?: string | null
          notes?: string | null
          power_rating?: string | null
          purchase_cost?: number
          purchase_date?: string
          serial_number?: string
          status?: Database["public"]["Enums"]["equipment_status"]
          supplier_id?: string | null
          supplier_name?: string | null
          total_operating_hours?: number
          updated_at?: string
          warranty_expiry?: string | null
          year_of_manufacture?: number
        }
        Relationships: [
          {
            foreignKeyName: "equipment_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          amount_in_etb: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          created_by: string
          created_by_name: string
          currency: Database["public"]["Enums"]["finance_currency"]
          date: string
          description: string
          exchange_rate: number
          expense_number: string
          id: string
          notes: string | null
          paid: boolean
          paid_date: string | null
          payment_method: Database["public"]["Enums"]["finance_payment_method"]
          project_id: string | null
          project_name: string | null
          supplier_id: string | null
          supplier_name: string | null
          tax_amount: number
          tax_rate: number
        }
        Insert: {
          amount?: number
          amount_in_etb?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by?: string
          created_by_name?: string
          currency?: Database["public"]["Enums"]["finance_currency"]
          date?: string
          description?: string
          exchange_rate?: number
          expense_number: string
          id?: string
          notes?: string | null
          paid?: boolean
          paid_date?: string | null
          payment_method?: Database["public"]["Enums"]["finance_payment_method"]
          project_id?: string | null
          project_name?: string | null
          supplier_id?: string | null
          supplier_name?: string | null
          tax_amount?: number
          tax_rate?: number
        }
        Update: {
          amount?: number
          amount_in_etb?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by?: string
          created_by_name?: string
          currency?: Database["public"]["Enums"]["finance_currency"]
          date?: string
          description?: string
          exchange_rate?: number
          expense_number?: string
          id?: string
          notes?: string | null
          paid?: boolean
          paid_date?: string | null
          payment_method?: Database["public"]["Enums"]["finance_payment_method"]
          project_id?: string | null
          project_name?: string | null
          supplier_id?: string | null
          supplier_name?: string | null
          tax_amount?: number
          tax_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_payments: {
        Row: {
          account_number: string | null
          amount: number
          amount_in_etb: number
          bank_name: string | null
          cheque_number: string | null
          currency: Database["public"]["Enums"]["finance_currency"]
          customer_id: string | null
          customer_name: string
          date: string
          exchange_rate: number
          id: string
          invoice_id: string | null
          invoice_number: string
          method: Database["public"]["Enums"]["finance_payment_method"]
          notes: string | null
          payment_number: string
          phone_number: string | null
          reconciled: boolean
          reconciled_date: string | null
          recorded_at: string
          recorded_by: string
          recorded_by_name: string
          reference: string
          status: Database["public"]["Enums"]["finance_payment_status"]
          transaction_id: string | null
        }
        Insert: {
          account_number?: string | null
          amount?: number
          amount_in_etb?: number
          bank_name?: string | null
          cheque_number?: string | null
          currency?: Database["public"]["Enums"]["finance_currency"]
          customer_id?: string | null
          customer_name?: string
          date?: string
          exchange_rate?: number
          id?: string
          invoice_id?: string | null
          invoice_number?: string
          method?: Database["public"]["Enums"]["finance_payment_method"]
          notes?: string | null
          payment_number: string
          phone_number?: string | null
          reconciled?: boolean
          reconciled_date?: string | null
          recorded_at?: string
          recorded_by?: string
          recorded_by_name?: string
          reference?: string
          status?: Database["public"]["Enums"]["finance_payment_status"]
          transaction_id?: string | null
        }
        Update: {
          account_number?: string | null
          amount?: number
          amount_in_etb?: number
          bank_name?: string | null
          cheque_number?: string | null
          currency?: Database["public"]["Enums"]["finance_currency"]
          customer_id?: string | null
          customer_name?: string
          date?: string
          exchange_rate?: number
          id?: string
          invoice_id?: string | null
          invoice_number?: string
          method?: Database["public"]["Enums"]["finance_payment_method"]
          notes?: string | null
          payment_number?: string
          phone_number?: string | null
          reconciled?: boolean
          reconciled_date?: string | null
          recorded_at?: string
          recorded_by?: string
          recorded_by_name?: string
          reference?: string
          status?: Database["public"]["Enums"]["finance_payment_status"]
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          checklist_id: string | null
          checklist_name: string | null
          checklist_results: Json
          completed_date: string | null
          created_at: string
          created_by: string
          created_by_name: string
          defect_count: number
          defects: Json
          equipment_id: string | null
          id: string
          inspection_date: string
          inspection_number: string
          inspector_dept: string | null
          inspector_id: string
          inspector_name: string
          installation_id: string | null
          inventory_item_code: string | null
          inventory_item_id: string | null
          measurements: Json | null
          ncr_id: string | null
          ncr_number: string | null
          notes: string | null
          order_id: string | null
          order_number: string | null
          product_code: string | null
          product_id: string | null
          product_name: string | null
          project_id: string | null
          project_name: string | null
          purchase_order_id: string | null
          purchase_order_number: string | null
          result: Database["public"]["Enums"]["inspection_result"]
          scheduled_date: string
          score: number | null
          status: Database["public"]["Enums"]["inspection_status"]
          supplier_id: string | null
          supplier_name: string | null
          type: Database["public"]["Enums"]["inspection_type"]
          updated_at: string
          updated_by: string
          updated_by_name: string
          work_order_id: string | null
          work_order_number: string | null
        }
        Insert: {
          checklist_id?: string | null
          checklist_name?: string | null
          checklist_results?: Json
          completed_date?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          defect_count?: number
          defects?: Json
          equipment_id?: string | null
          id?: string
          inspection_date?: string
          inspection_number: string
          inspector_dept?: string | null
          inspector_id?: string
          inspector_name?: string
          installation_id?: string | null
          inventory_item_code?: string | null
          inventory_item_id?: string | null
          measurements?: Json | null
          ncr_id?: string | null
          ncr_number?: string | null
          notes?: string | null
          order_id?: string | null
          order_number?: string | null
          product_code?: string | null
          product_id?: string | null
          product_name?: string | null
          project_id?: string | null
          project_name?: string | null
          purchase_order_id?: string | null
          purchase_order_number?: string | null
          result?: Database["public"]["Enums"]["inspection_result"]
          scheduled_date?: string
          score?: number | null
          status?: Database["public"]["Enums"]["inspection_status"]
          supplier_id?: string | null
          supplier_name?: string | null
          type?: Database["public"]["Enums"]["inspection_type"]
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          work_order_id?: string | null
          work_order_number?: string | null
        }
        Update: {
          checklist_id?: string | null
          checklist_name?: string | null
          checklist_results?: Json
          completed_date?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          defect_count?: number
          defects?: Json
          equipment_id?: string | null
          id?: string
          inspection_date?: string
          inspection_number?: string
          inspector_dept?: string | null
          inspector_id?: string
          inspector_name?: string
          installation_id?: string | null
          inventory_item_code?: string | null
          inventory_item_id?: string | null
          measurements?: Json | null
          ncr_id?: string | null
          ncr_number?: string | null
          notes?: string | null
          order_id?: string | null
          order_number?: string | null
          product_code?: string | null
          product_id?: string | null
          product_name?: string | null
          project_id?: string | null
          project_name?: string | null
          purchase_order_id?: string | null
          purchase_order_number?: string | null
          result?: Database["public"]["Enums"]["inspection_result"]
          scheduled_date?: string
          score?: number | null
          status?: Database["public"]["Enums"]["inspection_status"]
          supplier_id?: string | null
          supplier_name?: string | null
          type?: Database["public"]["Enums"]["inspection_type"]
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          work_order_id?: string | null
          work_order_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      installations: {
        Row: {
          access_instructions: string | null
          activity_log: Json
          actual_end_date: string | null
          actual_start_date: string | null
          assigned_vehicle: string | null
          completed_at: string | null
          completed_by: string | null
          completion_notes: string | null
          completion_photos: Json
          created_at: string
          created_by: string
          created_by_name: string
          customer_code: string
          customer_contact: string | null
          customer_email: string | null
          customer_feedback: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          customer_rating: number | null
          customer_signature: string | null
          delay_hours: number | null
          delay_reasons: string[] | null
          estimated_duration: number
          has_issues: boolean
          id: string
          installation_number: string
          internal_notes: string | null
          is_overdue: boolean
          is_today: boolean
          issue_count: number
          issues: Json
          items: Json
          material_delay: boolean | null
          notes: string | null
          notes_am: string | null
          order_id: string | null
          order_number: string | null
          priority: Database["public"]["Enums"]["installation_priority"]
          project_id: string | null
          project_name: string | null
          quote_id: string | null
          requires_follow_up: boolean
          scheduled_date: string
          scheduled_end_time: string | null
          scheduled_start_time: string | null
          site_access_delay: boolean | null
          site_address: string
          site_city: string | null
          site_contact_person: string | null
          site_contact_phone: string | null
          site_sub_city: string | null
          status: Database["public"]["Enums"]["installation_status"]
          team_lead: string
          team_lead_id: string
          team_members: Json
          team_size: number
          updated_at: string
          updated_by: string
          updated_by_name: string
          weather_delay: boolean | null
        }
        Insert: {
          access_instructions?: string | null
          activity_log?: Json
          actual_end_date?: string | null
          actual_start_date?: string | null
          assigned_vehicle?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_notes?: string | null
          completion_photos?: Json
          created_at?: string
          created_by?: string
          created_by_name?: string
          customer_code?: string
          customer_contact?: string | null
          customer_email?: string | null
          customer_feedback?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_rating?: number | null
          customer_signature?: string | null
          delay_hours?: number | null
          delay_reasons?: string[] | null
          estimated_duration?: number
          has_issues?: boolean
          id?: string
          installation_number: string
          internal_notes?: string | null
          is_overdue?: boolean
          is_today?: boolean
          issue_count?: number
          issues?: Json
          items?: Json
          material_delay?: boolean | null
          notes?: string | null
          notes_am?: string | null
          order_id?: string | null
          order_number?: string | null
          priority?: Database["public"]["Enums"]["installation_priority"]
          project_id?: string | null
          project_name?: string | null
          quote_id?: string | null
          requires_follow_up?: boolean
          scheduled_date?: string
          scheduled_end_time?: string | null
          scheduled_start_time?: string | null
          site_access_delay?: boolean | null
          site_address?: string
          site_city?: string | null
          site_contact_person?: string | null
          site_contact_phone?: string | null
          site_sub_city?: string | null
          status?: Database["public"]["Enums"]["installation_status"]
          team_lead?: string
          team_lead_id?: string
          team_members?: Json
          team_size?: number
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          weather_delay?: boolean | null
        }
        Update: {
          access_instructions?: string | null
          activity_log?: Json
          actual_end_date?: string | null
          actual_start_date?: string | null
          assigned_vehicle?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_notes?: string | null
          completion_photos?: Json
          created_at?: string
          created_by?: string
          created_by_name?: string
          customer_code?: string
          customer_contact?: string | null
          customer_email?: string | null
          customer_feedback?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_rating?: number | null
          customer_signature?: string | null
          delay_hours?: number | null
          delay_reasons?: string[] | null
          estimated_duration?: number
          has_issues?: boolean
          id?: string
          installation_number?: string
          internal_notes?: string | null
          is_overdue?: boolean
          is_today?: boolean
          issue_count?: number
          issues?: Json
          items?: Json
          material_delay?: boolean | null
          notes?: string | null
          notes_am?: string | null
          order_id?: string | null
          order_number?: string | null
          priority?: Database["public"]["Enums"]["installation_priority"]
          project_id?: string | null
          project_name?: string | null
          quote_id?: string | null
          requires_follow_up?: boolean
          scheduled_date?: string
          scheduled_end_time?: string | null
          scheduled_start_time?: string | null
          site_access_delay?: boolean | null
          site_address?: string
          site_city?: string | null
          site_contact_person?: string | null
          site_contact_phone?: string | null
          site_sub_city?: string | null
          status?: Database["public"]["Enums"]["installation_status"]
          team_lead?: string
          team_lead_id?: string
          team_members?: Json
          team_size?: number
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          weather_delay?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "installations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
      invoices: {
        Row: {
          activity_log: Json
          balance: number
          balance_in_etb: number
          charges_description: string | null
          created_at: string
          created_by: string
          created_by_name: string
          currency: Database["public"]["Enums"]["finance_currency"]
          customer_address: string | null
          customer_code: string
          customer_id: string | null
          customer_name: string
          customer_tax_id: string | null
          discount_amount: number
          due_date: string
          exchange_rate: number
          id: string
          internal_notes: string | null
          invoice_number: string
          is_fully_paid: boolean
          is_overdue: boolean
          issue_date: string
          items: Json
          notes: string | null
          order_id: string | null
          order_number: string | null
          other_charges: number
          paid_date: string | null
          payment_due_days: number
          payment_terms: string
          payments: Json
          project_id: string | null
          project_name: string | null
          quote_id: string | null
          quote_number: string | null
          shipping_cost: number
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number
          tax_rate: number
          taxable_amount: number
          terms_and_conditions: string | null
          total: number
          total_in_etb: number
          total_paid: number
          total_paid_in_etb: number
          updated_at: string
        }
        Insert: {
          activity_log?: Json
          balance?: number
          balance_in_etb?: number
          charges_description?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          currency?: Database["public"]["Enums"]["finance_currency"]
          customer_address?: string | null
          customer_code?: string
          customer_id?: string | null
          customer_name?: string
          customer_tax_id?: string | null
          discount_amount?: number
          due_date?: string
          exchange_rate?: number
          id?: string
          internal_notes?: string | null
          invoice_number: string
          is_fully_paid?: boolean
          is_overdue?: boolean
          issue_date?: string
          items?: Json
          notes?: string | null
          order_id?: string | null
          order_number?: string | null
          other_charges?: number
          paid_date?: string | null
          payment_due_days?: number
          payment_terms?: string
          payments?: Json
          project_id?: string | null
          project_name?: string | null
          quote_id?: string | null
          quote_number?: string | null
          shipping_cost?: number
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          taxable_amount?: number
          terms_and_conditions?: string | null
          total?: number
          total_in_etb?: number
          total_paid?: number
          total_paid_in_etb?: number
          updated_at?: string
        }
        Update: {
          activity_log?: Json
          balance?: number
          balance_in_etb?: number
          charges_description?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          currency?: Database["public"]["Enums"]["finance_currency"]
          customer_address?: string | null
          customer_code?: string
          customer_id?: string | null
          customer_name?: string
          customer_tax_id?: string | null
          discount_amount?: number
          due_date?: string
          exchange_rate?: number
          id?: string
          internal_notes?: string | null
          invoice_number?: string
          is_fully_paid?: boolean
          is_overdue?: boolean
          issue_date?: string
          items?: Json
          notes?: string | null
          order_id?: string | null
          order_number?: string | null
          other_charges?: number
          paid_date?: string | null
          payment_due_days?: number
          payment_terms?: string
          payments?: Json
          project_id?: string | null
          project_name?: string | null
          quote_id?: string | null
          quote_number?: string | null
          shipping_cost?: number
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          taxable_amount?: number
          terms_and_conditions?: string | null
          total?: number
          total_in_etb?: number
          total_paid?: number
          total_paid_in_etb?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      labor_entries: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          created_at: string
          date: string
          hourly_rate: number | null
          hours: number
          id: string
          is_overtime: boolean | null
          notes: string | null
          overtime_multiplier: number | null
          stage: Database["public"]["Enums"]["production_stage"] | null
          task: string | null
          units_produced: number | null
          work_order_id: string
          worker_id: string | null
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          date?: string
          hourly_rate?: number | null
          hours?: number
          id?: string
          is_overtime?: boolean | null
          notes?: string | null
          overtime_multiplier?: number | null
          stage?: Database["public"]["Enums"]["production_stage"] | null
          task?: string | null
          units_produced?: number | null
          work_order_id: string
          worker_id?: string | null
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          date?: string
          hourly_rate?: number | null
          hours?: number
          id?: string
          is_overtime?: boolean | null
          notes?: string | null
          overtime_multiplier?: number | null
          stage?: Database["public"]["Enums"]["production_stage"] | null
          task?: string | null
          units_produced?: number | null
          work_order_id?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labor_entries_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labor_entries_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labor_entries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_by: string | null
          approved_by_name: string | null
          approved_date: string | null
          created_at: string
          days_requested: number
          employee_id: string | null
          employee_name: string
          end_date: string
          handover_notes: string | null
          handover_to: string | null
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          notes: string | null
          reason: string
          rejection_reason: string | null
          remaining_balance_after: number
          request_number: string
          start_date: string
          status: Database["public"]["Enums"]["leave_status"]
          submitted_date: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          approved_by_name?: string | null
          approved_date?: string | null
          created_at?: string
          days_requested?: number
          employee_id?: string | null
          employee_name?: string
          end_date?: string
          handover_notes?: string | null
          handover_to?: string | null
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          notes?: string | null
          reason?: string
          rejection_reason?: string | null
          remaining_balance_after?: number
          request_number: string
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"]
          submitted_date?: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          approved_by_name?: string | null
          approved_date?: string | null
          created_at?: string
          days_requested?: number
          employee_id?: string | null
          employee_name?: string
          end_date?: string
          handover_notes?: string | null
          handover_to?: string | null
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          notes?: string | null
          reason?: string
          rejection_reason?: string | null
          remaining_balance_after?: number
          request_number?: string
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"]
          submitted_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_tasks: {
        Row: {
          activity_log: Json
          affected_projects: string[] | null
          affected_work_orders: string[] | null
          assigned_to: string[] | null
          assigned_to_names: string[] | null
          checklist: Json
          completion_date: string | null
          corrective_action: string | null
          created_at: string
          created_by: string
          created_by_name: string
          description: string
          downtime_hours: number | null
          equipment_category: Database["public"]["Enums"]["equipment_category"]
          equipment_id: string | null
          equipment_name: string
          equipment_number: string
          follow_up_required: boolean
          id: string
          is_emergency: boolean
          is_overdue: boolean
          issues_found: string[] | null
          labor_cost: number
          labor_hours: number
          labor_rate: number
          lead_technician: string | null
          notes: string | null
          outcome: string | null
          parts_cost: number
          parts_used: Json
          priority: Database["public"]["Enums"]["maintenance_priority"]
          production_impact: string | null
          requires_shutdown: boolean
          root_cause: string | null
          scheduled_date: string
          scheduled_duration: number
          start_date: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          task_number: string
          technician_notes: string | null
          title: string
          total_cost: number
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at: string
        }
        Insert: {
          activity_log?: Json
          affected_projects?: string[] | null
          affected_work_orders?: string[] | null
          assigned_to?: string[] | null
          assigned_to_names?: string[] | null
          checklist?: Json
          completion_date?: string | null
          corrective_action?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          description?: string
          downtime_hours?: number | null
          equipment_category?: Database["public"]["Enums"]["equipment_category"]
          equipment_id?: string | null
          equipment_name?: string
          equipment_number?: string
          follow_up_required?: boolean
          id?: string
          is_emergency?: boolean
          is_overdue?: boolean
          issues_found?: string[] | null
          labor_cost?: number
          labor_hours?: number
          labor_rate?: number
          lead_technician?: string | null
          notes?: string | null
          outcome?: string | null
          parts_cost?: number
          parts_used?: Json
          priority?: Database["public"]["Enums"]["maintenance_priority"]
          production_impact?: string | null
          requires_shutdown?: boolean
          root_cause?: string | null
          scheduled_date?: string
          scheduled_duration?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          task_number: string
          technician_notes?: string | null
          title?: string
          total_cost?: number
          type?: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string
        }
        Update: {
          activity_log?: Json
          affected_projects?: string[] | null
          affected_work_orders?: string[] | null
          assigned_to?: string[] | null
          assigned_to_names?: string[] | null
          checklist?: Json
          completion_date?: string | null
          corrective_action?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          description?: string
          downtime_hours?: number | null
          equipment_category?: Database["public"]["Enums"]["equipment_category"]
          equipment_id?: string | null
          equipment_name?: string
          equipment_number?: string
          follow_up_required?: boolean
          id?: string
          is_emergency?: boolean
          is_overdue?: boolean
          issues_found?: string[] | null
          labor_cost?: number
          labor_hours?: number
          labor_rate?: number
          lead_technician?: string | null
          notes?: string | null
          outcome?: string | null
          parts_cost?: number
          parts_used?: Json
          priority?: Database["public"]["Enums"]["maintenance_priority"]
          production_impact?: string | null
          requires_shutdown?: boolean
          root_cause?: string | null
          scheduled_date?: string
          scheduled_duration?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          task_number?: string
          technician_notes?: string | null
          title?: string
          total_cost?: number
          type?: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      ncrs: {
        Row: {
          activity_log: Json
          capa_id: string | null
          capa_number: string | null
          capa_required: boolean
          category: string
          closed_by: string | null
          closure_date: string | null
          cost_impact: number
          created_at: string
          created_by: string
          created_by_name: string
          customer_id: string | null
          customer_name: string | null
          description: string
          id: string
          immediate_action: string
          inspection_id: string | null
          inspection_number: string | null
          investigation_required: boolean
          investigation_status: string
          investigation_summary: string | null
          ncr_number: string
          notes: string | null
          order_id: string | null
          order_number: string | null
          preventive_action: string | null
          product_id: string | null
          product_name: string | null
          purchase_order_id: string | null
          purchase_order_number: string | null
          quantity_affected: number
          quantity_unit: string
          quarantine_location: string | null
          reported_by: string
          reported_by_name: string
          reported_date: string
          root_cause: string | null
          root_cause_category: string | null
          scrap_value: number | null
          severity: Database["public"]["Enums"]["defect_severity"]
          status: Database["public"]["Enums"]["ncr_status"]
          supplier_id: string | null
          supplier_name: string | null
          time_impact: number
          title: string
          updated_at: string
          updated_by: string
          updated_by_name: string
          verification_required: boolean
          verification_status: string
          verified_by: string | null
          verified_date: string | null
          work_order_id: string | null
          work_order_number: string | null
        }
        Insert: {
          activity_log?: Json
          capa_id?: string | null
          capa_number?: string | null
          capa_required?: boolean
          category?: string
          closed_by?: string | null
          closure_date?: string | null
          cost_impact?: number
          created_at?: string
          created_by?: string
          created_by_name?: string
          customer_id?: string | null
          customer_name?: string | null
          description?: string
          id?: string
          immediate_action?: string
          inspection_id?: string | null
          inspection_number?: string | null
          investigation_required?: boolean
          investigation_status?: string
          investigation_summary?: string | null
          ncr_number: string
          notes?: string | null
          order_id?: string | null
          order_number?: string | null
          preventive_action?: string | null
          product_id?: string | null
          product_name?: string | null
          purchase_order_id?: string | null
          purchase_order_number?: string | null
          quantity_affected?: number
          quantity_unit?: string
          quarantine_location?: string | null
          reported_by?: string
          reported_by_name?: string
          reported_date?: string
          root_cause?: string | null
          root_cause_category?: string | null
          scrap_value?: number | null
          severity?: Database["public"]["Enums"]["defect_severity"]
          status?: Database["public"]["Enums"]["ncr_status"]
          supplier_id?: string | null
          supplier_name?: string | null
          time_impact?: number
          title?: string
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          verification_required?: boolean
          verification_status?: string
          verified_by?: string | null
          verified_date?: string | null
          work_order_id?: string | null
          work_order_number?: string | null
        }
        Update: {
          activity_log?: Json
          capa_id?: string | null
          capa_number?: string | null
          capa_required?: boolean
          category?: string
          closed_by?: string | null
          closure_date?: string | null
          cost_impact?: number
          created_at?: string
          created_by?: string
          created_by_name?: string
          customer_id?: string | null
          customer_name?: string | null
          description?: string
          id?: string
          immediate_action?: string
          inspection_id?: string | null
          inspection_number?: string | null
          investigation_required?: boolean
          investigation_status?: string
          investigation_summary?: string | null
          ncr_number?: string
          notes?: string | null
          order_id?: string | null
          order_number?: string | null
          preventive_action?: string | null
          product_id?: string | null
          product_name?: string | null
          purchase_order_id?: string | null
          purchase_order_number?: string | null
          quantity_affected?: number
          quantity_unit?: string
          quarantine_location?: string | null
          reported_by?: string
          reported_by_name?: string
          reported_date?: string
          root_cause?: string | null
          root_cause_category?: string | null
          scrap_value?: number | null
          severity?: Database["public"]["Enums"]["defect_severity"]
          status?: Database["public"]["Enums"]["ncr_status"]
          supplier_id?: string | null
          supplier_name?: string | null
          time_impact?: number
          title?: string
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          verification_required?: boolean
          verification_status?: string
          verified_by?: string | null
          verified_date?: string | null
          work_order_id?: string | null
          work_order_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ncrs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncrs_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncrs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncrs_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncrs_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          activity_log: Json
          actual_delivery: string | null
          balance: number
          created_at: string
          created_by: string
          created_by_name: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          cutting_job_ids: string[] | null
          deliveries: Json
          discount_total: number
          due_date: string
          id: string
          internal_notes: string | null
          is_overdue: boolean
          items: Json
          notes: string | null
          order_date: string
          order_number: string
          payment_method:
            | Database["public"]["Enums"]["order_payment_method"]
            | null
          payment_status: Database["public"]["Enums"]["order_payment_status"]
          payments: Json
          profit_margin: number
          project_id: string | null
          project_name: string | null
          quote_id: string | null
          quote_number: string | null
          requested_delivery: string | null
          shipping_address: string | null
          shipping_method: Database["public"]["Enums"]["shipping_method"] | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax: number
          tax_rate: number
          total: number
          total_cost: number
          total_delivered: number
          total_paid: number
          total_profit: number
          total_shipped: number
          tracking_number: string | null
          updated_at: string
          updated_by: string
          updated_by_name: string
          work_order_ids: string[] | null
        }
        Insert: {
          activity_log?: Json
          actual_delivery?: string | null
          balance?: number
          created_at?: string
          created_by?: string
          created_by_name?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          cutting_job_ids?: string[] | null
          deliveries?: Json
          discount_total?: number
          due_date?: string
          id?: string
          internal_notes?: string | null
          is_overdue?: boolean
          items?: Json
          notes?: string | null
          order_date?: string
          order_number: string
          payment_method?:
            | Database["public"]["Enums"]["order_payment_method"]
            | null
          payment_status?: Database["public"]["Enums"]["order_payment_status"]
          payments?: Json
          profit_margin?: number
          project_id?: string | null
          project_name?: string | null
          quote_id?: string | null
          quote_number?: string | null
          requested_delivery?: string | null
          shipping_address?: string | null
          shipping_method?:
            | Database["public"]["Enums"]["shipping_method"]
            | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          tax_rate?: number
          total?: number
          total_cost?: number
          total_delivered?: number
          total_paid?: number
          total_profit?: number
          total_shipped?: number
          tracking_number?: string | null
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          work_order_ids?: string[] | null
        }
        Update: {
          activity_log?: Json
          actual_delivery?: string | null
          balance?: number
          created_at?: string
          created_by?: string
          created_by_name?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          cutting_job_ids?: string[] | null
          deliveries?: Json
          discount_total?: number
          due_date?: string
          id?: string
          internal_notes?: string | null
          is_overdue?: boolean
          items?: Json
          notes?: string | null
          order_date?: string
          order_number?: string
          payment_method?:
            | Database["public"]["Enums"]["order_payment_method"]
            | null
          payment_status?: Database["public"]["Enums"]["order_payment_status"]
          payments?: Json
          profit_margin?: number
          project_id?: string | null
          project_name?: string | null
          quote_id?: string | null
          quote_number?: string | null
          requested_delivery?: string | null
          shipping_address?: string | null
          shipping_method?:
            | Database["public"]["Enums"]["shipping_method"]
            | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          tax_rate?: number
          total?: number
          total_cost?: number
          total_delivered?: number
          total_paid?: number
          total_profit?: number
          total_shipped?: number
          tracking_number?: string | null
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          work_order_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      payrolls: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          approved_by_name: string | null
          attendance_bonus: number
          bank_account: string
          bank_name: string
          base_salary: number
          calculated_at: string
          calculated_by: string
          calculated_by_name: string
          created_at: string
          department: Database["public"]["Enums"]["hr_department"]
          employee_id: string | null
          employee_name: string
          employee_number: string
          end_date: string
          gross_pay: number
          health_insurance: number
          housing_allowance: number
          id: string
          income_tax: number
          loan_repayment: number
          meal_allowance: number
          net_pay: number
          notes: string | null
          overtime_hours: number
          overtime_pay: number
          overtime_rate: number
          paid_at: string | null
          payment_date: string
          payroll_number: string
          pension: number
          performance_bonus: number
          period: string
          start_date: string
          status: Database["public"]["Enums"]["payroll_status"]
          total_allowances: number
          total_bonuses: number
          total_deductions: number
          transportation_allowance: number
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          approved_by_name?: string | null
          attendance_bonus?: number
          bank_account?: string
          bank_name?: string
          base_salary?: number
          calculated_at?: string
          calculated_by?: string
          calculated_by_name?: string
          created_at?: string
          department?: Database["public"]["Enums"]["hr_department"]
          employee_id?: string | null
          employee_name?: string
          employee_number?: string
          end_date?: string
          gross_pay?: number
          health_insurance?: number
          housing_allowance?: number
          id?: string
          income_tax?: number
          loan_repayment?: number
          meal_allowance?: number
          net_pay?: number
          notes?: string | null
          overtime_hours?: number
          overtime_pay?: number
          overtime_rate?: number
          paid_at?: string | null
          payment_date?: string
          payroll_number: string
          pension?: number
          performance_bonus?: number
          period?: string
          start_date?: string
          status?: Database["public"]["Enums"]["payroll_status"]
          total_allowances?: number
          total_bonuses?: number
          total_deductions?: number
          transportation_allowance?: number
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          approved_by_name?: string | null
          attendance_bonus?: number
          bank_account?: string
          bank_name?: string
          base_salary?: number
          calculated_at?: string
          calculated_by?: string
          calculated_by_name?: string
          created_at?: string
          department?: Database["public"]["Enums"]["hr_department"]
          employee_id?: string | null
          employee_name?: string
          employee_number?: string
          end_date?: string
          gross_pay?: number
          health_insurance?: number
          housing_allowance?: number
          id?: string
          income_tax?: number
          loan_repayment?: number
          meal_allowance?: number
          net_pay?: number
          notes?: string | null
          overtime_hours?: number
          overtime_pay?: number
          overtime_rate?: number
          paid_at?: string | null
          payment_date?: string
          payroll_number?: string
          pension?: number
          performance_bonus?: number
          period?: string
          start_date?: string
          status?: Database["public"]["Enums"]["payroll_status"]
          total_allowances?: number
          total_bonuses?: number
          total_deductions?: number
          transportation_allowance?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payrolls_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
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
      production_issues: {
        Row: {
          cost_impact: number | null
          description: string | null
          estimated_delay: number | null
          id: string
          issue_number: string
          reported_at: string
          reported_by: string | null
          resolution: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["issue_severity"]
          title: string
          type: Database["public"]["Enums"]["issue_type"]
          work_order_id: string
        }
        Insert: {
          cost_impact?: number | null
          description?: string | null
          estimated_delay?: number | null
          id?: string
          issue_number: string
          reported_at?: string
          reported_by?: string | null
          resolution?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: Database["public"]["Enums"]["issue_severity"]
          title: string
          type: Database["public"]["Enums"]["issue_type"]
          work_order_id: string
        }
        Update: {
          cost_impact?: number | null
          description?: string | null
          estimated_delay?: number | null
          id?: string
          issue_number?: string
          reported_at?: string
          reported_by?: string | null
          resolution?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["issue_severity"]
          title?: string
          type?: Database["public"]["Enums"]["issue_type"]
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_issues_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_issues_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_issues_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          accessories_cost: number
          alloy_type: string | null
          alternative_products: string[] | null
          batch_number: string | null
          category: Database["public"]["Enums"]["product_category"]
          certifications: string[] | null
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
          images: string[] | null
          inspection_required: boolean
          install_labor_cost: number
          installation_instructions: string | null
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
          alternative_products?: string[] | null
          batch_number?: string | null
          category: Database["public"]["Enums"]["product_category"]
          certifications?: string[] | null
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
          images?: string[] | null
          inspection_required?: boolean
          install_labor_cost?: number
          installation_instructions?: string | null
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
          alternative_products?: string[] | null
          batch_number?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          certifications?: string[] | null
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
          images?: string[] | null
          inspection_required?: boolean
          install_labor_cost?: number
          installation_instructions?: string | null
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
      project_products: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          product_id: string | null
          product_name: string
          project_id: string
          quantity: number
          status: Database["public"]["Enums"]["project_product_status"]
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name: string
          project_id: string
          quantity?: number
          status?: Database["public"]["Enums"]["project_product_status"]
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name?: string
          project_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["project_product_status"]
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_products_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          balance: number
          completed_date: string | null
          created_at: string
          created_by: string
          customer_contact: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          deposit: number
          deposit_percentage: number
          due_date: string
          id: string
          installation_ids: string[] | null
          internal_notes: string | null
          invoice_ids: string[] | null
          is_at_risk: boolean
          is_overdue: boolean
          labor_cost: number
          material_cost: number
          milestones: Json
          name: string
          name_am: string
          notes: string | null
          order_date: string
          overhead_cost: number
          payment_ids: string[] | null
          profit: number
          profit_margin: number
          progress: number
          project_manager: string
          project_manager_id: string | null
          project_number: string
          purchase_order_ids: string[] | null
          quote_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          team_members: string[] | null
          timeline: Json | null
          total_cost: number
          type: Database["public"]["Enums"]["project_type"]
          updated_at: string
          updated_by: string
          value: number
          work_order_ids: string[] | null
        }
        Insert: {
          balance?: number
          completed_date?: string | null
          created_at?: string
          created_by?: string
          customer_contact?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          deposit?: number
          deposit_percentage?: number
          due_date?: string
          id?: string
          installation_ids?: string[] | null
          internal_notes?: string | null
          invoice_ids?: string[] | null
          is_at_risk?: boolean
          is_overdue?: boolean
          labor_cost?: number
          material_cost?: number
          milestones?: Json
          name: string
          name_am?: string
          notes?: string | null
          order_date?: string
          overhead_cost?: number
          payment_ids?: string[] | null
          profit?: number
          profit_margin?: number
          progress?: number
          project_manager?: string
          project_manager_id?: string | null
          project_number: string
          purchase_order_ids?: string[] | null
          quote_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          team_members?: string[] | null
          timeline?: Json | null
          total_cost?: number
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string
          updated_by?: string
          value?: number
          work_order_ids?: string[] | null
        }
        Update: {
          balance?: number
          completed_date?: string | null
          created_at?: string
          created_by?: string
          customer_contact?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          deposit?: number
          deposit_percentage?: number
          due_date?: string
          id?: string
          installation_ids?: string[] | null
          internal_notes?: string | null
          invoice_ids?: string[] | null
          is_at_risk?: boolean
          is_overdue?: boolean
          labor_cost?: number
          material_cost?: number
          milestones?: Json
          name?: string
          name_am?: string
          notes?: string | null
          order_date?: string
          overhead_cost?: number
          payment_ids?: string[] | null
          profit?: number
          profit_margin?: number
          progress?: number
          project_manager?: string
          project_manager_id?: string | null
          project_number?: string
          purchase_order_ids?: string[] | null
          quote_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          team_members?: string[] | null
          timeline?: Json | null
          total_cost?: number
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string
          updated_by?: string
          value?: number
          work_order_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          activity_log: Json
          approval_status: Database["public"]["Enums"]["po_approval_status"]
          approved_by: string | null
          balance: number
          balance_in_etb: number
          carrier: string | null
          created_at: string
          created_by: string
          created_by_name: string
          currency: Database["public"]["Enums"]["proc_currency"]
          customs_duty: number
          discount_amount: number
          exchange_rate: number
          expected_delivery: string
          id: string
          insurance: number
          internal_notes: string | null
          is_overdue: boolean
          is_urgent: boolean
          items: Json
          notes: string | null
          order_date: string
          other_charges: number
          paid: number
          paid_in_etb: number
          payment_terms: Database["public"]["Enums"]["payment_terms"]
          payments: Json
          po_number: string
          project_id: string | null
          project_name: string | null
          receipts: Json
          received_date: string | null
          shipped_date: string | null
          shipping_cost: number
          shipping_method: string | null
          shipping_terms: string
          status: Database["public"]["Enums"]["po_status"]
          subtotal: number
          supplier_code: string
          supplier_id: string | null
          supplier_name: string
          tax_amount: number
          total: number
          total_in_etb: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          activity_log?: Json
          approval_status?: Database["public"]["Enums"]["po_approval_status"]
          approved_by?: string | null
          balance?: number
          balance_in_etb?: number
          carrier?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          currency?: Database["public"]["Enums"]["proc_currency"]
          customs_duty?: number
          discount_amount?: number
          exchange_rate?: number
          expected_delivery?: string
          id?: string
          insurance?: number
          internal_notes?: string | null
          is_overdue?: boolean
          is_urgent?: boolean
          items?: Json
          notes?: string | null
          order_date?: string
          other_charges?: number
          paid?: number
          paid_in_etb?: number
          payment_terms?: Database["public"]["Enums"]["payment_terms"]
          payments?: Json
          po_number: string
          project_id?: string | null
          project_name?: string | null
          receipts?: Json
          received_date?: string | null
          shipped_date?: string | null
          shipping_cost?: number
          shipping_method?: string | null
          shipping_terms?: string
          status?: Database["public"]["Enums"]["po_status"]
          subtotal?: number
          supplier_code?: string
          supplier_id?: string | null
          supplier_name?: string
          tax_amount?: number
          total?: number
          total_in_etb?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          activity_log?: Json
          approval_status?: Database["public"]["Enums"]["po_approval_status"]
          approved_by?: string | null
          balance?: number
          balance_in_etb?: number
          carrier?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          currency?: Database["public"]["Enums"]["proc_currency"]
          customs_duty?: number
          discount_amount?: number
          exchange_rate?: number
          expected_delivery?: string
          id?: string
          insurance?: number
          internal_notes?: string | null
          is_overdue?: boolean
          is_urgent?: boolean
          items?: Json
          notes?: string | null
          order_date?: string
          other_charges?: number
          paid?: number
          paid_in_etb?: number
          payment_terms?: Database["public"]["Enums"]["payment_terms"]
          payments?: Json
          po_number?: string
          project_id?: string | null
          project_name?: string | null
          receipts?: Json
          received_date?: string | null
          shipped_date?: string | null
          shipping_cost?: number
          shipping_method?: string | null
          shipping_terms?: string
          status?: Database["public"]["Enums"]["po_status"]
          subtotal?: number
          supplier_code?: string
          supplier_id?: string | null
          supplier_name?: string
          tax_amount?: number
          total?: number
          total_in_etb?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          activity_log: Json
          converted_date: string | null
          created_at: string
          created_by: string
          created_by_name: string
          currency: string
          customer_code: string
          customer_contact: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          customer_snapshot: Json
          cutting_fee: number
          delivery_terms: string | null
          description: string | null
          discount_amount: number
          discount_type: string | null
          discount_value: number | null
          expiry_date: string
          fees_description: string | null
          finish_type: string | null
          finish_upcharge: number
          id: string
          installation_cost: number
          internal_notes: string | null
          is_converted: boolean
          is_expired: boolean
          items: Json
          notes: string | null
          other_fees: number
          payment_terms: string
          profit_margin: number
          project_id: string | null
          project_name: string
          project_status: string | null
          quote_date: string
          quote_number: string
          rush_fee: number
          status: Database["public"]["Enums"]["quote_status"]
          subtotal: number
          tax_amount: number
          tax_rate: number
          taxable_amount: number
          terms_and_conditions: string | null
          title: string
          total: number
          total_cost: number
          total_profit: number
          transport_cost: number
          updated_at: string
          updated_by: string
          updated_by_name: string
          validity_days: number
          version: string
          version_history: Json
          warranty: string | null
        }
        Insert: {
          activity_log?: Json
          converted_date?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          currency?: string
          customer_code?: string
          customer_contact?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_snapshot?: Json
          cutting_fee?: number
          delivery_terms?: string | null
          description?: string | null
          discount_amount?: number
          discount_type?: string | null
          discount_value?: number | null
          expiry_date?: string
          fees_description?: string | null
          finish_type?: string | null
          finish_upcharge?: number
          id?: string
          installation_cost?: number
          internal_notes?: string | null
          is_converted?: boolean
          is_expired?: boolean
          items?: Json
          notes?: string | null
          other_fees?: number
          payment_terms?: string
          profit_margin?: number
          project_id?: string | null
          project_name?: string
          project_status?: string | null
          quote_date?: string
          quote_number: string
          rush_fee?: number
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          taxable_amount?: number
          terms_and_conditions?: string | null
          title?: string
          total?: number
          total_cost?: number
          total_profit?: number
          transport_cost?: number
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          validity_days?: number
          version?: string
          version_history?: Json
          warranty?: string | null
        }
        Update: {
          activity_log?: Json
          converted_date?: string | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          currency?: string
          customer_code?: string
          customer_contact?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_snapshot?: Json
          cutting_fee?: number
          delivery_terms?: string | null
          description?: string | null
          discount_amount?: number
          discount_type?: string | null
          discount_value?: number | null
          expiry_date?: string
          fees_description?: string | null
          finish_type?: string | null
          finish_upcharge?: number
          id?: string
          installation_cost?: number
          internal_notes?: string | null
          is_converted?: boolean
          is_expired?: boolean
          items?: Json
          notes?: string | null
          other_fees?: number
          payment_terms?: string
          profit_margin?: number
          project_id?: string | null
          project_name?: string
          project_status?: string | null
          quote_date?: string
          quote_number?: string
          rush_fee?: number
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          taxable_amount?: number
          terms_and_conditions?: string | null
          title?: string
          total?: number
          total_cost?: number
          total_profit?: number
          transport_cost?: number
          updated_at?: string
          updated_by?: string
          updated_by_name?: string
          validity_days?: number
          version?: string
          version_history?: Json
          warranty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      work_order_materials: {
        Row: {
          actual_unit_cost: number | null
          created_at: string
          estimated_unit_cost: number | null
          id: string
          inventory_item_id: string | null
          is_from_bom: boolean | null
          notes: string | null
          quantity_consumed: number
          quantity_required: number
          unit: string | null
          work_order_id: string
        }
        Insert: {
          actual_unit_cost?: number | null
          created_at?: string
          estimated_unit_cost?: number | null
          id?: string
          inventory_item_id?: string | null
          is_from_bom?: boolean | null
          notes?: string | null
          quantity_consumed?: number
          quantity_required?: number
          unit?: string | null
          work_order_id: string
        }
        Update: {
          actual_unit_cost?: number | null
          created_at?: string
          estimated_unit_cost?: number | null
          id?: string
          inventory_item_id?: string | null
          is_from_bom?: boolean | null
          notes?: string | null
          quantity_consumed?: number
          quantity_required?: number
          unit?: string | null
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_materials_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_materials_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          act_hours: number | null
          act_labor_cost: number | null
          act_material_cost: number | null
          act_overhead_cost: number | null
          act_total_cost: number | null
          actual_end: string | null
          actual_start: string | null
          completed: number
          created_at: string
          created_by: string | null
          current_stage: Database["public"]["Enums"]["production_stage"]
          customer_id: string | null
          est_hours: number | null
          est_labor_cost: number | null
          est_material_cost: number | null
          est_overhead_cost: number | null
          est_total_cost: number | null
          good_units: number
          id: string
          is_at_risk: boolean | null
          is_blocked: boolean | null
          is_overdue: boolean | null
          notes: string | null
          priority: Database["public"]["Enums"]["work_order_priority"]
          product_id: string | null
          progress: number | null
          project_id: string | null
          quantity: number
          quote_id: string | null
          remaining: number
          rework: number
          scheduled_end: string | null
          scheduled_start: string | null
          scrap: number
          status: Database["public"]["Enums"]["work_order_status"]
          supervisor_notes: string | null
          updated_at: string
          updated_by: string | null
          work_order_number: string
        }
        Insert: {
          act_hours?: number | null
          act_labor_cost?: number | null
          act_material_cost?: number | null
          act_overhead_cost?: number | null
          act_total_cost?: number | null
          actual_end?: string | null
          actual_start?: string | null
          completed?: number
          created_at?: string
          created_by?: string | null
          current_stage?: Database["public"]["Enums"]["production_stage"]
          customer_id?: string | null
          est_hours?: number | null
          est_labor_cost?: number | null
          est_material_cost?: number | null
          est_overhead_cost?: number | null
          est_total_cost?: number | null
          good_units?: number
          id?: string
          is_at_risk?: boolean | null
          is_blocked?: boolean | null
          is_overdue?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["work_order_priority"]
          product_id?: string | null
          progress?: number | null
          project_id?: string | null
          quantity?: number
          quote_id?: string | null
          remaining?: number
          rework?: number
          scheduled_end?: string | null
          scheduled_start?: string | null
          scrap?: number
          status?: Database["public"]["Enums"]["work_order_status"]
          supervisor_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          work_order_number: string
        }
        Update: {
          act_hours?: number | null
          act_labor_cost?: number | null
          act_material_cost?: number | null
          act_overhead_cost?: number | null
          act_total_cost?: number | null
          actual_end?: string | null
          actual_start?: string | null
          completed?: number
          created_at?: string
          created_by?: string | null
          current_stage?: Database["public"]["Enums"]["production_stage"]
          customer_id?: string | null
          est_hours?: number | null
          est_labor_cost?: number | null
          est_material_cost?: number | null
          est_overhead_cost?: number | null
          est_total_cost?: number | null
          good_units?: number
          id?: string
          is_at_risk?: boolean | null
          is_blocked?: boolean | null
          is_overdue?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["work_order_priority"]
          product_id?: string | null
          progress?: number | null
          project_id?: string | null
          quantity?: number
          quote_id?: string | null
          remaining?: number
          rework?: number
          scheduled_end?: string | null
          scheduled_start?: string | null
          scrap?: number
          status?: Database["public"]["Enums"]["work_order_status"]
          supervisor_notes?: string | null
          updated_at?: string
          updated_by?: string | null
          work_order_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_cutting_job: {
        Args: { p_cutting_job_id: string }
        Returns: boolean
      }
      complete_work_order: {
        Args: { p_work_order_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      start_work_order: { Args: { p_work_order_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "user"
      bom_component_type:
        | "Profile"
        | "Hardware"
        | "Glass"
        | "Accessory"
        | "Other"
      complaint_severity: "low" | "medium" | "high" | "critical"
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
      cutting_job_status: "Pending" | "In Progress" | "Completed" | "Cancelled"
      defect_severity: "critical" | "major" | "minor" | "observation"
      employment_status:
        | "active"
        | "probation"
        | "notice"
        | "terminated"
        | "resigned"
        | "retired"
        | "on_leave"
        | "suspended"
      employment_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "intern"
        | "temporary"
        | "consultant"
      equipment_category:
        | "cutting_machine"
        | "cnc_machine"
        | "welding_machine"
        | "assembly_line"
        | "glass_processing"
        | "painting_line"
        | "hand_tools"
        | "power_tools"
        | "compressor"
        | "generator"
        | "forklift"
        | "vehicle"
        | "measuring_device"
        | "testing_equipment"
      equipment_status:
        | "operational"
        | "under_maintenance"
        | "breakdown"
        | "decommissioned"
      expense_category:
        | "Materials"
        | "Labor"
        | "Equipment"
        | "Transport"
        | "Utilities"
        | "Rent"
        | "Salaries"
        | "Marketing"
        | "Other"
      finance_currency: "ETB" | "USD" | "EUR" | "CNY" | "GBP"
      finance_payment_method:
        | "Cash"
        | "Bank Transfer"
        | "TeleBirr"
        | "Cheque"
        | "Credit Card"
        | "CBE Birr"
        | "HelloCash"
        | "Mobile Money"
      finance_payment_status:
        | "Pending"
        | "Completed"
        | "Failed"
        | "Reversed"
        | "Bounced"
      hr_department:
        | "production"
        | "sales"
        | "finance"
        | "hr"
        | "it"
        | "procurement"
        | "quality"
        | "maintenance"
        | "installation"
        | "cutting"
        | "projects"
        | "administration"
        | "management"
      inspection_result: "pass" | "fail" | "conditional" | "rework" | "scrap"
      inspection_status: "draft" | "completed" | "verified" | "cancelled"
      inspection_type:
        | "incoming"
        | "in_process"
        | "final"
        | "installation"
        | "maintenance"
        | "audit"
      installation_priority: "low" | "medium" | "high" | "urgent"
      installation_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "delayed"
        | "cancelled"
        | "rescheduled"
        | "partial"
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
      invoice_status:
        | "Draft"
        | "Sent"
        | "Partial"
        | "Paid"
        | "Overdue"
        | "Cancelled"
        | "Credit Note"
      issue_severity: "Low" | "Medium" | "High" | "Critical"
      issue_type:
        | "material_shortage"
        | "machine_breakdown"
        | "quality_problem"
        | "staff_shortage"
        | "design_issue"
        | "other"
      leave_status: "pending" | "approved" | "rejected" | "cancelled" | "taken"
      leave_type:
        | "annual"
        | "sick"
        | "maternity"
        | "paternity"
        | "bereavement"
        | "unpaid"
        | "study"
        | "compensatory"
        | "emergency"
        | "other"
      maintenance_priority: "critical" | "high" | "medium" | "low" | "planned"
      maintenance_status:
        | "scheduled"
        | "pending_parts"
        | "in_progress"
        | "completed"
        | "overdue"
        | "cancelled"
        | "deferred"
      maintenance_type:
        | "preventive"
        | "corrective"
        | "emergency"
        | "predictive"
        | "calibration"
        | "inspection"
        | "overhaul"
      ncr_status:
        | "open"
        | "investigating"
        | "corrective_action"
        | "verified"
        | "closed"
        | "rejected"
      order_payment_method:
        | "Cash"
        | "Bank Transfer"
        | "TeleBirr"
        | "Cheque"
        | "Credit"
      order_payment_status: "Paid" | "Partial" | "Unpaid"
      order_status:
        | "Draft"
        | "Quote Accepted"
        | "Payment Received"
        | "Processing"
        | "Ready"
        | "Shipped"
        | "Delivered"
        | "Completed"
        | "Cancelled"
      payment_terms:
        | "COD"
        | "Net 15"
        | "Net 30"
        | "Net 45"
        | "Net 60"
        | "LC"
        | "TT Advance"
        | "TT Partial"
      payroll_status: "draft" | "calculated" | "approved" | "paid" | "cancelled"
      po_approval_status: "Pending" | "Approved" | "Rejected"
      po_status:
        | "Draft"
        | "Pending Approval"
        | "Sent"
        | "Confirmed"
        | "Shipped"
        | "Partial"
        | "Received"
        | "Cancelled"
        | "On Hold"
        | "Disputed"
      position_level:
        | "entry"
        | "junior"
        | "senior"
        | "supervisor"
        | "manager"
        | "director"
        | "executive"
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
      production_stage:
        | "Pending"
        | "Cutting"
        | "Machining"
        | "Assembly"
        | "Welding"
        | "Glazing"
        | "Quality Check"
        | "Packaging"
        | "Completed"
        | "On Hold"
        | "Cancelled"
      project_product_status: "pending" | "ordered" | "received" | "installed"
      project_status:
        | "Quote"
        | "Deposit"
        | "Materials Ordered"
        | "Production"
        | "Ready"
        | "Installation"
        | "Completed"
        | "On Hold"
        | "Cancelled"
      project_type: "Residential" | "Commercial" | "Industrial" | "Government"
      quality_check_result: "pass" | "fail" | "conditional"
      quote_status:
        | "Draft"
        | "Pending"
        | "Accepted"
        | "Rejected"
        | "Expired"
        | "Converted"
      shipping_method: "Pickup" | "Local Delivery" | "Freight" | "Courier"
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
      work_order_priority: "Low" | "Medium" | "High" | "Urgent" | "Critical"
      work_order_status:
        | "Draft"
        | "Scheduled"
        | "In Progress"
        | "On Hold"
        | "Completed"
        | "Cancelled"
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
      complaint_severity: ["low", "medium", "high", "critical"],
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
      cutting_job_status: ["Pending", "In Progress", "Completed", "Cancelled"],
      defect_severity: ["critical", "major", "minor", "observation"],
      employment_status: [
        "active",
        "probation",
        "notice",
        "terminated",
        "resigned",
        "retired",
        "on_leave",
        "suspended",
      ],
      employment_type: [
        "full_time",
        "part_time",
        "contract",
        "intern",
        "temporary",
        "consultant",
      ],
      equipment_category: [
        "cutting_machine",
        "cnc_machine",
        "welding_machine",
        "assembly_line",
        "glass_processing",
        "painting_line",
        "hand_tools",
        "power_tools",
        "compressor",
        "generator",
        "forklift",
        "vehicle",
        "measuring_device",
        "testing_equipment",
      ],
      equipment_status: [
        "operational",
        "under_maintenance",
        "breakdown",
        "decommissioned",
      ],
      expense_category: [
        "Materials",
        "Labor",
        "Equipment",
        "Transport",
        "Utilities",
        "Rent",
        "Salaries",
        "Marketing",
        "Other",
      ],
      finance_currency: ["ETB", "USD", "EUR", "CNY", "GBP"],
      finance_payment_method: [
        "Cash",
        "Bank Transfer",
        "TeleBirr",
        "Cheque",
        "Credit Card",
        "CBE Birr",
        "HelloCash",
        "Mobile Money",
      ],
      finance_payment_status: [
        "Pending",
        "Completed",
        "Failed",
        "Reversed",
        "Bounced",
      ],
      hr_department: [
        "production",
        "sales",
        "finance",
        "hr",
        "it",
        "procurement",
        "quality",
        "maintenance",
        "installation",
        "cutting",
        "projects",
        "administration",
        "management",
      ],
      inspection_result: ["pass", "fail", "conditional", "rework", "scrap"],
      inspection_status: ["draft", "completed", "verified", "cancelled"],
      inspection_type: [
        "incoming",
        "in_process",
        "final",
        "installation",
        "maintenance",
        "audit",
      ],
      installation_priority: ["low", "medium", "high", "urgent"],
      installation_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "delayed",
        "cancelled",
        "rescheduled",
        "partial",
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
      invoice_status: [
        "Draft",
        "Sent",
        "Partial",
        "Paid",
        "Overdue",
        "Cancelled",
        "Credit Note",
      ],
      issue_severity: ["Low", "Medium", "High", "Critical"],
      issue_type: [
        "material_shortage",
        "machine_breakdown",
        "quality_problem",
        "staff_shortage",
        "design_issue",
        "other",
      ],
      leave_status: ["pending", "approved", "rejected", "cancelled", "taken"],
      leave_type: [
        "annual",
        "sick",
        "maternity",
        "paternity",
        "bereavement",
        "unpaid",
        "study",
        "compensatory",
        "emergency",
        "other",
      ],
      maintenance_priority: ["critical", "high", "medium", "low", "planned"],
      maintenance_status: [
        "scheduled",
        "pending_parts",
        "in_progress",
        "completed",
        "overdue",
        "cancelled",
        "deferred",
      ],
      maintenance_type: [
        "preventive",
        "corrective",
        "emergency",
        "predictive",
        "calibration",
        "inspection",
        "overhaul",
      ],
      ncr_status: [
        "open",
        "investigating",
        "corrective_action",
        "verified",
        "closed",
        "rejected",
      ],
      order_payment_method: [
        "Cash",
        "Bank Transfer",
        "TeleBirr",
        "Cheque",
        "Credit",
      ],
      order_payment_status: ["Paid", "Partial", "Unpaid"],
      order_status: [
        "Draft",
        "Quote Accepted",
        "Payment Received",
        "Processing",
        "Ready",
        "Shipped",
        "Delivered",
        "Completed",
        "Cancelled",
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
      payroll_status: ["draft", "calculated", "approved", "paid", "cancelled"],
      po_approval_status: ["Pending", "Approved", "Rejected"],
      po_status: [
        "Draft",
        "Pending Approval",
        "Sent",
        "Confirmed",
        "Shipped",
        "Partial",
        "Received",
        "Cancelled",
        "On Hold",
        "Disputed",
      ],
      position_level: [
        "entry",
        "junior",
        "senior",
        "supervisor",
        "manager",
        "director",
        "executive",
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
      production_stage: [
        "Pending",
        "Cutting",
        "Machining",
        "Assembly",
        "Welding",
        "Glazing",
        "Quality Check",
        "Packaging",
        "Completed",
        "On Hold",
        "Cancelled",
      ],
      project_product_status: ["pending", "ordered", "received", "installed"],
      project_status: [
        "Quote",
        "Deposit",
        "Materials Ordered",
        "Production",
        "Ready",
        "Installation",
        "Completed",
        "On Hold",
        "Cancelled",
      ],
      project_type: ["Residential", "Commercial", "Industrial", "Government"],
      quality_check_result: ["pass", "fail", "conditional"],
      quote_status: [
        "Draft",
        "Pending",
        "Accepted",
        "Rejected",
        "Expired",
        "Converted",
      ],
      shipping_method: ["Pickup", "Local Delivery", "Freight", "Courier"],
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
      work_order_priority: ["Low", "Medium", "High", "Urgent", "Critical"],
      work_order_status: [
        "Draft",
        "Scheduled",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled",
      ],
    },
  },
} as const
