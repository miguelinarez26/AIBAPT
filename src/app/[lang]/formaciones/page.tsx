import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase-server";
import FormacionesClient from "./FormacionesClient";

// 🚀 ISR: Revalida la página estática cada 3600 segundos (1 hora)
export const revalidate = 3600;

export default async function FormacionesPage() {
    // Consulta server-side con SERVICE_ROLE_KEY para bypass de RLS
    // Garantiza que ISR siempre tenga acceso completo a la data
    const { data: courses } = await supabaseAdmin
        .from('courses_accredited')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

    return (
        <Suspense fallback={<div className="min-h-screen pt-40 text-center animate-pulse text-primary font-display text-2xl">Cargando Acreditaciones...</div>}>
            {/* Pasamos la data pre-cargada al cliente */}
            <FormacionesClient initialCourses={courses || []} />
        </Suspense>
    );
}
