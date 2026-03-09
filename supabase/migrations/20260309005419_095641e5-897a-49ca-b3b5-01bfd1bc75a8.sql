-- Create Enums
CREATE TYPE public.production_stage AS ENUM ('Pending', 'Cutting', 'Machining', 'Assembly', 'Welding', 'Glazing', 'Quality Check', 'Packaging', 'Completed', 'On Hold', 'Cancelled');
CREATE TYPE public.work_order_priority AS ENUM ('Low', 'Medium', 'High', 'Urgent', 'Critical');
CREATE TYPE public.work_order_status AS ENUM ('Draft', 'Scheduled', 'In Progress', 'On Hold', 'Completed', 'Cancelled');
CREATE TYPE public.issue_type AS ENUM ('material_shortage', 'machine_breakdown', 'quality_problem', 'staff_shortage', 'design_issue', 'other');
CREATE TYPE public.issue_severity AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE public.cutting_job_status AS ENUM ('Pending', 'In Progress', 'Completed', 'Cancelled');
CREATE TYPE public.quality_check_result AS ENUM ('pass', 'fail', 'conditional');

-- Work Orders Table
CREATE TABLE public.work_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    work_order_number TEXT NOT NULL UNIQUE,
    project_id UUID, 
    customer_id UUID REFERENCES public.customers(id),
    quote_id UUID, 
    product_id UUID REFERENCES public.products(id),
    
    quantity INTEGER NOT NULL DEFAULT 1,
    completed INTEGER NOT NULL DEFAULT 0,
    remaining INTEGER NOT NULL DEFAULT 1,
    scrap INTEGER NOT NULL DEFAULT 0,
    rework INTEGER NOT NULL DEFAULT 0,
    good_units INTEGER NOT NULL DEFAULT 0,
    
    scheduled_start DATE,
    scheduled_end DATE,
    actual_start DATE,
    actual_end DATE,
    
    est_hours NUMERIC DEFAULT 0,
    est_labor_cost NUMERIC DEFAULT 0,
    est_material_cost NUMERIC DEFAULT 0,
    est_overhead_cost NUMERIC DEFAULT 0,
    est_total_cost NUMERIC DEFAULT 0,
    
    act_hours NUMERIC DEFAULT 0,
    act_labor_cost NUMERIC DEFAULT 0,
    act_material_cost NUMERIC DEFAULT 0,
    act_overhead_cost NUMERIC DEFAULT 0,
    act_total_cost NUMERIC DEFAULT 0,
    
    status public.work_order_status NOT NULL DEFAULT 'Draft',
    current_stage public.production_stage NOT NULL DEFAULT 'Pending',
    priority public.work_order_priority NOT NULL DEFAULT 'Medium',
    progress NUMERIC DEFAULT 0,
    
    notes TEXT,
    supervisor_notes TEXT,
    
    is_overdue BOOLEAN DEFAULT false,
    is_at_risk BOOLEAN DEFAULT false,
    is_blocked BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and managers can manage work_orders"
ON public.work_orders FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Users can view work_orders"
ON public.work_orders FOR SELECT
USING (true);

-- Work Order Materials Table
CREATE TABLE public.work_order_materials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES public.inventory_items(id),
    quantity_required NUMERIC NOT NULL DEFAULT 0,
    quantity_consumed NUMERIC NOT NULL DEFAULT 0,
    unit TEXT,
    estimated_unit_cost NUMERIC DEFAULT 0,
    actual_unit_cost NUMERIC DEFAULT 0,
    is_from_bom BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.work_order_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and managers can manage work_order_materials" ON public.work_order_materials FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));
CREATE POLICY "Users can view work_order_materials" ON public.work_order_materials FOR SELECT USING (true);


-- Labor Entries Table
CREATE TABLE public.labor_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES public.profiles(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    hours NUMERIC NOT NULL DEFAULT 0,
    stage public.production_stage,
    task TEXT,
    hourly_rate NUMERIC DEFAULT 0,
    is_overtime BOOLEAN DEFAULT false,
    overtime_multiplier NUMERIC DEFAULT 1.5,
    units_produced INTEGER DEFAULT 0,
    approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.labor_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and managers can manage labor_entries" ON public.labor_entries FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));
CREATE POLICY "Users can view labor_entries" ON public.labor_entries FOR SELECT USING (true);


-- Production Issues Table
CREATE TABLE public.production_issues (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    issue_number TEXT NOT NULL UNIQUE,
    work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
    type public.issue_type NOT NULL,
    severity public.issue_severity NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    reported_by UUID REFERENCES public.profiles(id),
    reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    estimated_delay NUMERIC DEFAULT 0,
    cost_impact NUMERIC DEFAULT 0,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.profiles(id),
    resolution TEXT
);

ALTER TABLE public.production_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and managers can manage production_issues" ON public.production_issues FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));
CREATE POLICY "Users can view production_issues" ON public.production_issues FOR SELECT USING (true);


-- Cutting Jobs Table
CREATE TABLE public.cutting_jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    job_number TEXT NOT NULL UNIQUE,
    work_order_id UUID REFERENCES public.work_orders(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES public.inventory_items(id),
    
    stock_length NUMERIC DEFAULT 0,
    stocks_used INTEGER DEFAULT 0,
    total_cuts INTEGER DEFAULT 0,
    total_cut_length NUMERIC DEFAULT 0,
    waste NUMERIC DEFAULT 0,
    waste_percent NUMERIC DEFAULT 0,
    
    optimized BOOLEAN DEFAULT false,
    efficiency NUMERIC DEFAULT 0,
    
    assignee UUID REFERENCES public.profiles(id),
    machine TEXT,
    
    scheduled_date DATE,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    
    material_cost NUMERIC DEFAULT 0,
    waste_cost NUMERIC DEFAULT 0,
    labor_cost NUMERIC DEFAULT 0,
    
    status public.cutting_job_status NOT NULL DEFAULT 'Pending',
    priority public.work_order_priority NOT NULL DEFAULT 'Medium',
    
    quality_checked BOOLEAN DEFAULT false,
    quality_result public.quality_check_result,
    quality_notes TEXT,
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.cutting_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and managers can manage cutting_jobs" ON public.cutting_jobs FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));
CREATE POLICY "Users can view cutting_jobs" ON public.cutting_jobs FOR SELECT USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON public.work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cutting_jobs_updated_at BEFORE UPDATE ON public.cutting_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();