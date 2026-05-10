-- ============================================================================
-- AIBAPT — Nuevos Tipos de Acreditación EMDR (Norma 2026)
-- Descripción: 
-- 1. Añade el tipo unificado 'EMDR_Certification' para el nuevo Stepper.
-- 2. Asegura que los montos base existan en la tabla de referencia.
-- Fecha: 2026-05-09
-- ============================================================================

-- Insertar el tipo unificado si no existe
INSERT INTO public.accreditation_types (name, fee_member, fee_non_member)
VALUES ('EMDR_Certification', 0, 0)
ON CONFLICT (name) DO NOTHING;

-- Nota: Los precios específicos se gestionan dinámicamente en el Stepper 
-- según el nivel seleccionado (0, 20, 40 o 50 €).
