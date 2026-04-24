import { Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import FormacionesClient from "./FormacionesClient";

// 🚀 MAGIA ISR: Revalida la página estática en el CDN cada 3600 segundos (1 hora)
export const revalidate = 3600; 

export default async function FormacionesPage() {
    // Inicializar Supabase en Servidor
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch directo en build-time o background revalidation
    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('is_public', true);

    return (
        <Suspense fallback={<div className="min-h-screen pt-40 text-center animate-pulse text-primary font-display text-2xl">Cargando Acreditaciones...</div>}>
            {/* Pasamos la data pre-cargada al cliente */}
            <FormacionesClient initialCourses={courses || []} />
        </Suspense>
    );
}
