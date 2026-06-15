-- ============================================================================
-- AIBAPT — Creación de la Tabla de Banco de Créditos (user_credits)
-- Ejecuta este script en el editor SQL de Supabase para inicializar el módulo.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    course_id UUID,
    amount INTEGER NOT NULL CHECK (amount >= 0),
    category TEXT NOT NULL CHECK (category IN ('EMDR', 'Psicotrauma')),
    expiry_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Seguridad de Fila (RLS)
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Política de RLS: Los usuarios autenticados solo pueden ver sus propios créditos
DROP POLICY IF EXISTS select_own_credits ON public.user_credits;
CREATE POLICY select_own_credits ON public.user_credits
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Política de RLS: Los administradores tienen acceso completo (lectura, inserción, actualización, eliminación)
DROP POLICY IF EXISTS admin_all_credits ON public.user_credits;
CREATE POLICY admin_all_credits ON public.user_credits
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
