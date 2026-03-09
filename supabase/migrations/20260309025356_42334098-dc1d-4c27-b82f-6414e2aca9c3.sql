
CREATE OR REPLACE FUNCTION public.complete_work_order(p_work_order_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_wo RECORD;
  v_mat RECORD;
BEGIN
  SELECT * INTO v_wo FROM public.work_orders WHERE id = p_work_order_id;
  
  IF v_wo.id IS NULL THEN
    RAISE EXCEPTION 'Work order not found';
  END IF;
  
  IF v_wo.status = 'Completed' THEN
    RAISE EXCEPTION 'Work order is already completed';
  END IF;

  IF v_wo.good_units <= 0 THEN
    RAISE EXCEPTION 'Cannot complete: no good units produced. Record production output first.';
  END IF;
  
  FOR v_mat IN 
    SELECT * FROM public.work_order_materials WHERE work_order_id = v_wo.id
  LOOP
    IF v_mat.inventory_item_id IS NOT NULL THEN
      UPDATE public.inventory_items 
      SET 
        stock = stock - v_mat.quantity_required,
        reserved = reserved - v_mat.quantity_required
      WHERE id = v_mat.inventory_item_id;
      
      UPDATE public.work_order_materials
      SET quantity_consumed = v_mat.quantity_required
      WHERE id = v_mat.id;
    END IF;
  END LOOP;
  
  IF v_wo.product_id IS NOT NULL THEN
    UPDATE public.inventory_items
    SET stock = stock + v_wo.good_units
    WHERE product_id = v_wo.product_id AND status = 'active'
    AND id = (
      SELECT id FROM public.inventory_items 
      WHERE product_id = v_wo.product_id AND status = 'active' 
      ORDER BY created_at DESC LIMIT 1
    );
  END IF;
  
  UPDATE public.work_orders 
  SET 
    status = 'Completed',
    current_stage = 'Completed',
    actual_end = CURRENT_DATE,
    progress = 100,
    completed = v_wo.good_units,
    remaining = v_wo.quantity - v_wo.good_units - v_wo.scrap
  WHERE id = v_wo.id;
  
  RETURN true;
END;
$function$;
