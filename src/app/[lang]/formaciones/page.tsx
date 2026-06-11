import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase-server";
import FormacionesClient from "./FormacionesClient";

// 🚀 DESACTIVADO EL CACHÉ PARA DESARROLLO: Datos en tiempo real
export const revalidate = 0;

export default async function FormacionesPage(props: { params: Promise<{ lang: string }> }) {
    const params = await props.params;
    const lang = params?.lang || 'es';

    // Inicializamos como arreglos vacíos por seguridad
    // Datos mockeados de respaldo en el idioma correspondiente si las tablas aún no existen en la base de datos
    const fallbackEvents = [
        {
            title: lang === 'pt' 
                ? "Abusos Sexuais na Infância: Sequelas e recuperação com Brainspotting"
                : "Abusos Sexuales en la Infancia: Secuelas y recuperación con Brainspotting",
            description: lang === 'pt'
                ? "Abordagem profunda das sequelas do abuso infantil utilizando técnicas de Brainspotting para uma recuperação integral."
                : "Abordaje profundo de las secuelas del abuso infantil mediante técnicas de Brainspotting para una recuperación integral del paciente.",
            event_date: "2026-03-12",
            location: "ONLINE (España/Latam)",
            category_label: "EVENTO OFICIAL AIBAPT",
            is_official: true,
            instructor_name: "Susana Díaz",
            instructor_img: "/images/secrvetaria.jpg",
            registration_url: "/formaciones",
            is_external: false,
            price: lang === 'pt' ? "Inscrição Aberta" : "Inscripción Abierta",
            language: lang
        },
        {
            title: lang === 'pt'
                ? "A Arte do Suporte em Psicoterapia: Presença e regulação"
                : "El Arte del Soporte en Psicoterapia: Presencia y regulación",
            description: lang === 'pt'
                ? "Exploraremos a sintonia relacional e recursos neurorrelacionais para apoiar o processo de cura."
                : "Exploraremos la sintonía relacional y recursos neurorrelacionales para apoyar el proceso de curación en psicoterapia.",
            event_date: "2026-04-16",
            location: "ONLINE (Brasil/Portugal)",
            category_label: "WEBINAR INTERNACIONAL",
            is_official: false,
            instructor_name: "Daniel Gabarra",
            instructor_img: "/images/secrvetaria.jpg",
            registration_url: "/formaciones",
            is_external: false,
            price: lang === 'pt' ? "Inscrição Aberta" : "Inscripción Abierta",
            language: lang
        }
    ];

    const fallbackWebinars = [
        {
            title: lang === 'pt'
                ? "Hipnose e Brainspotting: Sinergia neurobiológica para TEPT"
                : "Hipnosis y Brainspotting: Sinergia neurobiológica para el abordaje del TEPT",
            description: lang === 'pt'
                ? "Integração de técnicas de hipnose e brainspotting para potenciar a neuroplasticidade."
                : "Integración de técnicas de hipnosis y brainspotting para potenciar la neuroplasticidad y la integración de memorias traumáticas.",
            category: "WEBINAR",
            badge: "VOD / Grabación",
            instructor_name: "Sebastián Segui",
            instructor_img: "/images/secrvetaria.jpg",
            video_url: "/formaciones",
            duration: "2 horas",
            price: "Gratuito",
            language: lang,
            slug: "hipnosis-y-brainspotting"
        }
    ];
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

        if (eventsRes?.error) {
            console.warn("⚠️ Las tabla 'proximos_eventos' no está lista o no tiene acceso, usando fallback temporal.");
            events = fallbackEvents;
        } else {
            events = eventsRes?.data || [];
        }

        if (webinarsRes?.error) {
            console.warn("⚠️ Las tabla 'videoteca_webinars' no está lista o no tiene acceso, usando fallback temporal.");
            webinars = fallbackWebinars;
        } else {
            webinars = webinarsRes?.data || [];
        }
    } catch (error) {
        console.warn("🚨 Error al conectar con Supabase en formaciones, usando fallbacks:", error);
        events = fallbackEvents;
        webinars = fallbackWebinars;
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

