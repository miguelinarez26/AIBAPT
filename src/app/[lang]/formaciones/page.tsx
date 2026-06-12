import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase-server";
import FormacionesClient from "./FormacionesClient";

// 🚀 DESACTIVADO EL CACHÉ PARA DESARROLLO: Datos en tiempo real
export const revalidate = 0;

export default async function FormacionesPage(props: { params: Promise<{ lang: string }> }) {
    const params = await props.params;
    const lang = params?.lang || 'es';

    let events: any[] = [];

    try {
        const eventsRes = await supabaseAdmin
            .from('proximos_eventos')
            .select('*')
            .order('event_date', { ascending: true });

        if (eventsRes?.error) {
            console.warn("⚠️ Las tabla 'proximos_eventos' no está lista o no tiene acceso.");
        } else {
            events = eventsRes?.data || [];
        }
    } catch (error) {
        console.warn("🚨 Error al conectar con Supabase en formaciones:", error);
    }

    return (
        <Suspense fallback={<div className="min-h-screen pt-40 text-center animate-pulse text-primary font-display text-2xl">Cargando AIBAPT...</div>}>
            <FormacionesClient 
                initialEvents={events}
                currentLang={lang}
            />
        </Suspense>
    );
}