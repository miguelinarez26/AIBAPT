-- ============================================================================
-- AIBAPT — Fix Applications Schema: Añadir metadata y flexibilizar documents
-- Descripción: Permite guardar datos extra del trámite (monto, modalidad) y 
--              flexibiliza los tipos de documentos permitidos.
-- Fecha: 2026-04-30
-- ============================================================================

-- 1. Añadir columna metadata a applications
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Quitar la restricción estricta de document_type para aceptar los nombres de UniversalStepper
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_document_type_check;

-- (Opcional) Podemos añadir una restricción más permisiva o simplemente dejarlo como TEXT
-- para que el UniversalStepper pueda enviar cualquier key de archivo.
