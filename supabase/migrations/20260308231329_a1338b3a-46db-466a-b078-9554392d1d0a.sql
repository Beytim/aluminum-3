
-- Supplier status enum
CREATE TYPE public.supplier_status AS ENUM ('Active', 'Inactive', 'Blacklisted', 'Pending', 'Prospect');
CREATE TYPE public.supplier_business_type AS ENUM ('Manufacturer', 'Distributor', 'Agent', 'Trader', 'Importer');
CREATE TYPE public.proc_currency AS ENUM ('ETB', 'USD', 'EUR', 'CNY', 'GBP', 'AED', 'TRY');
CREATE TYPE public.payment_terms AS ENUM ('COD', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'LC', 'TT Advance', 'TT Partial');

-- Suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_code TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_name_am TEXT NOT NULL DEFAULT '',
  trading_name TEXT,
  business_type supplier_business_type NOT NULL DEFAULT 'Manufacturer',
  contact_person TEXT NOT NULL DEFAULT '',
  position TEXT,
  phone TEXT NOT NULL DEFAULT '',
  phone_secondary TEXT,
  email TEXT NOT NULL DEFAULT '',
  website TEXT,
  country TEXT NOT NULL DEFAULT 'Ethiopia',
  city TEXT,
  address TEXT,
  tax_id TEXT,
  payment_terms payment_terms NOT NULL DEFAULT 'Net 30',
  currency proc_currency NOT NULL DEFAULT 'ETB',
  bank_name TEXT,
  bank_account TEXT,
  swift_code TEXT,
  credit_limit NUMERIC NOT NULL DEFAULT 0,
  credit_used NUMERIC NOT NULL DEFAULT 0,
  product_categories TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  rating NUMERIC NOT NULL DEFAULT 3,
  on_time_delivery_rate NUMERIC NOT NULL DEFAULT 0,
  quality_rating NUMERIC NOT NULL DEFAULT 0,
  response_time_hrs NUMERIC NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  average_order_value NUMERIC NOT NULL DEFAULT 0,
  last_order_date DATE,
  average_lead_time INTEGER NOT NULL DEFAULT 30,
  min_order_qty INTEGER,
  shipping_terms TEXT[] DEFAULT '{FOB}',
  preferred BOOLEAN NOT NULL DEFAULT false,
  approved BOOLEAN NOT NULL DEFAULT false,
  status supplier_status NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view suppliers"
  ON public.suppliers FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can insert suppliers"
  ON public.suppliers FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins and managers can update suppliers"
  ON public.suppliers FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins can delete suppliers"
  ON public.suppliers FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Auto-update updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.suppliers;

-- Update products table to reference suppliers by UUID
ALTER TABLE public.products 
  ALTER COLUMN supplier_id TYPE UUID USING supplier_id::UUID;

ALTER TABLE public.products
  ADD CONSTRAINT products_supplier_id_fkey 
  FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;
