
-- ═══════════════════════════════════════════
-- PRODUCTS TABLE - Core product catalog
-- ═══════════════════════════════════════════

CREATE TYPE public.product_category AS ENUM (
  'Windows', 'Doors', 'Curtain Walls', 'Handrails', 'Louvers', 
  'Partitions', 'Sheet', 'Plate', 'Bar/Rod', 'Tube/Pipe', 
  'Angle', 'Channel', 'Beam', 'Profile', 'Coil', 'Custom'
);

CREATE TYPE public.product_type AS ENUM (
  'Raw Material', 'Fabricated', 'System', 'Custom'
);

CREATE TYPE public.product_status AS ENUM (
  'Active', 'Inactive', 'Discontinued', 'Draft'
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  name_am text NOT NULL DEFAULT '',
  category product_category NOT NULL,
  subcategory text DEFAULT '',
  product_type product_type NOT NULL DEFAULT 'Fabricated',
  status product_status NOT NULL DEFAULT 'Active',

  -- Specifications
  profile text DEFAULT '',
  glass text DEFAULT '',
  colors text[] DEFAULT '{}',
  alloy_type text,
  temper text,
  form text,

  -- Dimensions
  width numeric,
  length numeric,
  height numeric,
  thickness numeric,
  diameter numeric,
  wall_thickness numeric,
  weight_per_meter numeric,
  weight_per_piece numeric,

  -- Labor
  labor_hrs numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',

  -- Cost breakdown
  profile_cost numeric NOT NULL DEFAULT 0,
  glass_cost numeric NOT NULL DEFAULT 0,
  hardware_cost numeric NOT NULL DEFAULT 0,
  accessories_cost numeric NOT NULL DEFAULT 0,
  fab_labor_cost numeric NOT NULL DEFAULT 0,
  install_labor_cost numeric NOT NULL DEFAULT 0,
  overhead_percent numeric NOT NULL DEFAULT 20,
  material_cost numeric NOT NULL DEFAULT 0,

  -- Pricing
  selling_price numeric NOT NULL DEFAULT 0,
  purchase_price numeric,
  markup_percent numeric,

  -- Stock
  current_stock integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 0,
  max_stock integer NOT NULL DEFAULT 0,
  reserved_stock integer NOT NULL DEFAULT 0,
  warehouse_location text,

  -- Supplier
  supplier_id text,
  supplier_name text,
  lead_time_days integer,
  moq integer,

  -- Quality
  inspection_required boolean NOT NULL DEFAULT true,
  defect_rate numeric,

  -- Versioning
  version text NOT NULL DEFAULT '1.0',
  effective_date date,

  -- Batch/Traceability
  batch_number text,
  mill_certificate boolean DEFAULT false,
  date_received date,

  -- Tags & Notes
  tags text[] DEFAULT '{}',
  notes text,

  -- Audit
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ═══════════════════════════════════════════
-- PRODUCT BOM (Bill of Materials)
-- ═══════════════════════════════════════════

CREATE TYPE public.bom_component_type AS ENUM (
  'Profile', 'Hardware', 'Glass', 'Accessory', 'Other'
);

CREATE TABLE public.product_bom (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  component_type bom_component_type NOT NULL,
  name text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'm',
  unit_cost numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  inventory_item_id text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════
-- PRODUCT PRICE HISTORY
-- ═══════════════════════════════════════════

CREATE TABLE public.product_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  selling_price numeric NOT NULL,
  cost_price numeric NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  changed_by_name text DEFAULT '',
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════
-- PRODUCT QUALITY STANDARDS
-- ═══════════════════════════════════════════

CREATE TABLE public.product_quality_standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  parameter text NOT NULL,
  specification text NOT NULL,
  tolerance text NOT NULL DEFAULT '',
  test_method text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_quality_standards ENABLE ROW LEVEL SECURITY;

-- Products: all authenticated users can read
CREATE POLICY "Authenticated users can view products"
  ON public.products FOR SELECT TO authenticated USING (true);

-- Products: admins and managers can insert/update/delete
CREATE POLICY "Admins and managers can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins and managers can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- BOM: same as products
CREATE POLICY "Authenticated users can view bom"
  ON public.product_bom FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and managers can manage bom"
  ON public.product_bom FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Price history: same
CREATE POLICY "Authenticated users can view price history"
  ON public.product_price_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and managers can manage price history"
  ON public.product_price_history FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Quality standards: same
CREATE POLICY "Authenticated users can view quality standards"
  ON public.product_quality_standards FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and managers can manage quality standards"
  ON public.product_quality_standards FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Enable realtime for products
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
