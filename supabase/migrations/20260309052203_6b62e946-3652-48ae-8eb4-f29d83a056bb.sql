
-- Enums for projects
CREATE TYPE public.project_type AS ENUM ('Residential', 'Commercial', 'Industrial', 'Government');
CREATE TYPE public.project_status AS ENUM ('Quote', 'Deposit', 'Materials Ordered', 'Production', 'Ready', 'Installation', 'Completed', 'On Hold', 'Cancelled');
CREATE TYPE public.project_product_status AS ENUM ('pending', 'ordered', 'received', 'installed');

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_am TEXT NOT NULL DEFAULT '',
  
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_contact TEXT,
  customer_phone TEXT,
  
  type public.project_type NOT NULL DEFAULT 'Residential',
  status public.project_status NOT NULL DEFAULT 'Quote',
  
  value NUMERIC NOT NULL DEFAULT 0,
  deposit NUMERIC NOT NULL DEFAULT 0,
  deposit_percentage NUMERIC NOT NULL DEFAULT 0,
  balance NUMERIC NOT NULL DEFAULT 0,
  material_cost NUMERIC NOT NULL DEFAULT 0,
  labor_cost NUMERIC NOT NULL DEFAULT 0,
  overhead_cost NUMERIC NOT NULL DEFAULT 0,
  total_cost NUMERIC NOT NULL DEFAULT 0,
  profit NUMERIC NOT NULL DEFAULT 0,
  profit_margin NUMERIC NOT NULL DEFAULT 0,
  
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_date DATE,
  due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  completed_date DATE,
  
  progress NUMERIC NOT NULL DEFAULT 0,
  
  milestones JSONB NOT NULL DEFAULT '{"depositPaid":false,"materialsOrdered":false,"materialsReceived":false,"productionStarted":false,"productionCompleted":false,"installationStarted":false,"installationCompleted":false,"finalPayment":false}'::jsonb,
  
  quote_id TEXT,
  work_order_ids TEXT[] DEFAULT '{}',
  purchase_order_ids TEXT[] DEFAULT '{}',
  invoice_ids TEXT[] DEFAULT '{}',
  payment_ids TEXT[] DEFAULT '{}',
  installation_ids TEXT[] DEFAULT '{}',
  
  project_manager TEXT NOT NULL DEFAULT 'Unassigned',
  project_manager_id UUID,
  team_members TEXT[] DEFAULT '{}',
  
  notes TEXT,
  internal_notes TEXT,
  
  is_overdue BOOLEAN NOT NULL DEFAULT false,
  is_at_risk BOOLEAN NOT NULL DEFAULT false,
  
  timeline JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT 'Admin',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT NOT NULL DEFAULT 'Admin'
);

-- Project products table
CREATE TABLE public.project_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  status public.project_product_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_products ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Authenticated users can view projects"
  ON public.projects FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can insert projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins and managers can update projects"
  ON public.projects FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Project products policies
CREATE POLICY "Authenticated users can view project_products"
  ON public.project_products FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage project_products"
  ON public.project_products FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
