-- ============================================================================
-- AIBAPT — Fix: Función generate_member_number
-- Descripción: Recrea la función con la firma estándar (p_category, p_language)
--              eliminando cualquier versión previa que tuviera bugs o parámetros
--              con nombres distintos. Garantiza que el número de socio se genere
--              correctamente al aprobar una membresía.
-- Fecha: 2026-06-11
-- ============================================================================

-- Eliminar TODAS las versiones de la función para evitar ambigüedad en PostgREST
DROP FUNCTION IF EXISTS public.generate_member_number(TEXT, TEXT);

-- Crear la secuencia si por alguna razón no existe
CREATE SEQUENCE IF NOT EXISTS member_number_seq START WITH 1;

-- Recrear la función con firma canónica y cuerpo correcto
-- Formato resultado: [CÓD_CATEGORÍA].[CÓD_IDIOMA].[SECUENCIAL 3 dígitos]
-- Ejemplo: 201.02.001  →  Miembro Pleno Salud Mental · Español · Socio nº 1
CREATE OR REPLACE FUNCTION public.generate_member_number(
  p_category TEXT,
  p_language TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_cat_code    TEXT;
  v_lang_code   TEXT;
  v_sequential  BIGINT;
  v_result      TEXT;
BEGIN
  -- Mapeo de categoría a código numérico
  v_cat_code := CASE p_category
    WHEN 'pleno_salud_mental'  THEN '201'
    WHEN 'pleno_agente_social' THEN '202'
    WHEN 'institucional'       THEN '700'
    WHEN 'simpatizante'        THEN '800'
    WHEN 'bienhechor'          THEN '500'
    ELSE                            '999'
  END;

  -- Mapeo de idioma a código
  v_lang_code := CASE p_language
    WHEN 'pt' THEN '01'
    WHEN 'es' THEN '02'
    ELSE           '02'
  END;

  -- Siguiente valor atómico de la secuencia (seguro para concurrencia)
  v_sequential := nextval('member_number_seq');

  -- Formatear: 201.02.001
  v_result := v_cat_code || '.' || v_lang_code || '.' || lpad(v_sequential::TEXT, 3, '0');

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantizar que la función sea accesible vía PostgREST por roles autenticados y service_role
GRANT EXECUTE ON FUNCTION public.generate_member_number(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_member_number(TEXT, TEXT) TO service_role;

-- ============================================================================
-- CORRECCIÓN RETROACTIVA: Asignar número de socio a miembros aprobados sin número
-- ============================================================================
-- Genera y asigna member_number a cualquier perfil que:
--   1. is_member = true (ya fue aprobado)
--   2. member_number IS NULL (nunca recibió su número)
--   3. membership_type NO es 'ninguno' ni NULL
DO $$
DECLARE
  rec RECORD;
  generated_number TEXT;
BEGIN
  FOR rec IN
    SELECT id, membership_type, language_preference
    FROM public.profiles
    WHERE is_member = true
      AND member_number IS NULL
      AND membership_type IS NOT NULL
      AND membership_type != 'ninguno'
  LOOP
    generated_number := public.generate_member_number(rec.membership_type, COALESCE(rec.language_preference, 'es'));
    
    UPDATE public.profiles
    SET member_number = generated_number
    WHERE id = rec.id;
    
    RAISE NOTICE 'Número asignado a perfil %: %', rec.id, generated_number;
  END LOOP;
END;
$$;
