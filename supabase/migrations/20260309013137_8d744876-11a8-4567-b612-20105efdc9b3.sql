ALTER FUNCTION public.handle_new_product_inventory() SET search_path TO 'public';
ALTER FUNCTION public.sync_inventory_to_product() SET search_path TO 'public';
ALTER FUNCTION public.start_work_order(UUID) SET search_path TO 'public';
ALTER FUNCTION public.complete_work_order(UUID) SET search_path TO 'public';