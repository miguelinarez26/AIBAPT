-- ============================================================================
-- AIBAPT — Fix RLS Storage: Eliminar recursión infinita
-- Descripción: Eliminar políticas anteriores con recursividad en perfiles de admin.
--              Asignar políticas seguras a los usuarios.
-- Fecha: 2026-04-30
-- ============================================================================

-- -------------------------------------------------------
-- 1. Eliminar políticas antiguas (con recursión infinita en profiles)
-- -------------------------------------------------------
DROP POLICY IF EXISTS "private_certs_select_owner_admin" ON storage.objects;
DROP POLICY IF EXISTS "private_certs_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "private_certs_delete_owner_admin" ON storage.objects;

-- -------------------------------------------------------
-- 2. Nuevas Políticas Simples sin Subconsultas a profiles (para los usuarios)
-- -------------------------------------------------------

-- Permitir que usuarios vean sus propios archivos
CREATE POLICY "Usuarios pueden ver sus propios archivos" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'private-certifications' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Permitir que usuarios autenticados suban archivos a su propia carpeta
CREATE POLICY "Usuarios pueden subir sus propios archivos" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'private-certifications' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Permitir que usuarios eliminen sus propios archivos
CREATE POLICY "Usuarios pueden eliminar sus propios archivos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'private-certifications' AND (storage.foldername(name))[1] = auth.uid()::text);

-- -------------------------------------------------------
-- 3. Políticas específicas para Admins usando is_admin() (de 003_fix_rls_stepper.sql)
-- -------------------------------------------------------

-- Admins pueden leer todos los archivos privados
CREATE POLICY "Admins leen private_certs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'private-certifications' AND public.is_admin());

-- Admins pueden borrar cualquier archivo privado
CREATE POLICY "Admins borran private_certs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'private-certifications' AND public.is_admin());
