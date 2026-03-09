
-- Add missing columns to cutting_jobs for full cutting module integration
ALTER TABLE public.cutting_jobs 
  ADD COLUMN IF NOT EXISTS cuts numeric[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS optimization_layout jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS remnants jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS material_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS material_category text DEFAULT 'Profile',
  ADD COLUMN IF NOT EXISTS alloy_type text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS temper text DEFAULT NULL;
