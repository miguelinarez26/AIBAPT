-- ============================================================================
-- AIBAPT — Campos para Perfil Profesional (Identidad Pro)
-- Descripción: Añade campos de contacto, biografía, avatar, CV y privacidad.
-- Fecha: 2026-05-09
-- ============================================================================

-- 1. Añadir nuevos campos a la tabla profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone       TEXT,
ADD COLUMN IF NOT EXISTS avatar_url  TEXT,
ADD COLUMN IF NOT EXISTS bio         TEXT,
ADD COLUMN IF NOT EXISTS cv_url      TEXT,
ADD COLUMN IF NOT EXISTS is_public   BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Asegurar que el bucket public-assets exista (Storage)
-- Nota: En Supabase, los buckets se gestionan en la tabla storage.buckets
-- Intentamos insertar el bucket si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de Storage para el bucket public-assets
-- Permitir lectura pública de avatares
CREATE POLICY "Avatares son públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-assets');

-- Permitir a usuarios subir sus propios avatares
CREATE POLICY "Usuarios pueden subir sus propios avatares"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-assets' AND 
  (storage.foldername(name))[1] = 'avatars' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Permitir a usuarios actualizar/borrar sus propios avatares
CREATE POLICY "Usuarios pueden actualizar sus propios avatares"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'public-assets' AND 
  (storage.foldername(name))[1] = 'avatars' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Usuarios pueden borrar sus propios avatares"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'public-assets' AND 
  (storage.foldername(name))[1] = 'avatars' AND
  (storage.foldername(name))[2] = auth.uid()::text
);
