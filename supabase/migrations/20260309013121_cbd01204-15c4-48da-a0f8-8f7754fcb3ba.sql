-- 1. Trigger to create inventory item when a product is created
CREATE OR REPLACE FUNCTION public.handle_new_product_inventory()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.inventory_items (
    product_id,
    item_code,
    stock,
    reserved,
    unit_cost,
    status,
    quality_status,
    is_remnant
  ) VALUES (
    NEW.id,
    NEW.code,
    NEW.current_stock,
    NEW.reserved_stock,
    NEW.material_cost,
    'active',
    'approved',
    false
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_product_created_inventory ON public.products;
CREATE TRIGGER on_product_created_inventory
  AFTER INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_product_inventory();

-- 2. Trigger to sync inventory changes back to the product's aggregate stock
CREATE OR REPLACE FUNCTION public.sync_inventory_to_product()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_product_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_product_id := OLD.product_id;
  ELSE
    v_product_id := NEW.product_id;
  END IF;

  IF v_product_id IS NOT NULL THEN
    UPDATE public.products
    SET 
      current_stock = (SELECT COALESCE(SUM(stock), 0) FROM public.inventory_items WHERE product_id = v_product_id AND status = 'active'),
      reserved_stock = (SELECT COALESCE(SUM(reserved), 0) FROM public.inventory_items WHERE product_id = v_product_id AND status = 'active')
    WHERE id = v_product_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_inventory_on_change ON public.inventory_items;
CREATE TRIGGER sync_inventory_on_change
  AFTER INSERT OR UPDATE OF stock, reserved, status OR DELETE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.sync_inventory_to_product();

-- 3. Function to start work order and reserve materials from BOM
CREATE OR REPLACE FUNCTION public.start_work_order(p_work_order_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wo RECORD;
  v_bom RECORD;
  v_inv RECORD;
  v_needed numeric;
  v_available numeric;
BEGIN
  -- Get work order
  SELECT * INTO v_wo FROM public.work_orders WHERE id = p_work_order_id;
  
  IF v_wo.id IS NULL THEN
    RAISE EXCEPTION 'Work order not found';
  END IF;
  
  IF v_wo.status != 'Draft' AND v_wo.status != 'Scheduled' THEN
    RAISE EXCEPTION 'Work order is already started or completed';
  END IF;
  
  -- For each item in BOM of the product
  FOR v_bom IN 
    SELECT * FROM public.product_bom WHERE product_id = v_wo.product_id
  LOOP
    v_needed := v_bom.quantity * v_wo.quantity;
    
    IF v_bom.inventory_item_id IS NOT NULL THEN
      -- Try to find exact inventory item
      BEGIN
        SELECT * INTO v_inv FROM public.inventory_items 
        WHERE id = v_bom.inventory_item_id::uuid AND status = 'active'
        ORDER BY created_at ASC LIMIT 1;
      EXCEPTION WHEN OTHERS THEN
        -- If UUID cast fails, ignore
      END;
      
      IF v_inv.id IS NOT NULL THEN
        -- Check if enough stock
        v_available := v_inv.stock - v_inv.reserved;
        IF v_available < v_needed THEN
            RAISE EXCEPTION 'Insufficient stock for %', v_bom.name;
        END IF;
        
        -- Update inventory (reserve it)
        UPDATE public.inventory_items 
        SET reserved = reserved + v_needed
        WHERE id = v_inv.id;
        
        -- Add to work_order_materials
        INSERT INTO public.work_order_materials (
          work_order_id,
          inventory_item_id,
          quantity_required,
          quantity_consumed,
          is_from_bom,
          estimated_unit_cost,
          unit
        ) VALUES (
          v_wo.id,
          v_inv.id,
          v_needed,
          0,
          true,
          v_inv.unit_cost,
          v_bom.unit
        );
      END IF;
    END IF;
  END LOOP;
  
  -- Update work order status
  UPDATE public.work_orders 
  SET 
    status = 'In Progress',
    current_stage = 'Pending',
    actual_start = CURRENT_DATE
  WHERE id = v_wo.id;
  
  RETURN true;
END;
$$;

-- 4. Function to complete work order and consume materials
CREATE OR REPLACE FUNCTION public.complete_work_order(p_work_order_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wo RECORD;
  v_mat RECORD;
BEGIN
  -- Get work order
  SELECT * INTO v_wo FROM public.work_orders WHERE id = p_work_order_id;
  
  IF v_wo.id IS NULL THEN
    RAISE EXCEPTION 'Work order not found';
  END IF;
  
  IF v_wo.status = 'Completed' THEN
    RAISE EXCEPTION 'Work order is already completed';
  END IF;
  
  -- Process materials
  FOR v_mat IN 
    SELECT * FROM public.work_order_materials WHERE work_order_id = v_wo.id
  LOOP
    IF v_mat.inventory_item_id IS NOT NULL THEN
      -- Consume reserved stock (decrease both stock and reserved)
      UPDATE public.inventory_items 
      SET 
        stock = stock - v_mat.quantity_required,
        reserved = reserved - v_mat.quantity_required
      WHERE id = v_mat.inventory_item_id;
      
      -- Update material as consumed
      UPDATE public.work_order_materials
      SET quantity_consumed = v_mat.quantity_required
      WHERE id = v_mat.id;
    END IF;
  END LOOP;
  
  -- Increase finished goods inventory
  IF v_wo.product_id IS NOT NULL THEN
    -- Try to find an existing active inventory item for this product
    UPDATE public.inventory_items
    SET stock = stock + v_wo.good_units
    WHERE product_id = v_wo.product_id AND status = 'active'
    AND id = (
      SELECT id FROM public.inventory_items 
      WHERE product_id = v_wo.product_id AND status = 'active' 
      ORDER BY created_at DESC LIMIT 1
    );
  END IF;
  
  -- Update work order status
  UPDATE public.work_orders 
  SET 
    status = 'Completed',
    current_stage = 'Completed',
    actual_end = CURRENT_DATE,
    progress = 100
  WHERE id = v_wo.id;
  
  RETURN true;
END;
$$;
