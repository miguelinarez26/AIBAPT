-- ============================================================================
-- AIBAPT — Inicialización de Cursos Acreditados (courses_accredited)
-- Ejecuta este script en el editor SQL de Supabase para crear la tabla de cursos
-- e insertar los datos oficiales de los cursos acreditados.
-- ============================================================================

-- 1. Crear la tabla de cursos acreditados si no existe
CREATE TABLE IF NOT EXISTS public.courses_accredited (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    instructor_name TEXT,
    language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'pt')),
    credits INTEGER NOT NULL DEFAULT 12,
    hours TEXT,
    contact TEXT,
    link_title TEXT,
    expiry_date DATE,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Asegurar que las nuevas columnas existan en caso de que la tabla ya estuviera creada
ALTER TABLE public.courses_accredited ADD COLUMN IF NOT EXISTS hours TEXT;
ALTER TABLE public.courses_accredited ADD COLUMN IF NOT EXISTS contact TEXT;
ALTER TABLE public.courses_accredited ADD COLUMN IF NOT EXISTS link_title TEXT;

-- Agregar restricción única sobre el título para evitar duplicados al re-ejecutar el script
ALTER TABLE public.courses_accredited DROP CONSTRAINT IF EXISTS unique_course_title;
ALTER TABLE public.courses_accredited ADD CONSTRAINT unique_course_title UNIQUE (title);

-- Habilitar RLS para lectura pública
ALTER TABLE public.courses_accredited ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_public_courses ON public.courses_accredited;
CREATE POLICY select_public_courses ON public.courses_accredited
    FOR SELECT
    TO authenticated, anon
    USING (is_public = true);

-- Otorgar permisos de lectura a los roles del sistema de Supabase
GRANT SELECT ON public.courses_accredited TO anon, authenticated, service_role;
GRANT ALL ON public.courses_accredited TO service_role;

-- 2. Insertar cursos acreditados reales (ON CONFLICT DO NOTHING evita duplicados por título)
INSERT INTO public.courses_accredited (title, instructor_name, hours, contact, link_title, language, credits, is_public)
VALUES 
    ('Acompañar pérdidas y procesos de duelo', 'Belén Romá y Santiago Jácome', '04 horas', 'mailto:belenromaromero@gmail.com', NULL, 'es', 12, true),
    ('Aleces: Introducción a la Comprensión y Curación del Trauma', 'C. Cuenca, C. Melo y M. Salvador', '28 horas', 'https://www.aleces.com', 'edu.btn.website', 'es', 12, true),
    ('Atención intensiva', 'Esly Carvalho / TraumaClinic', '02 horas', 'https://www.traumacliniclatinoamerica.com/courses/atencionintensiva', 'edu.btn.website', 'es', 12, true),
    ('Capacitación para Supervisores Certificados en EMDR', 'Elizabeth Maio e Silvia Guz', '10 horas', 'mailto:helo.ludovice@gmail.com', NULL, 'es', 12, true),
    ('Dilemas y toma de decisiones en la Terapia EMDR', 'Belén Romá y Santiago Jácome', '02 horas', 'mailto:belenromaromero@gmail.com', NULL, 'es', 12, true),
    ('El arte de crear entretejidos terapéuticos', 'Belén Romá y Santiago Jácome', '06 horas', 'mailto:belenromaromero@gmail.com', NULL, 'es', 12, true),
    ('PIPA: Intervención de Profesionales en la Adversidad', 'Esly Carvalho / TraumaClinic', '13 horas', 'mailto:soporte@traumacliniclatinoamerica.com', NULL, 'es', 12, true),
    ('Protocolo de Episodios Traumáticos Grupales (G-TEP)', 'Patricio Galleguillos', '06 horas', 'mailto:contacto@atept.cl', NULL, 'es', 12, true),
    ('Terapia Centrada en Esquemas', 'Ariel Milton Pinto de Sousa', '22 horas', 'mailto:arielmilton@gmail.com', NULL, 'es', 12, true),
    ('Trauma Complejo, Disociación y EMDR', 'Patricio Galleguillos', '12 horas', 'mailto:contacto@atept.cl', NULL, 'es', 12, true)
ON CONFLICT (title) DO NOTHING;

