import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase-server";
import FormacionesClient from "./FormacionesClient";

// 🚀 DESACTIVADO EL CACHÉ PARA DESARROLLO: Datos en tiempo real
export const revalidate = 0;

export default async function FormacionesPage(props: { params: Promise<{ lang: string }> }) {
    const params = await props.params;
    const lang = params?.lang || 'es';

    // Inicializamos como arreglos vacíos por seguridad
    let events: any[] = [];
    let webinars: any[] = [];

    try {
        const [eventsRes, webinarsRes] = await Promise.all([
            supabaseAdmin
                .from('proximos_eventos')
                .select('*')
                .order('event_date', { ascending: true }),
            supabaseAdmin
                .from('videoteca_webinars')
                .select('*')
                .order('created_at', { ascending: false })
        ]);

        if (eventsRes?.error) console.error("❌ Error Supabase (Eventos):", eventsRes.error);
        if (webinarsRes?.error) console.error("❌ Error Supabase (Webinars):", webinarsRes.error);

        events = eventsRes?.data || [];
        webinars = webinarsRes?.data || [];
    } catch (error) {
        console.error("🚨 Error crítico al buscar formaciones:", error);
    }

    return (
        <Suspense fallback={<div className="min-h-screen pt-40 text-center animate-pulse text-primary font-display text-2xl">Cargando AIBAPT...</div>}>
            <FormacionesClient 
                initialCourses={[]} 
                initialEvents={events}
                initialWebinars={webinars}
                currentLang={lang}
            />
        </Suspense>
    );
}

