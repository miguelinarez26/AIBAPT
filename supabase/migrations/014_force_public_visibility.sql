-- ============================================================================
-- AIBAPT — Automatización de Visibilidad en Directorio Profesional
-- Descripción: 
-- 1. Cambia el valor por defecto de is_public a true.
-- 2. Fuerza la visibilidad de todos los socios actuales.
-- Fecha: 2026-05-09
-- ============================================================================

-- 1. Cambiar valor por defecto para futuros registros
ALTER TABLE public.profiles ALTER COLUMN is_public SET DEFAULT true;

-- 2. Actualizar socios actuales para que sean públicos por defecto
UPDATE public.profiles 
SET is_public = true 
WHERE is_member = true;

-- Nota: A partir de ahora, la visibilidad se gestiona automáticamente 
-- mediante la lógica de negocio al aprobar la membresía.
