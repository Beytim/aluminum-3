
-- Add approved flag to profiles (default false for new users)
ALTER TABLE public.profiles ADD COLUMN approved boolean NOT NULL DEFAULT false;

-- The existing user (first signup) should be approved and admin
UPDATE public.profiles SET approved = true WHERE id = 'f723c308-b692-4739-9e1e-65e3374eca97';

-- Update handle_new_user to auto-approve + set admin if first user, otherwise pending
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_count integer;
BEGIN
  SELECT count(*) INTO user_count FROM public.profiles;
  
  IF user_count = 0 THEN
    -- First user: auto-approve and make admin
    INSERT INTO public.profiles (id, full_name, avatar_url, approved)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
      true
    );
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    -- Subsequent users: pending approval
    INSERT INTO public.profiles (id, full_name, avatar_url, approved)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
      false
    );
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policy: admins can update approval status
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
