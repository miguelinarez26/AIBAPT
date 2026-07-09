import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase-server";
import FormacionesClient from "./FormacionesClient";

// 🚀 CACHÉ EN PRODUCCIÓN Y DESARROLLO (ISR): Revalida cada 5 minutos
export const revalidate = 300;

export default async function FormacionesPage(props: { params: Promise<{ lang: string }> }) {
    const params = await props.params;
    const lang = params?.lang || 'es';

    let events: any[] = [];
    let accredited: any[] = [];
    let videoteca: any[] = [];

    try {
        const [eventsRes, accreditedRes, videotecaRes] = await Promise.all([
            supabaseAdmin
                .from('proximos_eventos')
                .select('*')
                .order('event_date', { ascending: true }),
            supabaseAdmin
                .from('courses_accredited')
                .select('*')
                .eq('is_public', true)
                .order('title', { ascending: true }),
            supabaseAdmin
                .from('videoteca_webinars')
                .select('*')
                .order('event_date', { ascending: false })
        ]);

        if (eventsRes?.error) {
            console.warn("⚠️ La tabla 'proximos_eventos' no está lista o no tiene acceso.");
        } else {
            events = eventsRes?.data || [];
        }

        if (accreditedRes?.error) {
            console.warn("⚠️ La tabla 'courses_accredited' no está lista o no tiene acceso:", accreditedRes.error);
        } else {
            accredited = accreditedRes?.data || [];
        }

        if (videotecaRes?.error) {
            console.warn("⚠️ La tabla 'videoteca_webinars' no está lista o no tiene acceso:", videotecaRes.error);
        } else {
            videoteca = videotecaRes?.data || [];
        }
    } catch (error) {
        console.warn("🚨 Error al conectar con Supabase en formaciones:", error);
    }

    return (
        <Suspense fallback={<div className="min-h-screen pt-40 text-center animate-pulse text-primary font-display text-2xl">Cargando AIBAPT...</div>}>
            <FormacionesClient 
                initialEvents={events}
                initialAccredited={accredited}
                initialVideoteca={videoteca}
                currentLang={lang}
            />
        </Suspense>
    );
}