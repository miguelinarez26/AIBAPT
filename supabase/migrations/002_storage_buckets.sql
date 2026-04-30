-- ============================================================================
-- AIBAPT — Épica 1: Configuración de Storage (Buckets)
-- Descripción: Creación de buckets público y privado con políticas de acceso.
-- Fecha: 2026-04-29
-- ============================================================================

-- -------------------------------------------------------
-- 1. BUCKET PÚBLICO: public-assets
-- Para logos de cursos, marketing y contenido visual público.
-- -------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Lectura pública sin autenticación
CREATE POLICY "public_assets_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public-assets');

-- Solo admins suben archivos al bucket público
CREATE POLICY "public_assets_insert_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'public-assets'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Solo admins eliminan archivos del bucket público
CREATE POLICY "public_assets_delete_admin"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'public-assets'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- -------------------------------------------------------
-- 2. BUCKET PRIVADO: private-certifications
-- Para CVs, Casos Clínicos y comprobantes de pago.
-- -------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('private-certifications', 'private-certifications', false)
ON CONFLICT (id) DO NOTHING;

-- REGLA CRÍTICA: Solo el dueño del archivo (auth.uid()) y admins pueden leer
CREATE POLICY "private_certs_select_owner_admin"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'private-certifications'
    AND (
      -- El dueño del archivo (su uid está en la ruta: user_id/...)
      (auth.uid()::text = (storage.foldername(name))[1])
      OR
      -- Admins pueden leer todo
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )
    )
  );

-- Usuarios autenticados suben archivos a su propia carpeta
CREATE POLICY "private_certs_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'private-certifications'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Solo el dueño o admins pueden eliminar
CREATE POLICY "private_certs_delete_owner_admin"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'private-certifications'
    AND (
      (auth.uid()::text = (storage.foldername(name))[1])
      OR
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )
    )
  );
