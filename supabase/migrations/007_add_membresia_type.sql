-- ============================================================================
-- AIBAPT — Migración 007: Tipo de acreditación para Solicitud de Membresía
-- Descripción: Inserta el registro en accreditation_types que permite
--              al UniversalStepper vincular las solicitudes de membresía
--              con un type_id válido en la tabla applications.
--              También flexibiliza el constraint de status para soportar
--              el estado intermedio 'uploading' del patrón Saga.
-- Fecha: 2026-05-08
-- ============================================================================

-- 1. Insertar tipo de acreditación para membresía
INSERT INTO public.accreditation_types (name, fee_member, fee_non_member)
VALUES ('solicitud_membresia', 45, 60)
ON CONFLICT (name) DO NOTHING;

-- 2. Actualizar constraint de status para incluir 'uploading' (patrón Saga)
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE public.applications ADD CONSTRAINT applications_status_check
  CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'uploading'));
