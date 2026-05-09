-- ============================================================================
-- AIBAPT — Fix RLS: Permitir a usuarios confirmar sus propias solicitudes
-- Descripción: Permite que el Stepper cambie el estado de 'uploading' a 'pending'.
-- Fecha: 2026-05-08
-- ============================================================================

-- Permitir que los usuarios actualicen sus propias solicitudes
-- Esto es crítico para el flujo del Stepper (uploading -> pending)
DROP POLICY IF EXISTS "applications_update_own" ON public.applications;

CREATE POLICY "applications_update_own" 
ON public.applications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Verificar que RLS esté habilitado (ya debería estarlo, pero por seguridad)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
