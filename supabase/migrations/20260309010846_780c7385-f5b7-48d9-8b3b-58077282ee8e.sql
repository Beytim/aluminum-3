ALTER TABLE public.products 
ADD COLUMN installation_instructions TEXT,
ADD COLUMN images TEXT[] DEFAULT '{}',
ADD COLUMN alternative_products UUID[] DEFAULT '{}',
ADD COLUMN certifications TEXT[] DEFAULT '{}';