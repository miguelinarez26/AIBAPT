-- ============================================================================
-- AIBAPT — Refactorización de Perfiles y Matrícula Profesional
-- Descripción: Divide full_name en first_name/last_name, añade member_number
--              con constraint UNIQUE, y añade categoría 'simpatizante'.
-- Fecha: 2026-05-08
-- ============================================================================

-- 1. Añadir columnas first_name y last_name
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS last_name TEXT NOT NULL DEFAULT '';

-- 2. Migrar datos existentes: intentar dividir full_name en first_name/last_name
-- Si full_name contiene un espacio, todo antes del primer espacio es first_name,
-- el resto es last_name. Si no tiene espacio, todo va a first_name.
UPDATE public.profiles
SET
  first_name = COALESCE(
    CASE
      WHEN full_name IS NOT NULL AND full_name != '' AND position(' ' in full_name) > 0
        THEN substring(full_name from 1 for position(' ' in full_name) - 1)
      ELSE full_name
    END, ''),
  last_name = COALESCE(
    CASE
      WHEN full_name IS NOT NULL AND full_name != '' AND position(' ' in full_name) > 0
        THEN substring(full_name from position(' ' in full_name) + 1)
      ELSE ''
    END, '')
WHERE first_name = '' OR first_name IS NULL;

-- 3. Añadir member_number con constraint UNIQUE
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS member_number TEXT UNIQUE;

-- 4. Actualizar el tipo membership_type para incluir 'simpatizante'
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_membership_type_check;

-- Permitir los valores ampliados de membership_type
-- (Se usa CHECK en lugar de ENUM para flexibilidad)
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_membership_type_check
CHECK (membership_type IS NULL OR membership_type IN (
  'institucional',
  'pleno_salud_mental',
  'pleno_agente_social',
  'simpatizante',
  'bienhechor',
  'certificado',
  'supervisor',
  'ninguno'
));

-- 5. Actualizar el trigger handle_new_user para usar first_name y last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    role,
    is_member,
    membership_type,
    language_preference
  )
  VALUES (
    NEW.id,
    NEW.email,
    -- Mantener full_name como concatenación limpia para retrocompatibilidad
    TRIM(COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '')),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'member',
    false,
    'ninguno',
    COALESCE(NEW.raw_user_meta_data->>'language_preference', 'es')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Crear una secuencia para el número de matrícula (concurrencia segura)
CREATE SEQUENCE IF NOT EXISTS member_number_seq START WITH 1;

-- Función para generar el número de matrícula
-- Formato: [Código Categoría].[Código Idioma].[Secuencial 3 dígitos]
CREATE OR REPLACE FUNCTION public.generate_member_number(
  p_category TEXT,
  p_language TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_cat_code TEXT;
  v_lang_code TEXT;
  v_sequential BIGINT;
  v_member_number TEXT;
BEGIN
  -- Mapear categoría a código
  v_cat_code := CASE p_category
    WHEN 'pleno_salud_mental' THEN '201'
    WHEN 'pleno_agente_social' THEN '202'
    WHEN 'institucional' THEN '700'
    WHEN 'simpatizante' THEN '800'
    WHEN 'bienhechor' THEN '500'
    ELSE '999'
  END;

  -- Mapear idioma a código
  v_lang_code := CASE p_language
    WHEN 'pt' THEN '01'
    WHEN 'es' THEN '02'
    ELSE '02'
  END;

  -- Obtener el siguiente valor de la secuencia (Atómico y seguro para concurrencia)
  v_sequential := nextval('member_number_seq');

  -- Formatear número: CAT.LANG.SEQ (ej: 201.02.001)
  v_member_number := v_cat_code || '.' || v_lang_code || '.' || lpad(v_sequential::TEXT, 3, '0');

  RETURN v_member_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Insertar tipo de acreditación simpatizante si no existe
INSERT INTO public.accreditation_types (name, fee_member, fee_non_member)
SELECT 'solicitud_simpatizante', 0, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.accreditation_types WHERE name = 'solicitud_simpatizante'
);
