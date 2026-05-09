-- ============================================================================
-- AIBAPT — Corrección de RLS para Nueva Jerarquía de Storage y Directorio Público
-- Descripción: 
-- 1. Actualiza políticas de private-certifications para jerarquía [tramite]/[user_id]/...
-- 2. Permite lectura pública de perfiles básicos para el Directorio de Miembros.
-- Fecha: 2026-05-09
-- ============================================================================

-- -------------------------------------------------------
-- 1. ACTUALIZACIÓN DE STORAGE (private-certifications)
-- -------------------------------------------------------

-- Eliminar políticas actuales que bloquean la nueva jerarquía (segmento 1 era user_id)
DROP POLICY IF EXISTS "Lectura privada restringida" ON storage.objects;
DROP POLICY IF EXISTS "Subida privada restringida" ON storage.objects;
DROP POLICY IF EXISTS "Gestión privada restringida" ON storage.objects;

-- Nueva Política de Lectura: Dueño (en segmento 2) o Admin
CREATE POLICY "Lectura privada jerarquizada"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'private-certifications' AND 
    (
        (storage.foldername(name))[2] = auth.uid()::text OR 
        public.is_admin()
    )
);

-- Nueva Política de Subida: Solo el dueño en el segundo segmento /[tramite_id]/[user_id]/
CREATE POLICY "Subida privada jerarquizada"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'private-certifications' AND 
    (storage.foldername(name))[2] = auth.uid()::text
);

-- Nueva Política de Gestión Total: Dueño o Admin
CREATE POLICY "Gestión privada jerarquizada"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'private-certifications' AND 
    (
        (storage.foldername(name))[2] = auth.uid()::text OR 
        public.is_admin()
    )
);

-- -------------------------------------------------------
-- 2. LECTURA PÚBLICA DE PERFILES (Para Directorio de Miembros)
-- -------------------------------------------------------

-- Permitir que cualquier usuario (incluso no autenticado) vea datos básicos de perfiles públicos
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
CREATE POLICY "profiles_select_public"
ON public.profiles FOR SELECT
USING (
    is_public = true AND is_member = true
);

-- Nota: Solo exponemos columnas básicas en las queries del frontend para mantener privacidad.
