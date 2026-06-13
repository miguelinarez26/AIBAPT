-- Actualización de la función RPC generate_member_number
-- Ejecuta este script en el editor SQL de Supabase para agregar las nuevas categorías y prefijos.

CREATE OR REPLACE FUNCTION public.generate_member_number(p_category text, p_language text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_prefix text;
  v_lang_code text;
  v_seq_val integer;
  v_member_number text;
BEGIN
  -- Determinar prefijo según categoría
  CASE p_category
    WHEN 'pleno_salud_mental' THEN v_prefix := '201';
    WHEN 'pleno_agente_social' THEN v_prefix := '202';
    WHEN 'institucional' THEN v_prefix := '700';
    WHEN 'simpatizante' THEN v_prefix := '800';
    WHEN 'bienhechor' THEN v_prefix := '500';
    -- Certificados
    WHEN 'certificado', 'psico_cert_default', 'psico_senior_default', 'psico_master_default', 'renovacion_psicoterapeuta', 'equivalencia_psicoterapeuta', 'EMDR_Psicoterapeuta' THEN v_prefix := '301';
    WHEN 'emdr_basico_default' THEN v_prefix := '302';
    -- Supervisores y Docentes
    WHEN 'supervisor', 'sup_cert_default', 'sup_senior_default', 'renovacion_supervisor', 'equivalencia_supervisor', 'EMDR_Supervisor' THEN v_prefix := '401';
    ELSE v_prefix := '999';
  END CASE;

  -- Determinar código de idioma
  IF p_language = 'pt' THEN
    v_lang_code := '01';
  ELSE
    v_lang_code := '02';
  END IF;

  -- Obtener siguiente valor de la secuencia existente
  v_seq_val := nextval('member_number_seq');

  -- Formatear como PREFIX.LANG.SEQUENCE (ej. 301.02.045)
  v_member_number := v_prefix || '.' || v_lang_code || '.' || lpad(v_seq_val::text, 3, '0');

  RETURN v_member_number;
END;
$function$;
