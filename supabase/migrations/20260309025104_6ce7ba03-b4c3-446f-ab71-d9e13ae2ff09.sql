
CREATE OR REPLACE FUNCTION public.start_work_order(p_work_order_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_wo RECORD;
  v_bom RECORD;
  v_inv RECORD;
  v_needed numeric;
  v_available numeric;
BEGIN
  SELECT * INTO v_wo FROM public.work_orders WHERE id = p_work_order_id;
  
  IF v_wo.id IS NULL THEN
    RAISE EXCEPTION 'Work order not found';
  END IF;
  
  IF v_wo.status != 'Draft' AND v_wo.status != 'Scheduled' THEN
    RAISE EXCEPTION 'Work order is already started or completed';
  END IF;
  
  FOR v_bom IN 
    SELECT * FROM public.product_bom WHERE product_id = v_wo.product_id
  LOOP
    v_needed := v_bom.quantity * v_wo.quantity;
    
    IF v_bom.inventory_item_id IS NOT NULL THEN
      BEGIN
        SELECT * INTO v_inv FROM public.inventory_items 
        WHERE id = v_bom.inventory_item_id::uuid AND status = 'active'
        ORDER BY created_at ASC LIMIT 1;
      EXCEPTION WHEN OTHERS THEN
      END;
      
      IF v_inv.id IS NOT NULL THEN
        v_available := v_inv.stock - v_inv.reserved;
        IF v_available < v_needed THEN
            RAISE EXCEPTION 'Insufficient stock for %', v_bom.name;
        END IF;
        
        UPDATE public.inventory_items 
        SET reserved = reserved + v_needed
        WHERE id = v_inv.id;
        
        INSERT INTO public.work_order_materials (
          work_order_id, inventory_item_id, quantity_required, quantity_consumed,
          is_from_bom, estimated_unit_cost, unit
        ) VALUES (
          v_wo.id, v_inv.id, v_needed, 0, true, v_inv.unit_cost, v_bom.unit
        );
      END IF;
    END IF;
  END LOOP;
  
  UPDATE public.work_orders 
  SET 
    status = 'In Progress',
    current_stage = 'Cutting',
    actual_start = CURRENT_DATE,
    progress = 11
  WHERE id = v_wo.id;
  
  RETURN true;
END;
$function$;
