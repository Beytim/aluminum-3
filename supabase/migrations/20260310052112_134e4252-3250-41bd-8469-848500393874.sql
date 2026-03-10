
-- ══════════════════════════════════════════
-- ENUMS FOR ALL REMAINING MODULES
-- ══════════════════════════════════════════

-- Orders
CREATE TYPE public.order_status AS ENUM ('Draft', 'Quote Accepted', 'Payment Received', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Completed', 'Cancelled');
CREATE TYPE public.order_payment_status AS ENUM ('Paid', 'Partial', 'Unpaid');
CREATE TYPE public.order_payment_method AS ENUM ('Cash', 'Bank Transfer', 'TeleBirr', 'Cheque', 'Credit');
CREATE TYPE public.shipping_method AS ENUM ('Pickup', 'Local Delivery', 'Freight', 'Courier');

-- Quotes
CREATE TYPE public.quote_status AS ENUM ('Draft', 'Pending', 'Accepted', 'Rejected', 'Expired', 'Converted');

-- Finance
CREATE TYPE public.invoice_status AS ENUM ('Draft', 'Sent', 'Partial', 'Paid', 'Overdue', 'Cancelled', 'Credit Note');
CREATE TYPE public.finance_payment_method AS ENUM ('Cash', 'Bank Transfer', 'TeleBirr', 'Cheque', 'Credit Card', 'CBE Birr', 'HelloCash', 'Mobile Money');
CREATE TYPE public.finance_currency AS ENUM ('ETB', 'USD', 'EUR', 'CNY', 'GBP');
CREATE TYPE public.expense_category AS ENUM ('Materials', 'Labor', 'Equipment', 'Transport', 'Utilities', 'Rent', 'Salaries', 'Marketing', 'Other');
CREATE TYPE public.finance_payment_status AS ENUM ('Pending', 'Completed', 'Failed', 'Reversed', 'Bounced');

-- HR
CREATE TYPE public.employment_status AS ENUM ('active', 'probation', 'notice', 'terminated', 'resigned', 'retired', 'on_leave', 'suspended');
CREATE TYPE public.employment_type AS ENUM ('full_time', 'part_time', 'contract', 'intern', 'temporary', 'consultant');
CREATE TYPE public.hr_department AS ENUM ('production', 'sales', 'finance', 'hr', 'it', 'procurement', 'quality', 'maintenance', 'installation', 'cutting', 'projects', 'administration', 'management');
CREATE TYPE public.position_level AS ENUM ('entry', 'junior', 'senior', 'supervisor', 'manager', 'director', 'executive');
CREATE TYPE public.leave_type AS ENUM ('annual', 'sick', 'maternity', 'paternity', 'bereavement', 'unpaid', 'study', 'compensatory', 'emergency', 'other');
CREATE TYPE public.leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'taken');
CREATE TYPE public.payroll_status AS ENUM ('draft', 'calculated', 'approved', 'paid', 'cancelled');

-- Installation
CREATE TYPE public.installation_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'delayed', 'cancelled', 'rescheduled', 'partial');
CREATE TYPE public.installation_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Maintenance
CREATE TYPE public.maintenance_status AS ENUM ('scheduled', 'pending_parts', 'in_progress', 'completed', 'overdue', 'cancelled', 'deferred');
CREATE TYPE public.maintenance_priority AS ENUM ('critical', 'high', 'medium', 'low', 'planned');
CREATE TYPE public.maintenance_type AS ENUM ('preventive', 'corrective', 'emergency', 'predictive', 'calibration', 'inspection', 'overhaul');
CREATE TYPE public.equipment_category AS ENUM ('cutting_machine', 'cnc_machine', 'welding_machine', 'assembly_line', 'glass_processing', 'painting_line', 'hand_tools', 'power_tools', 'compressor', 'generator', 'forklift', 'vehicle', 'measuring_device', 'testing_equipment');
CREATE TYPE public.equipment_status AS ENUM ('operational', 'under_maintenance', 'breakdown', 'decommissioned');

-- Quality
CREATE TYPE public.inspection_type AS ENUM ('incoming', 'in_process', 'final', 'installation', 'maintenance', 'audit');
CREATE TYPE public.inspection_result AS ENUM ('pass', 'fail', 'conditional', 'rework', 'scrap');
CREATE TYPE public.inspection_status AS ENUM ('draft', 'completed', 'verified', 'cancelled');
CREATE TYPE public.defect_severity AS ENUM ('critical', 'major', 'minor', 'observation');
CREATE TYPE public.ncr_status AS ENUM ('open', 'investigating', 'corrective_action', 'verified', 'closed', 'rejected');
CREATE TYPE public.complaint_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Procurement
CREATE TYPE public.po_status AS ENUM ('Draft', 'Pending Approval', 'Sent', 'Confirmed', 'Shipped', 'Partial', 'Received', 'Cancelled', 'On Hold', 'Disputed');
CREATE TYPE public.po_approval_status AS ENUM ('Pending', 'Approved', 'Rejected');

-- ══════════════════════════════════════════
-- ORDERS TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.customers(id),
  customer_name text NOT NULL DEFAULT '',
  customer_phone text,
  quote_id text,
  quote_number text,
  project_id uuid REFERENCES public.projects(id),
  project_name text,
  work_order_ids text[] DEFAULT '{}',
  cutting_job_ids text[] DEFAULT '{}',
  order_date date NOT NULL DEFAULT CURRENT_DATE,
  requested_delivery date,
  actual_delivery date,
  due_date date NOT NULL DEFAULT (CURRENT_DATE + interval '14 days'),
  status public.order_status NOT NULL DEFAULT 'Draft',
  payment_status public.order_payment_status NOT NULL DEFAULT 'Unpaid',
  is_overdue boolean NOT NULL DEFAULT false,
  shipping_method public.shipping_method,
  shipping_address text,
  tracking_number text,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric NOT NULL DEFAULT 0,
  discount_total numeric NOT NULL DEFAULT 0,
  tax_rate numeric NOT NULL DEFAULT 15,
  tax numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  total_cost numeric NOT NULL DEFAULT 0,
  total_profit numeric NOT NULL DEFAULT 0,
  profit_margin numeric NOT NULL DEFAULT 0,
  payments jsonb NOT NULL DEFAULT '[]',
  total_paid numeric NOT NULL DEFAULT 0,
  balance numeric NOT NULL DEFAULT 0,
  payment_method public.order_payment_method,
  deliveries jsonb NOT NULL DEFAULT '[]',
  total_shipped integer NOT NULL DEFAULT 0,
  total_delivered integer NOT NULL DEFAULT 0,
  activity_log jsonb NOT NULL DEFAULT '[]',
  notes text,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'Admin',
  created_by_name text NOT NULL DEFAULT 'Admin',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text NOT NULL DEFAULT 'Admin',
  updated_by_name text NOT NULL DEFAULT 'Admin'
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));
CREATE POLICY "Admins and managers can update orders" ON public.orders FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ══════════════════════════════════════════
-- QUOTES TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text NOT NULL UNIQUE,
  version text NOT NULL DEFAULT '1.0',
  version_history jsonb NOT NULL DEFAULT '[]',
  customer_id uuid REFERENCES public.customers(id),
  customer_name text NOT NULL DEFAULT '',
  customer_code text NOT NULL DEFAULT '',
  customer_contact text,
  customer_email text,
  customer_phone text,
  customer_snapshot jsonb NOT NULL DEFAULT '{}',
  project_id uuid REFERENCES public.projects(id),
  project_name text NOT NULL DEFAULT '',
  project_status text,
  title text NOT NULL DEFAULT '',
  description text,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric NOT NULL DEFAULT 0,
  discount_type text,
  discount_value numeric DEFAULT 0,
  discount_amount numeric NOT NULL DEFAULT 0,
  taxable_amount numeric NOT NULL DEFAULT 0,
  installation_cost numeric NOT NULL DEFAULT 0,
  transport_cost numeric NOT NULL DEFAULT 0,
  cutting_fee numeric NOT NULL DEFAULT 0,
  finish_upcharge numeric NOT NULL DEFAULT 0,
  rush_fee numeric NOT NULL DEFAULT 0,
  other_fees numeric NOT NULL DEFAULT 0,
  fees_description text,
  tax_rate numeric NOT NULL DEFAULT 15,
  tax_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  total_cost numeric NOT NULL DEFAULT 0,
  total_profit numeric NOT NULL DEFAULT 0,
  profit_margin numeric NOT NULL DEFAULT 0,
  quote_date date NOT NULL DEFAULT CURRENT_DATE,
  expiry_date date NOT NULL DEFAULT (CURRENT_DATE + interval '30 days'),
  validity_days integer NOT NULL DEFAULT 30,
  converted_date date,
  status public.quote_status NOT NULL DEFAULT 'Draft',
  payment_terms text NOT NULL DEFAULT 'Net 30',
  delivery_terms text,
  warranty text,
  finish_type text,
  notes text,
  terms_and_conditions text,
  internal_notes text,
  activity_log jsonb NOT NULL DEFAULT '[]',
  is_expired boolean NOT NULL DEFAULT false,
  is_converted boolean NOT NULL DEFAULT false,
  currency text NOT NULL DEFAULT 'ETB',
  created_by text NOT NULL DEFAULT 'Admin',
  created_by_name text NOT NULL DEFAULT 'Admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_by text NOT NULL DEFAULT 'Admin',
  updated_by_name text NOT NULL DEFAULT 'Admin',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view quotes" ON public.quotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can insert quotes" ON public.quotes FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));
CREATE POLICY "Admins and managers can update quotes" ON public.quotes FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));
CREATE POLICY "Admins can delete quotes" ON public.quotes FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ══════════════════════════════════════════
-- INVOICES TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.customers(id),
  customer_name text NOT NULL DEFAULT '',
  customer_code text NOT NULL DEFAULT '',
  customer_tax_id text,
  customer_address text,
  project_id uuid REFERENCES public.projects(id),
  project_name text,
  order_id uuid,
  order_number text,
  quote_id uuid,
  quote_number text,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL DEFAULT (CURRENT_DATE + interval '30 days'),
  paid_date date,
  status public.invoice_status NOT NULL DEFAULT 'Draft',
  currency public.finance_currency NOT NULL DEFAULT 'ETB',
  exchange_rate numeric NOT NULL DEFAULT 1,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric NOT NULL DEFAULT 0,
  discount_amount numeric NOT NULL DEFAULT 0,
  taxable_amount numeric NOT NULL DEFAULT 0,
  tax_rate numeric NOT NULL DEFAULT 15,
  tax_amount numeric NOT NULL DEFAULT 0,
  shipping_cost numeric NOT NULL DEFAULT 0,
  other_charges numeric NOT NULL DEFAULT 0,
  charges_description text,
  total numeric NOT NULL DEFAULT 0,
  total_in_etb numeric NOT NULL DEFAULT 0,
  payments jsonb NOT NULL DEFAULT '[]',
  total_paid numeric NOT NULL DEFAULT 0,
  total_paid_in_etb numeric NOT NULL DEFAULT 0,
  balance numeric NOT NULL DEFAULT 0,
  balance_in_etb numeric NOT NULL DEFAULT 0,
  payment_terms text NOT NULL DEFAULT 'Net 30',
  payment_due_days integer NOT NULL DEFAULT 30,
  notes text,
  terms_and_conditions text,
  internal_notes text,
  is_overdue boolean NOT NULL DEFAULT false,
  is_fully_paid boolean NOT NULL DEFAULT false,
  activity_log jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'Admin',
  created_by_name text NOT NULL DEFAULT 'Admin',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view invoices" ON public.invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage invoices" ON public.invoices FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- FINANCE PAYMENTS TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.finance_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number text NOT NULL UNIQUE,
  invoice_id uuid REFERENCES public.invoices(id),
  invoice_number text NOT NULL DEFAULT '',
  customer_id uuid REFERENCES public.customers(id),
  customer_name text NOT NULL DEFAULT '',
  date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric NOT NULL DEFAULT 0,
  currency public.finance_currency NOT NULL DEFAULT 'ETB',
  exchange_rate numeric NOT NULL DEFAULT 1,
  amount_in_etb numeric NOT NULL DEFAULT 0,
  method public.finance_payment_method NOT NULL DEFAULT 'Cash',
  reference text NOT NULL DEFAULT '',
  bank_name text,
  account_number text,
  transaction_id text,
  cheque_number text,
  phone_number text,
  status public.finance_payment_status NOT NULL DEFAULT 'Completed',
  reconciled boolean NOT NULL DEFAULT false,
  reconciled_date date,
  notes text,
  recorded_by text NOT NULL DEFAULT 'Admin',
  recorded_by_name text NOT NULL DEFAULT 'Admin',
  recorded_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.finance_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view finance_payments" ON public.finance_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage finance_payments" ON public.finance_payments FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- EXPENSES TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_number text NOT NULL UNIQUE,
  supplier_id uuid REFERENCES public.suppliers(id),
  supplier_name text,
  project_id uuid REFERENCES public.projects(id),
  project_name text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category public.expense_category NOT NULL DEFAULT 'Other',
  description text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  currency public.finance_currency NOT NULL DEFAULT 'ETB',
  exchange_rate numeric NOT NULL DEFAULT 1,
  amount_in_etb numeric NOT NULL DEFAULT 0,
  tax_rate numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  payment_method public.finance_payment_method NOT NULL DEFAULT 'Cash',
  paid boolean NOT NULL DEFAULT false,
  paid_date date,
  notes text,
  created_by text NOT NULL DEFAULT 'Admin',
  created_by_name text NOT NULL DEFAULT 'Admin',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view expenses" ON public.expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage expenses" ON public.expenses FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- EMPLOYEES TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_number text NOT NULL UNIQUE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  full_name text NOT NULL DEFAULT '',
  first_name_am text,
  last_name_am text,
  full_name_am text,
  gender text NOT NULL DEFAULT 'male',
  date_of_birth date,
  marital_status text,
  personal_email text NOT NULL DEFAULT '',
  work_email text NOT NULL DEFAULT '',
  personal_phone text NOT NULL DEFAULT '',
  work_phone text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relation text,
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  sub_city text,
  national_id text,
  tax_id text,
  pension_number text,
  department public.hr_department NOT NULL DEFAULT 'production',
  position text NOT NULL DEFAULT '',
  position_level public.position_level NOT NULL DEFAULT 'entry',
  employment_type public.employment_type NOT NULL DEFAULT 'full_time',
  status public.employment_status NOT NULL DEFAULT 'active',
  reports_to text,
  reports_to_name text,
  hire_date date NOT NULL DEFAULT CURRENT_DATE,
  probation_end_date date,
  confirmation_date date,
  termination_date date,
  termination_reason text,
  salary numeric NOT NULL DEFAULT 0,
  salary_currency text NOT NULL DEFAULT 'ETB',
  bank_name text,
  bank_account text,
  bank_branch text,
  health_insurance boolean NOT NULL DEFAULT false,
  pension_enrolled boolean NOT NULL DEFAULT false,
  transportation_allowance numeric NOT NULL DEFAULT 0,
  meal_allowance numeric NOT NULL DEFAULT 0,
  housing_allowance numeric NOT NULL DEFAULT 0,
  leave_balances jsonb NOT NULL DEFAULT '{"annual": 20, "sick": 10}',
  leave_accrual_rate numeric NOT NULL DEFAULT 1.67,
  attendance jsonb NOT NULL DEFAULT '{"totalDays": 0, "presentDays": 0, "absentDays": 0, "lateDays": 0, "overtime": 0, "attendanceRate": 0}',
  performance_rating integer NOT NULL DEFAULT 3,
  last_review_date date,
  next_review_date date,
  skills jsonb NOT NULL DEFAULT '[]',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'Admin',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text NOT NULL DEFAULT 'Admin'
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage employees" ON public.employees FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- LEAVE REQUESTS TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text NOT NULL UNIQUE,
  employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name text NOT NULL DEFAULT '',
  leave_type public.leave_type NOT NULL DEFAULT 'annual',
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL DEFAULT CURRENT_DATE,
  days_requested numeric NOT NULL DEFAULT 1,
  reason text NOT NULL DEFAULT '',
  status public.leave_status NOT NULL DEFAULT 'pending',
  submitted_date date NOT NULL DEFAULT CURRENT_DATE,
  approved_by text,
  approved_by_name text,
  approved_date date,
  rejection_reason text,
  handover_to text,
  handover_notes text,
  remaining_balance_after numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view leave_requests" ON public.leave_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage leave_requests" ON public.leave_requests FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- PAYROLLS TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.payrolls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_number text NOT NULL UNIQUE,
  period text NOT NULL DEFAULT '',
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name text NOT NULL DEFAULT '',
  employee_number text NOT NULL DEFAULT '',
  department public.hr_department NOT NULL DEFAULT 'production',
  base_salary numeric NOT NULL DEFAULT 0,
  overtime_hours numeric NOT NULL DEFAULT 0,
  overtime_rate numeric NOT NULL DEFAULT 0,
  overtime_pay numeric NOT NULL DEFAULT 0,
  transportation_allowance numeric NOT NULL DEFAULT 0,
  meal_allowance numeric NOT NULL DEFAULT 0,
  housing_allowance numeric NOT NULL DEFAULT 0,
  total_allowances numeric NOT NULL DEFAULT 0,
  performance_bonus numeric NOT NULL DEFAULT 0,
  attendance_bonus numeric NOT NULL DEFAULT 0,
  total_bonuses numeric NOT NULL DEFAULT 0,
  gross_pay numeric NOT NULL DEFAULT 0,
  income_tax numeric NOT NULL DEFAULT 0,
  pension numeric NOT NULL DEFAULT 0,
  health_insurance numeric NOT NULL DEFAULT 0,
  loan_repayment numeric NOT NULL DEFAULT 0,
  total_deductions numeric NOT NULL DEFAULT 0,
  net_pay numeric NOT NULL DEFAULT 0,
  bank_name text NOT NULL DEFAULT '',
  bank_account text NOT NULL DEFAULT '',
  status public.payroll_status NOT NULL DEFAULT 'draft',
  calculated_by text NOT NULL DEFAULT 'Admin',
  calculated_by_name text NOT NULL DEFAULT 'Admin',
  calculated_at timestamptz NOT NULL DEFAULT now(),
  approved_by text,
  approved_by_name text,
  approved_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view payrolls" ON public.payrolls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage payrolls" ON public.payrolls FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- INSTALLATIONS TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.installations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_number text NOT NULL UNIQUE,
  project_id uuid REFERENCES public.projects(id),
  project_name text,
  order_id uuid,
  order_number text,
  customer_id uuid REFERENCES public.customers(id),
  customer_name text NOT NULL DEFAULT '',
  customer_code text NOT NULL DEFAULT '',
  customer_contact text,
  customer_phone text,
  customer_email text,
  quote_id text,
  site_address text NOT NULL DEFAULT '',
  site_city text,
  site_sub_city text,
  site_contact_person text,
  site_contact_phone text,
  access_instructions text,
  items jsonb NOT NULL DEFAULT '[]',
  scheduled_date date NOT NULL DEFAULT CURRENT_DATE,
  scheduled_start_time text,
  scheduled_end_time text,
  estimated_duration numeric NOT NULL DEFAULT 4,
  actual_start_date date,
  actual_end_date date,
  status public.installation_status NOT NULL DEFAULT 'scheduled',
  priority public.installation_priority NOT NULL DEFAULT 'medium',
  team_lead text NOT NULL DEFAULT '',
  team_lead_id text NOT NULL DEFAULT '',
  team_members jsonb NOT NULL DEFAULT '[]',
  team_size integer NOT NULL DEFAULT 1,
  assigned_vehicle text,
  completion_notes text,
  customer_signature text,
  completion_photos jsonb NOT NULL DEFAULT '[]',
  completed_by text,
  completed_at timestamptz,
  issues jsonb NOT NULL DEFAULT '[]',
  has_issues boolean NOT NULL DEFAULT false,
  issue_count integer NOT NULL DEFAULT 0,
  weather_delay boolean DEFAULT false,
  site_access_delay boolean DEFAULT false,
  material_delay boolean DEFAULT false,
  delay_reasons text[] DEFAULT '{}',
  delay_hours numeric DEFAULT 0,
  customer_rating integer,
  customer_feedback text,
  is_overdue boolean NOT NULL DEFAULT false,
  is_today boolean NOT NULL DEFAULT false,
  requires_follow_up boolean NOT NULL DEFAULT false,
  notes text,
  notes_am text,
  internal_notes text,
  activity_log jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'Admin',
  created_by_name text NOT NULL DEFAULT 'Admin',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text NOT NULL DEFAULT 'Admin',
  updated_by_name text NOT NULL DEFAULT 'Admin'
);

ALTER TABLE public.installations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view installations" ON public.installations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage installations" ON public.installations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- EQUIPMENT TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_number text NOT NULL UNIQUE,
  name text NOT NULL DEFAULT '',
  name_am text,
  category public.equipment_category NOT NULL DEFAULT 'cutting_machine',
  manufacturer text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  serial_number text NOT NULL DEFAULT '',
  year_of_manufacture integer NOT NULL DEFAULT 2020,
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  purchase_cost numeric NOT NULL DEFAULT 0,
  location text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  power_rating text,
  capacity text,
  maintenance_frequency jsonb NOT NULL DEFAULT '{"type": "monthly", "value": 1}',
  total_operating_hours numeric NOT NULL DEFAULT 0,
  warranty_expiry date,
  supplier_id uuid REFERENCES public.suppliers(id),
  supplier_name text,
  status public.equipment_status NOT NULL DEFAULT 'operational',
  health_score integer NOT NULL DEFAULT 100,
  criticality text NOT NULL DEFAULT 'medium',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view equipment" ON public.equipment FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage equipment" ON public.equipment FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- MAINTENANCE TASKS TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.maintenance_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_number text NOT NULL UNIQUE,
  equipment_id uuid REFERENCES public.equipment(id),
  equipment_name text NOT NULL DEFAULT '',
  equipment_number text NOT NULL DEFAULT '',
  equipment_category public.equipment_category NOT NULL DEFAULT 'cutting_machine',
  type public.maintenance_type NOT NULL DEFAULT 'preventive',
  priority public.maintenance_priority NOT NULL DEFAULT 'medium',
  status public.maintenance_status NOT NULL DEFAULT 'scheduled',
  scheduled_date date NOT NULL DEFAULT CURRENT_DATE,
  scheduled_duration numeric NOT NULL DEFAULT 1,
  start_date date,
  completion_date date,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  checklist jsonb NOT NULL DEFAULT '[]',
  assigned_to text[] DEFAULT '{}',
  assigned_to_names text[] DEFAULT '{}',
  lead_technician text,
  parts_used jsonb NOT NULL DEFAULT '[]',
  labor_hours numeric NOT NULL DEFAULT 0,
  labor_rate numeric NOT NULL DEFAULT 0,
  labor_cost numeric NOT NULL DEFAULT 0,
  parts_cost numeric NOT NULL DEFAULT 0,
  total_cost numeric NOT NULL DEFAULT 0,
  downtime_hours numeric,
  production_impact text,
  issues_found text[] DEFAULT '{}',
  root_cause text,
  corrective_action text,
  outcome text,
  follow_up_required boolean NOT NULL DEFAULT false,
  affected_work_orders text[] DEFAULT '{}',
  affected_projects text[] DEFAULT '{}',
  notes text,
  technician_notes text,
  is_overdue boolean NOT NULL DEFAULT false,
  is_emergency boolean NOT NULL DEFAULT false,
  requires_shutdown boolean NOT NULL DEFAULT false,
  activity_log jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'Admin',
  created_by_name text NOT NULL DEFAULT 'Admin',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view maintenance_tasks" ON public.maintenance_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage maintenance_tasks" ON public.maintenance_tasks FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- INSPECTIONS TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_number text NOT NULL UNIQUE,
  type public.inspection_type NOT NULL DEFAULT 'incoming',
  product_id uuid REFERENCES public.products(id),
  product_name text,
  product_code text,
  work_order_id uuid REFERENCES public.work_orders(id),
  work_order_number text,
  purchase_order_id uuid,
  purchase_order_number text,
  inventory_item_id uuid,
  inventory_item_code text,
  project_id uuid REFERENCES public.projects(id),
  project_name text,
  order_id uuid,
  order_number text,
  installation_id uuid,
  equipment_id uuid,
  supplier_id uuid REFERENCES public.suppliers(id),
  supplier_name text,
  inspector_id text NOT NULL DEFAULT '',
  inspector_name text NOT NULL DEFAULT '',
  inspector_dept text,
  scheduled_date date NOT NULL DEFAULT CURRENT_DATE,
  inspection_date date NOT NULL DEFAULT CURRENT_DATE,
  completed_date date,
  checklist_id text,
  checklist_name text,
  result public.inspection_result NOT NULL DEFAULT 'pass',
  score numeric,
  checklist_results jsonb NOT NULL DEFAULT '[]',
  defects jsonb NOT NULL DEFAULT '[]',
  defect_count integer NOT NULL DEFAULT 0,
  measurements jsonb,
  ncr_id text,
  ncr_number text,
  status public.inspection_status NOT NULL DEFAULT 'draft',
  notes text,
  created_by text NOT NULL DEFAULT 'Admin',
  created_by_name text NOT NULL DEFAULT 'Admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_by text NOT NULL DEFAULT 'Admin',
  updated_by_name text NOT NULL DEFAULT 'Admin',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view inspections" ON public.inspections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage inspections" ON public.inspections FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- NCRs TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.ncrs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ncr_number text NOT NULL UNIQUE,
  inspection_id uuid REFERENCES public.inspections(id),
  inspection_number text,
  product_id uuid REFERENCES public.products(id),
  product_name text,
  work_order_id uuid REFERENCES public.work_orders(id),
  work_order_number text,
  purchase_order_id uuid,
  purchase_order_number text,
  supplier_id uuid REFERENCES public.suppliers(id),
  supplier_name text,
  customer_id uuid REFERENCES public.customers(id),
  customer_name text,
  order_id uuid,
  order_number text,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  reported_date date NOT NULL DEFAULT CURRENT_DATE,
  reported_by text NOT NULL DEFAULT 'Admin',
  reported_by_name text NOT NULL DEFAULT 'Admin',
  severity public.defect_severity NOT NULL DEFAULT 'minor',
  category text NOT NULL DEFAULT 'product',
  quantity_affected numeric NOT NULL DEFAULT 0,
  quantity_unit text NOT NULL DEFAULT 'pcs',
  immediate_action text NOT NULL DEFAULT 'quarantine',
  quarantine_location text,
  investigation_required boolean NOT NULL DEFAULT false,
  investigation_status text NOT NULL DEFAULT 'not_started',
  investigation_summary text,
  root_cause text,
  root_cause_category text,
  capa_required boolean NOT NULL DEFAULT false,
  capa_id text,
  capa_number text,
  preventive_action text,
  verification_required boolean NOT NULL DEFAULT false,
  verification_status text NOT NULL DEFAULT 'pending',
  verified_by text,
  verified_date date,
  closure_date date,
  closed_by text,
  cost_impact numeric NOT NULL DEFAULT 0,
  time_impact numeric NOT NULL DEFAULT 0,
  scrap_value numeric,
  status public.ncr_status NOT NULL DEFAULT 'open',
  notes text,
  activity_log jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'Admin',
  created_by_name text NOT NULL DEFAULT 'Admin',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text NOT NULL DEFAULT 'Admin',
  updated_by_name text NOT NULL DEFAULT 'Admin'
);

ALTER TABLE public.ncrs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view ncrs" ON public.ncrs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage ncrs" ON public.ncrs FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- CUSTOMER COMPLAINTS TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.customer_complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.customers(id),
  customer_name text NOT NULL DEFAULT '',
  order_id uuid,
  order_number text,
  product_id uuid REFERENCES public.products(id),
  product_name text,
  installation_id uuid,
  date date NOT NULL DEFAULT CURRENT_DATE,
  received_by text NOT NULL DEFAULT '',
  channel text NOT NULL DEFAULT 'phone',
  subject text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'product_quality',
  severity public.complaint_severity NOT NULL DEFAULT 'medium',
  response_required boolean NOT NULL DEFAULT true,
  response_deadline date,
  responded boolean NOT NULL DEFAULT false,
  responded_date date,
  response_notes text,
  resolution text,
  resolved boolean NOT NULL DEFAULT false,
  resolved_date date,
  resolved_by text,
  ncr_id uuid,
  ncr_number text,
  cost_of_resolution numeric NOT NULL DEFAULT 0,
  customer_satisfaction integer,
  status text NOT NULL DEFAULT 'open',
  notes text,
  activity_log jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'Admin',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view customer_complaints" ON public.customer_complaints FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage customer_complaints" ON public.customer_complaints FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- PURCHASE ORDERS TABLE
-- ══════════════════════════════════════════
CREATE TABLE public.purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number text NOT NULL UNIQUE,
  supplier_id uuid REFERENCES public.suppliers(id),
  supplier_name text NOT NULL DEFAULT '',
  supplier_code text NOT NULL DEFAULT '',
  project_id uuid REFERENCES public.projects(id),
  project_name text,
  order_date date NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery date NOT NULL DEFAULT (CURRENT_DATE + interval '30 days'),
  shipped_date date,
  received_date date,
  status public.po_status NOT NULL DEFAULT 'Draft',
  approval_status public.po_approval_status NOT NULL DEFAULT 'Pending',
  approved_by text,
  currency public.proc_currency NOT NULL DEFAULT 'ETB',
  exchange_rate numeric NOT NULL DEFAULT 1,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric NOT NULL DEFAULT 0,
  discount_amount numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  shipping_cost numeric NOT NULL DEFAULT 0,
  shipping_terms text NOT NULL DEFAULT 'FOB',
  shipping_method text,
  tracking_number text,
  carrier text,
  insurance numeric NOT NULL DEFAULT 0,
  customs_duty numeric NOT NULL DEFAULT 0,
  other_charges numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  total_in_etb numeric NOT NULL DEFAULT 0,
  payment_terms public.payment_terms NOT NULL DEFAULT 'Net 30',
  paid numeric NOT NULL DEFAULT 0,
  paid_in_etb numeric NOT NULL DEFAULT 0,
  balance numeric NOT NULL DEFAULT 0,
  balance_in_etb numeric NOT NULL DEFAULT 0,
  payments jsonb NOT NULL DEFAULT '[]',
  receipts jsonb NOT NULL DEFAULT '[]',
  is_overdue boolean NOT NULL DEFAULT false,
  is_urgent boolean NOT NULL DEFAULT false,
  notes text,
  internal_notes text,
  activity_log jsonb NOT NULL DEFAULT '[]',
  created_by text NOT NULL DEFAULT 'Admin',
  created_by_name text NOT NULL DEFAULT 'Admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view purchase_orders" ON public.purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage purchase_orders" ON public.purchase_orders FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ══════════════════════════════════════════
-- UPDATE TRIGGERS
-- ══════════════════════════════════════════
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payrolls_updated_at BEFORE UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_installations_updated_at BEFORE UPDATE ON public.installations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON public.equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_tasks_updated_at BEFORE UPDATE ON public.maintenance_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON public.inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ncrs_updated_at BEFORE UPDATE ON public.ncrs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_complaints_updated_at BEFORE UPDATE ON public.customer_complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
