-- ============================================================================
-- AIBAPT — Épica 1: Esquema Core de Base de Datos
-- Descripción: Tablas relacionales, RLS, trigger de nuevo usuario y seed data.
-- Fecha: 2026-04-29
-- ============================================================================

-- -------------------------------------------------------
-- 1. EXTENSIONES NECESARIAS
-- -------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------
-- 2. TABLA: profiles
-- Vinculada 1:1 con auth.users. Se crea automáticamente
-- vía trigger al registrar un usuario nuevo.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT UNIQUE,
  is_member     BOOLEAN      NOT NULL DEFAULT FALSE,
  membership_expiry TIMESTAMPTZ,
  role          TEXT         NOT NULL DEFAULT 'member'
                             CHECK (role IN ('member', 'admin')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.profiles IS 'Perfil extendido de cada usuario autenticado.';
COMMENT ON COLUMN public.profiles.role IS 'Rol del usuario: member (por defecto) o admin.';

-- -------------------------------------------------------
-- 3. TABLA: accreditation_types
-- Catálogo maestro de tipos de acreditación/certificación.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.accreditation_types (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT    NOT NULL UNIQUE,
  fee_member      INTEGER NOT NULL,
  fee_non_member  INTEGER NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.accreditation_types IS 'Catálogo de tipos de acreditación con tarifas para socios y no socios.';

-- -------------------------------------------------------
-- 4. TABLA: applications
-- Solicitudes de acreditación enviadas por los usuarios.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type_id     UUID NOT NULL REFERENCES public.accreditation_types(id) ON DELETE RESTRICT,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.applications IS 'Solicitudes de acreditación vinculadas a un usuario y tipo.';

CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status  ON public.applications(status);

-- -------------------------------------------------------
-- 5. TABLA: documents
-- Archivos adjuntos a cada solicitud (CVs, formularios, etc.)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  file_path       TEXT NOT NULL,
  document_type   TEXT NOT NULL
                  CHECK (document_type IN ('cv', 'formulario', 'caso_clinico', 'pago')),
  is_private      BOOLEAN NOT NULL DEFAULT TRUE,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.documents IS 'Documentos adjuntos a solicitudes. Los privados solo los ve el dueño y admins.';

CREATE INDEX idx_documents_application_id ON public.documents(application_id);

-- -------------------------------------------------------
-- 6. TABLA: courses_accredited
-- Directorio público de cursos con créditos CCA.
-- Fuente de datos para la ruta ISR /formaciones.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses_accredited (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT    NOT NULL,
  instructor_name TEXT,
  language        TEXT    NOT NULL DEFAULT 'es'
                  CHECK (language IN ('es', 'pt')),
  credits         INTEGER NOT NULL DEFAULT 0,
  expiry_date     DATE,
  is_public       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.courses_accredited IS 'Cursos acreditados con créditos CCA. is_public=true se muestra en la web.';

CREATE INDEX idx_courses_is_public ON public.courses_accredited(is_public);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- ----- profiles -----
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Cada usuario lee su propio perfil
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins leen todos los perfiles
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Cada usuario puede actualizar su propio perfil (excepto el campo role)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ----- accreditation_types -----
ALTER TABLE public.accreditation_types ENABLE ROW LEVEL SECURITY;

-- Lectura pública del catálogo de acreditaciones
CREATE POLICY "accreditation_types_select_public"
  ON public.accreditation_types FOR SELECT
  USING (true);

-- Solo admins crean/actualizan/eliminan tipos
CREATE POLICY "accreditation_types_admin_all"
  ON public.accreditation_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ----- applications -----
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Usuarios leen sus propias solicitudes
CREATE POLICY "applications_select_own"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

-- Admins leen todas las solicitudes
CREATE POLICY "applications_select_admin"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Usuarios crean solicitudes a su nombre
CREATE POLICY "applications_insert_own"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Solo admins actualizan el estado de las solicitudes
CREATE POLICY "applications_update_admin"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ----- documents -----
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Dueño de la solicitud puede ver sus documentos
CREATE POLICY "documents_select_own"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = documents.application_id AND a.user_id = auth.uid()
    )
  );

-- Admins ven todos los documentos
CREATE POLICY "documents_select_admin"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Dueño de la solicitud puede subir documentos
CREATE POLICY "documents_insert_own"
  ON public.documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = documents.application_id AND a.user_id = auth.uid()
    )
  );

-- ----- courses_accredited -----
ALTER TABLE public.courses_accredited ENABLE ROW LEVEL SECURITY;

-- Lectura pública solo de cursos marcados como públicos
CREATE POLICY "courses_select_public"
  ON public.courses_accredited FOR SELECT
  USING (is_public = true);

-- Admins tienen acceso total a cursos
CREATE POLICY "courses_admin_all"
  ON public.courses_accredited FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================================
-- 8. TRIGGER: Crear perfil automáticamente al registrar usuario
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Ejecutar el trigger después de cada INSERT en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 9. SEED DATA: Tipos de acreditación del catálogo AIBAPT
-- ============================================================================
INSERT INTO public.accreditation_types (name, fee_member, fee_non_member) VALUES
  ('CCA',                          50,  50),
  ('Eventos_Conferencia',          20,  20),
  ('Eventos_Workshop',             30,  30),
  ('Eventos_Congreso',             50,  50),
  ('Emision_CCA',                  10,  15),
  ('Renovacion_CCA',               50,  50),
  ('EMDR_Psicoterapeuta',          20,  20),
  ('EMDR_Supervisor',              40,  40),
  ('Equivalencia_EMDR',            20,  40),
  ('Psicotrauma_Individual',       20,  20),
  ('Psicotrauma_Programa',         50,  50),
  ('Equivalencia_Basica_Alumno',   20,  20),
  ('Equivalencia_Basica_Formador', 50,  50)
ON CONFLICT (name) DO NOTHING;
