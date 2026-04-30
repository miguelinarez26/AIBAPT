-- ============================================================================
-- AIBAPT — Fix RLS: Resolver recursión infinita en policies de profiles
-- Descripción: La política "profiles_select_admin" causa recursión infinita
--              porque consulta la tabla profiles dentro de una política ON profiles.
--              Solución: crear una función SECURITY DEFINER que bypass RLS
--              para verificar si el usuario es admin.
-- Fecha: 2026-04-30
-- ============================================================================

-- -------------------------------------------------------
-- 1. FUNCIÓN AUXILIAR: is_admin()
-- SECURITY DEFINER = ejecuta con permisos del creador (bypass RLS)
-- Esto rompe el ciclo de recursión infinita.
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- -------------------------------------------------------
-- 2. FIX: profiles — Eliminar política recursiva y recrear con is_admin()
-- -------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;

-- Cada usuario lee su propio perfil
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins leen todos los perfiles (sin recursión)
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- -------------------------------------------------------
-- 3. FIX: applications — Actualizar políticas admin (prevención)
-- -------------------------------------------------------
DROP POLICY IF EXISTS "applications_select_admin" ON public.applications;
DROP POLICY IF EXISTS "applications_update_admin" ON public.applications;

CREATE POLICY "applications_select_admin"
  ON public.applications FOR SELECT
  USING (public.is_admin());

CREATE POLICY "applications_update_admin"
  ON public.applications FOR UPDATE
  USING (public.is_admin());

-- -------------------------------------------------------
-- 4. FIX: accreditation_types — Actualizar política admin
-- -------------------------------------------------------
DROP POLICY IF EXISTS "accreditation_types_admin_all" ON public.accreditation_types;
DROP POLICY IF EXISTS "accreditation_types_select_public" ON public.accreditation_types;

-- Lectura pública del catálogo
CREATE POLICY "accreditation_types_select_public"
  ON public.accreditation_types FOR SELECT
  USING (true);

-- Solo admins modifican el catálogo
CREATE POLICY "accreditation_types_admin_all"
  ON public.accreditation_types FOR ALL
  USING (public.is_admin());

-- -------------------------------------------------------
-- 5. GRANTS: Asegurar permisos explícitos
-- -------------------------------------------------------
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.accreditation_types TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- -------------------------------------------------------
-- 6. VERIFICACIÓN (ejecutar después para confirmar)
-- -------------------------------------------------------
-- SELECT tablename, policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('profiles', 'accreditation_types', 'applications')
-- ORDER BY tablename, policyname;
