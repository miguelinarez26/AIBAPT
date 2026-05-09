-- ============================================================================
-- AIBAPT — Infraestructura de Almacenamiento Unificada
-- Descripción: Creación de buckets y políticas RLS definitivas.
-- buckets: public-assets (Avatares) y private-certifications (Documentos)
-- ============================================================================

-- 1. CREACIÓN DE BUCKETS (Si no existen)
-- -------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('private-certifications', 'private-certifications', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. POLÍTICAS PARA public-assets (Público / Avatares)
-- -------------------------------------------------------

-- Eliminar políticas previas para evitar duplicados
DROP POLICY IF EXISTS "Avatares son públicos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden subir sus propios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus propios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden borrar sus propios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Lectura pública de assets" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden subir su propio avatar" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden gestionar su propio avatar" ON storage.objects;

-- Lectura pública (Necesaria para que las fotos se vean sin token)
CREATE POLICY "Lectura pública de assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-assets');

-- Inserción / Subida (Solo en su propia carpeta /avatars/[user_id]/)
CREATE POLICY "Usuarios pueden subir su propio avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'public-assets' AND 
    (storage.foldername(name))[1] = 'avatars' AND
    (storage.foldername(name))[2] = auth.uid()::text
);

-- Actualización y Gestión
CREATE POLICY "Usuarios pueden gestionar su propio avatar"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'public-assets' AND 
    (storage.foldername(name))[1] = 'avatars' AND
    (storage.foldername(name))[2] = auth.uid()::text
);


-- 3. POLÍTICAS PARA private-certifications (Privado / CVs y Trámites)
-- -------------------------------------------------------

-- Eliminar políticas previas para limpieza
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios archivos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden subir sus propios archivos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios archivos" ON storage.objects;
DROP POLICY IF EXISTS "Admins leen private_certs" ON storage.objects;
DROP POLICY IF EXISTS "Admins borran private_certs" ON storage.objects;
DROP POLICY IF EXISTS "Dueño y Admin pueden leer certificaciones" ON storage.objects;
DROP POLICY IF EXISTS "Dueño puede subir sus certificaciones" ON storage.objects;
DROP POLICY IF EXISTS "Dueño y Admin pueden gestionar certificaciones" ON storage.objects;

-- Lectura: Dueño o Admin
CREATE POLICY "Lectura privada restringida"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'private-certifications' AND 
    (
        (storage.foldername(name))[1] = auth.uid()::text OR 
        public.is_admin()
    )
);

-- Subida: Solo el dueño en su propia carpeta raíz /[user_id]/
CREATE POLICY "Subida privada restringida"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'private-certifications' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Gestión Total (Update/Delete): Dueño o Admin
CREATE POLICY "Gestión privada restringida"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'private-certifications' AND 
    (
        (storage.foldername(name))[1] = auth.uid()::text OR 
        public.is_admin()
    )
);
