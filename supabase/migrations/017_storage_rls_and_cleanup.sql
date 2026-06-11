-- ============================================================================
-- AIBAPT — Migración 017: Políticas RLS de Storage y Limpieza de Tablas Legacy
-- Descripción:
--   1. Reconfigura el bucket 'private-certifications' para la jerarquía:
--      [tramite_id]/[user_id]/[application_id]/[archivo]
--      Validando el segundo segmento de la ruta como el UUID del usuario.
--   2. Realiza limpieza en cascada de tablas obsoletas o legacy que
--      ensuciaban el esquema público.
-- Fecha: 2026-06-11
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ACTUALIZACIÓN DE POLÍTICAS DE STORAGE (private-certifications)
-- ----------------------------------------------------------------------------

-- Eliminar políticas previas jerarquizadas para redefinirlas con validación estricta en el segundo segmento
DROP POLICY IF EXISTS "Lectura privada jerarquizada" ON storage.objects;
DROP POLICY IF EXISTS "Subida privada jerarquizada" ON storage.objects;
DROP POLICY IF EXISTS "Gestión privada jerarquizada" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida validando segundo segmento" ON storage.objects;
DROP POLICY IF EXISTS "Dueño lee sus archivos en segundo segmento" ON storage.objects;

-- Inserción/Subida: Permite subir únicamente si el segundo segmento de la carpeta coincide con el UID del usuario
CREATE POLICY "Permitir subida validando segundo segmento"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'private-certifications'
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Lectura: Permite leer únicamente si el segundo segmento de la carpeta coincide con el UID del usuario, o si es Administrador
CREATE POLICY "Dueño lee sus archivos en segundo segmento"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'private-certifications'
    AND (
        (storage.foldername(name))[2] = auth.uid()::text
        OR public.is_admin()
    )
);

-- Gestión Total (Update/Delete): Permite gestionar si el segundo segmento de la carpeta coincide con el UID del usuario, o si es Administrador
CREATE POLICY "Gestión de archivos en segundo segmento"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'private-certifications'
    AND (
        (storage.foldername(name))[2] = auth.uid()::text
        OR public.is_admin()
    )
);

-- ----------------------------------------------------------------------------
-- 2. LIMPIEZA DE TABLAS LEGACY O REDUNDANTES
-- ----------------------------------------------------------------------------

-- Eliminar de forma segura cualquier rastro de tablas legacy o temporales obsoletas en el esquema public
DROP TABLE IF EXISTS public.requests CASCADE;
DROP TABLE IF EXISTS public.user_metadata CASCADE;
DROP TABLE IF EXISTS public.memberships CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.certifications CASCADE;

-- Nota: La tabla public.courses_accredited NO se elimina porque es parte del motor de acreditación CCA
-- y del listado público de cursos /formaciones de AIBAPT.
