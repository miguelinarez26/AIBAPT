-- ============================================================================
-- AIBAPT — Language Preference Migration
-- Descripción: Añade preferencia de idioma a perfiles y actualiza el trigger
-- Fecha: 2026-04-30
-- ============================================================================

-- 1. Añadir columna language_preference a profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS language_preference TEXT NOT NULL DEFAULT 'es'
CHECK (language_preference IN ('es', 'pt'));

-- 2. Actualizar el trigger function handle_new_user para capturar idioma de metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    membership_status,
    language_preference
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user',
    'inactive',
    COALESCE(NEW.raw_user_meta_data->>'language_preference', 'es')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
