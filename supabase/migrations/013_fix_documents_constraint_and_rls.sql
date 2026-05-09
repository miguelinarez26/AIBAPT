-- ============================================================================
-- AIBAPT — Reparación de Vínculos de Documentos y RLS Admin
-- Descripción: 
-- 1. Elimina la restricción CHECK de document_type que bloqueaba nuevos trámites.
-- 2. Actualiza políticas RLS de documents para usar is_admin() y evitar fallos.
-- Fecha: 2026-05-09
-- ============================================================================

-- -------------------------------------------------------
-- 1. ELIMINAR RESTRICCIÓN DE TIPO (Bloqueo Crítico)
-- -------------------------------------------------------
-- La restricción original solo permitía ('cv', 'formulario', 'caso_clinico', 'pago')
-- lo que hacía que fallaran todas las nuevas subidas del UniversalStepper.
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_document_type_check;

-- -------------------------------------------------------
-- 2. ACTUALIZAR RLS DE DOCUMENTS (Para que el Admin vea los archivos)
-- -------------------------------------------------------

-- Eliminar políticas antiguas con posibles recursiones o ineficientes
DROP POLICY IF EXISTS "documents_select_admin" ON public.documents;
DROP POLICY IF EXISTS "documents_select_own" ON public.documents;
DROP POLICY IF EXISTS "documents_insert_own" ON public.documents;

-- Política de Lectura para el Dueño
CREATE POLICY "documents_select_own"
ON public.documents FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.applications a
        WHERE a.id = documents.application_id AND a.user_id = auth.uid()
    )
);

-- Política de Lectura para el Admin (Usando la función segura is_admin)
CREATE POLICY "documents_select_admin"
ON public.documents FOR SELECT
TO authenticated
USING (public.is_admin());

-- Política de Inserción para el Dueño
CREATE POLICY "documents_insert_own"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.applications a
        WHERE a.id = documents.application_id AND a.user_id = auth.uid()
    )
);
