-- Create enums for inventory
CREATE TYPE public.inventory_quality_status AS ENUM ('quarantine', 'approved', 'rejected', 'returned');
CREATE TYPE public.inventory_item_status AS ENUM ('active', 'inactive', 'discontinued', 'obsolete');
CREATE TYPE public.inventory_movement_type AS ENUM ('receipt', 'issue', 'transfer', 'adjustment', 'return', 'damaged', 'count');

-- Create inventory_items table
CREATE TABLE public.inventory_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    item_code TEXT NOT NULL UNIQUE,
    batch_number TEXT,
    supplier_batch TEXT,
    is_remnant BOOLEAN NOT NULL DEFAULT FALSE,
    parent_item_id UUID REFERENCES public.inventory_items(id),
    original_length NUMERIC,
    remaining_length NUMERIC,
    is_reusable BOOLEAN DEFAULT TRUE,
    stock NUMERIC NOT NULL DEFAULT 0,
    reserved NUMERIC NOT NULL DEFAULT 0,
    warehouse TEXT,
    zone TEXT,
    rack TEXT,
    shelf TEXT,
    bin TEXT,
    quality_status public.inventory_quality_status NOT NULL DEFAULT 'quarantine',
    received_date DATE,
    unit_cost NUMERIC NOT NULL DEFAULT 0,
    status public.inventory_item_status NOT NULL DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory_items
CREATE POLICY "Admins and managers can manage inventory_items" 
ON public.inventory_items 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Authenticated users can view inventory_items" 
ON public.inventory_items 
FOR SELECT 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create inventory_movements table
CREATE TABLE public.inventory_movements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    movement_number TEXT NOT NULL UNIQUE,
    inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE CASCADE NOT NULL,
    type public.inventory_movement_type NOT NULL,
    quantity NUMERIC NOT NULL,
    previous_stock NUMERIC NOT NULL,
    new_stock NUMERIC NOT NULL,
    source_type TEXT,
    source_id UUID,
    from_location TEXT,
    to_location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory_movements
CREATE POLICY "Admins and managers can manage inventory_movements" 
ON public.inventory_movements 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Authenticated users can view inventory_movements" 
ON public.inventory_movements 
FOR SELECT 
USING (true);

-- Create stock update function/trigger
CREATE OR REPLACE FUNCTION public.update_inventory_stock_on_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- This trigger updates the inventory_item stock based on the movement
    IF NEW.type IN ('receipt', 'return', 'adjustment') AND NEW.quantity > 0 THEN
        UPDATE public.inventory_items 
        SET stock = stock + NEW.quantity 
        WHERE id = NEW.inventory_item_id;
    ELSIF NEW.type IN ('issue', 'damaged') THEN
        UPDATE public.inventory_items 
        SET stock = stock - NEW.quantity 
        WHERE id = NEW.inventory_item_id;
    ELSIF NEW.type = 'adjustment' AND NEW.quantity < 0 THEN
        UPDATE public.inventory_items 
        SET stock = stock + NEW.quantity -- quantity is already negative
        WHERE id = NEW.inventory_item_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_update_inventory_stock
AFTER INSERT ON public.inventory_movements
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_stock_on_movement();