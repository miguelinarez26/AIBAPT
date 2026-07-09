"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UniversalStepper } from "@/components/acreditaciones/UniversalStepper";
import { TramiteSelector } from "@/components/acreditaciones/TramiteSelector";
import { toast } from "sonner";

// Import images for proper base path resolution
import placeholderImg from "../../../../public/images/webinar_placeholder_new.png";
import imgEMDR from "../../../../public/images/protocolos-corporais-em-terapia-emdr.png";
import imgBS from "../../../../public/images/treinamento-basico-em-brainspotting.jpeg";
import imgTDAH from "../../../../public/images/destravando-o-tdah-com-emdr-e-autorregula.jpeg";
import imgCongreso from "../../../../public/images/i-congreso-internacional-traumaclinic.jpg";
import logoAibapt from "../../../../public/images/aibapt_logo_transparent_seal.png";

interface FormacionesClientProps {
    initialEvents: any[];
    initialAccredited?: any[];
    initialVideoteca?: any[];
    currentLang: string;
}

function FormacionesContent({ initialEvents, initialAccredited = [], initialVideoteca = [], currentLang }: FormacionesClientProps) {
    const { t, lang } = useLanguage();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"events" | "recordings" | "accredited" | "accreditation" | "all">("events");
    const [filterType, setFilterType] = useState<"all" | "official" | "external">("all");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [selectedTramiteId, setSelectedTramiteId] = useState<string | null>(null);
    const [selectedContactCourse, setSelectedContactCourse] = useState<any>(null);

    // Helper to get initials from name
    const getInitials = (name: string) => {
        if (!name) return "";
        const words = name.trim().split(/\s+/);
        if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && ["events", "recordings", "accredited", "accreditation"].includes(tab)) {
            setActiveTab(tab as any);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleResetTab = (e: any) => {
            const resetTab = e.detail;
            if (resetTab === "accreditation") {
                setSelectedTramiteId(null);
            }
            if (resetTab === "events" || resetTab === "recordings") {
                setSelectedCourse(null);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("resetTabState", handleResetTab);
            return () => window.removeEventListener("resetTabState", handleResetTab);
        }
    }, []);

    // TABS DEFINITION
    const tabs = useMemo(() => [
        { id: "events", label: lang === "pt" ? "Próximos Eventos" : "Próximos Eventos", icon: "event_available" },
        { id: "recordings", label: lang === "pt" ? "Videoteca" : "Videoteca", icon: "ondemand_video" },
        { id: "accredited", label: lang === "pt" ? "Cursos e eventos acreditados" : "Cursos y eventos acreditados", icon: "verified" },
        { id: "accreditation", label: lang === "pt" ? "Acredite seu curso ou evento" : "Acredita tu curso o evento", icon: "history_edu" },
    ], [lang]);
    // DATA FOR "WEBINARS" (Programa 2026)
    const webinarsData = useMemo(() => [
        {
            img: logoAibapt,
            badge: "Marzo 12", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - España", title: "Abusos Sexuales en la Infancia: Secuelas y recuperación con Brainspotting y otros recursos",
            desc: "Abordaje profundo de las secuelas del abuso infantil mediante técnicas de Brainspotting para una recuperación integral del paciente.",
            instructorImg: "", instructorName: "Susana Díaz", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "1 Crédito AIBAPT"
        },
        {
            img: logoAibapt,
            badge: "Abril 16", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Brasil", title: "A Arte do Suporte em PSicoterapia: Presença, regulação e recursos clínicos",
            desc: "Exploraremos a sintonía relacional e recursos neurorrelacionais para apoiar o processo de cura em psicoterapias de foco no trauma.",
            instructorImg: "", instructorName: "Daniel Gabarra", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "1 Crédito AIBAPT"
        },
        {
            img: logoAibapt,
            badge: "Mayo 21", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Argentina", title: "Hipnosis y Brainspotting: Sinergia neurobiológica para el abordaje del TEPT y la integración del Trauma",
            desc: "Integración de técnicas de hipnosis y brainspotting para potenciar la neuroplasticidad y la integración de memorias traumáticas.",
            instructorImg: "", instructorName: "Sebastián Segui", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "1 Crédito AIBAPT"
        },
        {
            img: logoAibapt,
            badge: "Junio 18", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Portugal", title: "¿intervenção em Crise - Burnout e Stress, como consequencias ao Trauma?",
            desc: "Análise profunda sobre o impacto do trauma no desarrollo de Burnout e stress crônico, e estratégias de intervenção em crise.",
            instructorImg: "", instructorName: "Renata Teles", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "1 Crédito AIBAPT"
        },
        {
            img: logoAibapt,
            badge: "Julio 16", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Mexico", title: "Herramientas creativas y Brainspotting",
            desc: "Uso de recursos creativos y expresivos en el marco del Brainspotting para facilitar el acceso a núcleos traumáticos subcorticales.",
            instructorImg: "", instructorName: "Norma Contreras", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "1 Crédito AIBAPT"
        },
        {
            img: logoAibapt,
            badge: "Agosto 20", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Brasil", title: "Esquemas relacionais organizadores",
            desc: "Exploração de novos protocolos e abordagens integrativas para o tratamiento de traumas complexos na prática clínica actual.",
            instructorImg: "", instructorName: "Sandra Fiore", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "1 Crédito AIBAPT"
        },
        {
            img: logoAibapt,
            badge: "Septiembre 17", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Chile", title: "Trauma, cuerpo y Brainspotting desde la mirada Junguiana y Ericksoniana",
            desc: "Enfoque somático en el procesamiento del trauma mediante la técnica de Brainspotting, conectando mente y cuerpo en la sanación.",
            instructorImg: "", instructorName: "Juan Alexis", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "1 Crédito AIBAPT"
        },
        {
            img: logoAibapt,
            badge: "Octubre 15", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Brasil", title: "Do útero materno à relación terapéutica: A jornada da conexão",
            desc: "Estudo sobre os vínculos primários e sua repercussão na aliança terapêutica e na resolución de traumas de apego precoce.",
            instructorImg: "", instructorName: "Angela Maranho", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "1 Crédito AIBAPT"
        },
        {
            img: logoAibapt,
            badge: "Noviembre 19", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Mexico", title: "Entendiendo el Trauma desde el modelo PARCUVE",
            desc: "Técnicas avanzadas para la integración de memorias traumáticas fragmentadas en el flujo de la conciencia narrativa.",
            instructorImg: "", instructorName: "Paulina González Aguilar", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "1 Crédito AIBAPT"
        },
        {
            img: logoAibapt,
            badge: "Diciembre 5", badgeIcon: "groups", badgeStyle: "text-primary",
            category: "Institucional", title: "Asamblea General AIBAPT",
            desc: "Reunión anual de miembros de la Asociación Iberoamericana de Psicotrauma.",
            instructorImg: logoAibapt, instructorName: "AIBAPT", route: "/formaciones", price: "Inscripción", isOfficial: true, duration: "Participación Socios"
        }
    ], []);

    // DATA FOR "PRÓXIMOS EVENTOS" (Entrenamientos/Cursos largos)
        const eventsData = useMemo(() => initialEvents.map((e: any) => {
        const isOfficial = e.is_official || e.category_label?.toLowerCase().includes("oficial");
        return {
            id: e.id,
            slug: e.slug,
            img: isOfficial ? logoAibapt : (e.thumbnail_url || placeholderImg),
            badge: e.event_date ? (() => {
                const [year, month, day] = e.event_date.split('-').map(Number);
                return new Date(year, month - 1, day).toLocaleDateString(currentLang === "es" ? "es-ES" : "pt-BR", { day: "numeric", month: "long" });
            })() : "Próximamente",
            badgeIcon: e.badge_icon || "calendar_today",
            badgeStyle: "text-primary",
            category: e.location || "ONLINE",
            title: e.title,
            desc: e.description,
            instructorImg: e.instructor_img || "",
            instructorName: e.instructor_name || "AIBAPT",
            route: e.registration_url || "/formaciones",
            price: e.price || (
                isOfficial 
                    ? (currentLang === "es" ? "Inscribirse" : "Inscrever-se")
                    : (currentLang === "es" ? "Ir a la inscripción" : "Ir para a inscrição")
            ),
            isOfficial: isOfficial,
            duration: ""
        };
    }), [initialEvents, currentLang]);

    const videotecaData = useMemo(() => {
        return initialVideoteca.map((w: any) => {
            const isMissingDate = !w.event_date || w.event_date === '2000-01-01' || w.event_date === '2020-01-01';
            
            return {
                id: w.id,
                slug: w.slug || `webinar-${w.id}`,
                title: w.title,
                instructorName: w.instructor_name || 'AIBAPT',
                instructorImg: w.instructor_img || '',
                price: w.price_public ? `${w.price_public} €` : (w.price || '10 €'),
                img: w.thumbnail_url || w.video_url || placeholderImg,
                desc: w.description || '',
                descLong: w.desc_long || w.description || '',
                duration: w.credits_num ? `${w.credits_num} Crédito AIBAPT` : (w.duration || '1 Crédito AIBAPT'),
                badge: isMissingDate ? 'VOD / Grabación' : (() => {
                    const [year, month, day] = w.event_date.split('-').map(Number);
                    return new Date(year, month - 1, day).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                })(),
                badgeIcon: isMissingDate ? 'play_circle' : 'calendar_today',
                badgeStyle: isMissingDate ? 'text-accent' : 'text-primary',
                category: w.category || 'Trauma Webinars',
                includes: w.includes || ["Acceso a la grabación", "Certificado de participación", "Material de apoyo"],
                isOfficial: true,
                route: `/${lang}/formaciones/${w.slug || w.id}/buy`
            };
        });
    }, [initialVideoteca, lang]);

    // DATA FOR "CURSOS ACREDITADOS"
    const accreditedData = useMemo(() => {
        if (initialAccredited && initialAccredited.length > 0) {
            return initialAccredited.map((c: any) => ({
                title: c.title,
                instructor: c.instructor_name || c.instructor || "AIBAPT",
                hours: c.hours || `${c.credits || 12} créditos`,
                contact: c.contact
                    ? (c.contact.includes("@") && !c.contact.startsWith("mailto:") && !c.contact.startsWith("http")
                        ? `mailto:${c.contact}`
                        : c.contact)
                    : "#",
                linkTitle: c.link_title ? (c.link_title.startsWith("edu.btn") ? t(c.link_title as any) : c.link_title) : null
            }));
        }
        return [
            { title: "Acompañar pérdidas y procesos de duelo", instructor: "Belén Romá y Santiago Jácome", hours: "04 horas", contact: "mailto:belenromaromero@gmail.com" },
            { title: "Aleces: Introducción a la Comprensión y Curación del Trauma", instructor: "C. Cuenca, C. Melo y M. Salvador", hours: "28 horas", contact: "https://www.aleces.com", linkTitle: t("edu.btn.website" as any) },
            { title: "Atención intensiva", instructor: "Esly Carvalho / TraumaClinic", hours: "02 horas", contact: "https://www.traumacliniclatinoamerica.com/courses/atencionintensiva", linkTitle: t("edu.btn.website" as any) },
            { title: "Capacitación para Supervisores Certificados en EMDR", instructor: "Elizabeth Maio e Silvia Guz", hours: "10 horas", contact: "mailto:helo.ludovice@gmail.com" },
            { title: "Dilemas y toma de decisiones en la Terapia EMDR", instructor: "Belén Romá y Santiago Jácome", hours: "02 horas", contact: "mailto:belenromaromero@gmail.com" },
            { title: "El arte de crear entretejidos terapéuticos", instructor: "Belén Romá y Santiago Jácome", hours: "06 horas", contact: "mailto:belenromaromero@gmail.com" },
            { title: "PIPA: Intervención de Profesionales en la Adversidad", instructor: "Esly Carvalho / TraumaClinic", hours: "13 horas", contact: "mailto:soporte@traumacliniclatinoamerica.com" },
            { title: "Protocolo de Episodios Traumáticos Grupales (G-TEP)", instructor: "Patricio Galleguillos", hours: "06 horas", contact: "mailto:contacto@atept.cl" },
            { title: "Terapia Centrada en Esquemas", instructor: "Ariel Milton Pinto de Sousa", hours: "22 horas", contact: "mailto:arielmilton@gmail.com" },
            { title: "Trauma Complejo, Disociación y EMDR", instructor: "Patricio Galleguillos", hours: "12 horas", contact: "mailto:contacto@atept.cl" },
        ];
    }, [initialAccredited, t]);


    // Select active data for list/grid view
    const currentData = useMemo(() => {
        if (activeTab === "events") return eventsData;
        if (activeTab === "recordings") return videotecaData;
        if (activeTab === "accredited") return accreditedData.map((item: any) => ({
            ...item,
            img: logoAibapt,
            category: lang === "pt" ? "CURSO CREDENCIADO" : "CURSO ACREDITADO",
            badge: item.hours,
            badgeIcon: "schedule",
            badgeStyle: "text-secondary",
            instructorName: item.instructor,
            isOfficial: false,
            route: item.contact,
            price: item.linkTitle || (lang === "pt" ? "Contatar" : "Contactar"),
            desc: item.instructor
        }));
        return [];
    }, [activeTab, eventsData, videotecaData, accreditedData, lang]);

    const filteredData = useMemo(() => {
        let result: any[] = currentData;

        if (filterType === "official") {
            result = result.filter(c => c.isOfficial === true);
        } else if (filterType === "external") {
            result = result.filter(c => c.isOfficial === false);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (c) =>
                    (c.title?.toLowerCase() || "").includes(term) ||
                    (c.desc?.toLowerCase() || "").includes(term) ||
                    (c.instructorName?.toLowerCase() || "").includes(term) ||
                    (c.category?.toLowerCase() || "").includes(term)
            );
        }
        return result;
    }, [searchTerm, currentData, filterType]);

    useEffect(() => {
        const idStr = searchParams.get("id");
        if (idStr !== null) {
            let sourceData: any[] = [];
            const tab = searchParams.get("tab");
            if (tab === "events") {
                sourceData = eventsData;
            } else if (tab === "recordings") {
                sourceData = videotecaData;
            }

            let found = sourceData.find(item => item && String(item.id) === idStr);

            if (!found) {
                const index = parseInt(idStr, 10);
                if (!isNaN(index) && index >= 0 && index < sourceData.length) {
                    found = sourceData[index];
                }
            }

            if (found) {
                setTimeout(() => setSelectedCourse(found), 100);
            }
        }
    }, [searchParams, eventsData, videotecaData, activeTab]);

    return (
        <div className="pt-10 md:pt-12 bg-background-light min-h-screen pb-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] sm:top-[0%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animation-delay-2000"></div>
            </div>

            <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10 max-w-4xl mx-auto flex flex-col items-center">
                    <span className="inline-block bg-primary/10 text-primary font-bold text-xs px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                        {lang === "es" ? "Desarrollo Profesional" : "Desenvolvimento Profissional"}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-text-light mb-4 leading-[1.1]">
                        {tabs.find(t => t.id === activeTab)?.label || t("edu.hub.title" as any)}
                    </h1>
                    {(activeTab === "events" || activeTab === "recordings") && (
                        <p className="text-sm md:text-base text-text-dark leading-relaxed max-w-2xl mx-auto">
                            {activeTab === "events"
                                ? (lang === "pt" 
                                    ? "Agenda de eventos futuros com inscrições abertas" 
                                    : "Agenda de eventos futuros con inscripciones abiertas")
                                : (lang === "pt" 
                                    ? "Lista de cursos e eventos gravados disponíveis para aquisição no site da AIBAPT" 
                                    : "Lista de cursos y eventos grabados disponibles para adquisición en el sitio web de la AIBAPT")}
                        </p>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {(activeTab === "events" || activeTab === "recordings" || activeTab === "accredited") && (
                            <div className="flex-1">
                                <div className="relative max-w-5xl mx-auto mb-10 z-10">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 blur-2xl -z-10 rounded-full" />
                                    
                                    <div className="flex flex-col md:flex-row items-center gap-2 p-2.5 rounded-3xl md:rounded-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(33,150,83,0.08)] transition-all">
                                        <div className="flex items-center flex-1 w-full md:w-auto px-4 py-2">
                                            <span className="material-icons-round text-primary mr-3">search</span>
                                            <input 
                                                type="text" 
                                                placeholder={t("edu.search" as any)}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-text-main placeholder:text-text-muted/60 text-[15px] font-medium"
                                            />
                                            {searchTerm && (
                                                <button 
                                                    onClick={() => setSearchTerm("")}
                                                    className="ml-2 text-gray-400 hover:text-primary transition-colors flex items-center justify-center"
                                                >
                                                    <span className="material-icons-round text-[18px]">close</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

                                        <div className="flex items-center gap-2 w-full md:w-auto px-1 pb-1 md:pb-0 justify-between md:justify-end flex-wrap md:flex-nowrap">
                                            {(activeTab === "events") && (
                                                <div className="flex flex-wrap md:flex-nowrap items-center gap-1 w-full md:w-auto overflow-x-auto hide-scrollbar">
                                                    <button
                                                        onClick={() => setFilterType("all")}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${filterType === "all" ? "bg-primary text-white shadow-sm" : "text-text-dark hover:text-primary hover:bg-white"}`}
                                                    >
                                                        {lang === "pt" ? "Todos" : "Todos"}
                                                    </button>
                                                    <button
                                                        onClick={() => setFilterType("official")}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${filterType === "official" ? "bg-primary text-white shadow-sm" : "text-text-dark hover:text-primary hover:bg-white"}`}
                                                    >
                                                        {lang === "pt" ? "Oficiais AIBAPT" : "Oficiales AIBAPT"}
                                                    </button>
                                                    <button
                                                        onClick={() => setFilterType("external")}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${filterType === "external" ? "bg-primary text-white shadow-sm" : "text-text-dark hover:text-primary hover:bg-white"}`}
                                                    >
                                                        {lang === "pt" ? "Certificados" : "Certificados"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {activeTab !== "accredited" && (
                                    <div className="flex items-center justify-end mb-6">
                                        <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200 shadow-sm">
                                            <button
                                                onClick={() => setViewMode("list")}
                                                className={`px-2 py-1 rounded-md flex items-center justify-center transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-gray-600"}`}
                                                title="Vista Lista"
                                            >
                                                <span className="material-icons-round text-[18px]">view_list</span>
                                            </button>
                                            <button
                                                onClick={() => setViewMode("grid")}
                                                className={`px-2 py-1 rounded-md flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-gray-600"}`}
                                                title="Vista Cuadrícula"
                                            >
                                                <span className="material-icons-round text-[18px]">grid_view</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className={(viewMode === "grid" && activeTab !== "accredited") 
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                                    : "flex flex-col gap-4"
                                }>
                                    {filteredData.map((course, idx) => (
                                        (viewMode === "grid" && activeTab !== "accredited") ? (
                                            <article key={idx} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1">
                                                <div className="relative h-48 overflow-hidden bg-gray-50">
                                                    <Image fill alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" src={course.img || placeholderImg} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-text-light flex items-center gap-1.5 shadow-sm">
                                                        <span className={`material-icons-round ${course.badgeStyle} text-sm`}>{course.badgeIcon}</span>
                                                        {course.badge}
                                                    </div>
                                                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                                                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border border-white/20 backdrop-blur-md shadow-sm ${course.isOfficial ? "bg-primary/90 text-white" : "bg-blue-600/90 text-white"}`}>
                                                            {course.isOfficial ? "Evento Oficial AIBAPT" : (lang === "pt" ? "Cursos e Eventos Certificados" : "Cursos y Eventos Certificados")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 pt-5 flex flex-col flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-md">{course.category}</span>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-text-light mb-3 group-hover:text-primary/70 transition-colors duration-300 leading-snug line-clamp-2 min-h-[3.5rem]">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-sm text-text-dark line-clamp-2 mb-6 flex-1">
                                                        {course.desc}
                                                    </p>
                                                    <div className="mt-auto pt-5 border-t border-gray-100 flex flex-col gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center overflow-hidden border border-primary/10">
                                                                {course.instructorImg ? (
                                                                    <Image fill alt="Instructor" className="w-full h-full object-contain p-1" src={course.instructorImg} />
                                                                ) : (
                                                                    <span className="text-xs font-bold text-primary uppercase">
                                                                        {getInitials(course.instructorName)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-semibold text-text-main">{course.instructorName}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-lg font-bold text-text-light">{activeTab === "recordings" ? course.price : ""}</span>
                                                            {activeTab === "recordings" ? (
                                                                <Link 
                                                                    href={course.route} 
                                                                    className="group/btn flex items-center gap-3 border-2 border-accent text-accent bg-transparent pl-5 pr-1.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:bg-accent hover:text-white hover:-translate-y-1 hover:shadow-md w-full sm:w-auto justify-between sm:justify-center"
                                                                >
                                                                    <span>Adquirir</span>
                                                                    <div className="w-7 h-7 bg-accent/10 group-hover/btn:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:translate-x-0.5">
                                                                        <span className="material-icons-round text-[14px]">arrow_forward</span>
                                                                    </div>
                                                                </Link>
                                                            ) : course.isOfficial ? (
                                                                <button 
                                                                    onClick={() => setSelectedCourse(course)}
                                                                    className="group/btn flex items-center gap-3 border-2 border-accent text-accent bg-transparent pl-5 pr-1.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:bg-accent hover:text-white hover:-translate-y-1 hover:shadow-md w-full sm:w-auto justify-between sm:justify-center"
                                                                >
                                                                    <span>{course.price}</span>
                                                                    <div className="w-7 h-7 bg-accent/10 group-hover/btn:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:translate-x-0.5">
                                                                        <span className="material-icons-round text-[14px]">arrow_forward</span>
                                                                    </div>
                                                                </button>
                                                            ) : (
                                                                <a 
                                                                    href={course.route} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    onClick={(e) => {
                                                                        if (course.route?.startsWith("mailto:")) {
                                                                            e.preventDefault();
                                                                            setSelectedContactCourse(course);
                                                                        }
                                                                    }}
                                                                    className="group/btn flex items-center gap-3 border-2 border-accent text-accent bg-transparent pl-5 pr-1.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:bg-accent hover:text-white hover:-translate-y-1 hover:shadow-md w-full sm:w-auto justify-between sm:justify-center"
                                                                >
                                                                    <span>{course.price}</span>
                                                                    <div className="w-7 h-7 bg-accent/10 group-hover/btn:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:translate-x-0.5">
                                                                        <span className="material-icons-round text-[14px]">open_in_new</span>
                                                                    </div>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ) : (
                                            <article key={idx} className="group flex flex-col md:flex-row items-center bg-white rounded-3xl p-3 border border-gray-100 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 gap-5 hover:-translate-y-0.5">
                                                <div className="relative w-full md:w-48 h-40 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                                                    <Image fill alt={course.title} className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" src={course.img || placeholderImg} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                                </div>
                                                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-5 w-full md:pr-4 py-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-md">{course.category}</span>
                                                            {activeTab !== "accredited" && (
                                                                <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${course.isOfficial ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600"}`}>
                                                                    {course.isOfficial ? "Evento Oficial AIBAPT" : (lang === "pt" ? "Cursos e Eventos Certificados" : "Cursos y Eventos Certificados")}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-lg font-bold text-text-light group-hover:text-primary transition-colors line-clamp-1 mb-1">
                                                            {course.title}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="material-icons-round text-primary/60 text-sm">person</span>
                                                                <span className="text-sm font-medium text-text-dark">{course.instructorName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={`material-icons-round ${course.badgeStyle} text-sm`}>{course.badgeIcon}</span>
                                                                <span className="text-sm font-medium text-text-dark">{course.badge}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row md:flex-col items-center sm:items-start md:items-end justify-between md:justify-center gap-4 min-w-fit border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                                                        {activeTab === "recordings" ? (
                                                            <Link 
                                                                href={course.route} 
                                                                className="group/btn flex items-center gap-3 bg-accent text-white pl-5 pr-1.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:bg-primary hover:-translate-y-1 hover:shadow-md w-full sm:w-auto justify-between sm:justify-center"
                                                            >
                                                                <span>Adquirir</span>
                                                                <div className="w-7 h-7 bg-white/20 group-hover/btn:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:translate-x-0.5">
                                                                    <span className="material-icons-round text-[14px]">arrow_forward</span>
                                                                </div>
                                                            </Link>
                                                        ) : course.isOfficial ? (
                                                            <button 
                                                                onClick={() => setSelectedCourse(course)}
                                                                className="group/btn flex items-center gap-3 bg-accent text-white pl-5 pr-1.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:bg-primary hover:-translate-y-1 hover:shadow-md w-full sm:w-auto justify-between sm:justify-center"
                                                            >
                                                                <span>{course.price}</span>
                                                                <div className="w-7 h-7 bg-white/20 group-hover/btn:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:translate-x-0.5">
                                                                    <span className="material-icons-round text-[14px]">arrow_forward</span>
                                                                </div>
                                                            </button>
                                                        ) : (
                                                            <a 
                                                                href={course.route} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                onClick={(e) => {
                                                                    if (course.route?.startsWith("mailto:")) {
                                                                        e.preventDefault();
                                                                        setSelectedContactCourse(course);
                                                                    }
                                                                }}
                                                                className="group/btn flex items-center gap-3 bg-accent text-white pl-5 pr-1.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:bg-primary hover:-translate-y-1 hover:shadow-md w-full sm:w-auto justify-between sm:justify-center"
                                                            >
                                                                <span>{course.price}</span>
                                                                <div className="w-7 h-7 bg-white/20 group-hover/btn:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:translate-x-0.5">
                                                                    <span className="material-icons-round text-[14px]">open_in_new</span>
                                                                </div>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "accreditation" && (
                            <div className="max-w-4xl mx-auto pb-4">
                                {!selectedTramiteId ? (
                                    <TramiteSelector onSelect={(id) => setSelectedTramiteId(id)} searchTerm={searchTerm} />
                                ) : (
                                    <UniversalStepper tramiteId={selectedTramiteId} onBack={() => setSelectedTramiteId(null)} />
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCourse(null)}
                            className="absolute inset-0 bg-text-light/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-text-main flex items-center justify-center transition-all shadow-sm"
                            >
                                <span className="material-icons-round">close</span>
                            </button>

                            <div className="w-full md:w-5/12 relative h-64 md:h-auto bg-gray-50">
                                <Image
                                    fill
                                    src={selectedCourse.img || "/images/webinar_placeholder_new.png"}
                                    alt={selectedCourse.title}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                    <div className="flex items-center gap-2 mb-3 text-primary-light">
                                        <span className="material-icons-round text-sm">calendar_today</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">{selectedCourse.badge}</span>
                                    </div>
                                    <h4 className="text-white text-xl md:text-2xl font-serif leading-tight mb-2">{selectedCourse.title}</h4>
                                </div>
                            </div>

                            <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto flex flex-col">
                                <div className="mb-8 flex-1">
                                    <span className="inline-block bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                        {selectedCourse.category}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-serif text-text-light mb-4 leading-tight">{selectedCourse.title}</h3>
                                    <p className="text-text-dark text-base leading-relaxed mb-8">
                                        {selectedCourse.desc}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{lang === "pt" ? "Palestrante" : "Ponente"}</span>
                                            <span className="text-sm font-semibold text-text-light">{selectedCourse.instructorName}</span>
                                        </div>
                                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{lang === "pt" ? "Duração / Valor" : "Duración / Valor"}</span>
                                            <span className="text-sm font-semibold text-text-light">{selectedCourse.duration || (lang === "pt" ? "Consultar" : "Consultar")}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 mt-auto">
                                    <h5 className="text-sm font-bold text-text-light mb-4 flex items-center gap-2">
                                        <span className="material-icons-round text-primary">payments</span>
                                        {lang === "pt" ? "Opções de Inscrição" : "Opciones de Inscripción"}
                                    </h5>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Link href={`/${lang}/formaciones/${selectedCourse.slug || selectedCourse.id}/buy`} className="flex items-center justify-between p-4 bg-white border-2 border-primary rounded-2xl hover:bg-primary/5 transition-all group">
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{lang === "pt" ? "Inscrever-se com" : "Inscribirse con"}</span>
                                                <span className="text-sm font-semibold text-text-light">{lang === "pt" ? "Pagamento Direto" : "Pago Directo / Paypal"}</span>
                                            </div>
                                            <span className="material-icons-round text-primary group-hover:translate-x-1 transition-transform">credit_card</span>
                                        </Link>

                                        <button className="flex items-center justify-between p-4 bg-primary text-white rounded-2xl hover:bg-primary-dark transition-all shadow-md hover:-translate-y-0.5 group">
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{lang === "pt" ? "Resgatar" : "Canjear"}</span>
                                                <span className="text-sm font-semibold">{lang === "pt" ? "Crédito Pré-pago" : "Crédito Prepago"}</span>
                                            </div>
                                            <span className="material-icons-round group-hover:translate-x-1 transition-transform">confirmation_number</span>
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-center text-text-muted mt-5">
                                        {lang === "pt" 
                                            ? "* Os membros ativos da AIBAPT têm acesso preferencial e descontos especiais." 
                                            : "* Los miembros activos de AIBAPT tienen acceso preferencial y descuentos especiales."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedContactCourse && (() => {
                    const rawEmail = selectedContactCourse.route.replace("mailto:", "");
                    const emailSubject = encodeURIComponent(`Consulta: ${selectedContactCourse.title}`);
                    const emailBody = encodeURIComponent(`Hola ${selectedContactCourse.instructorName || "Instructor"},\n\nMe pongo en contacto a través de la web de AIBAPT para consultar sobre el curso acreditado "${selectedContactCourse.title}".\n\nSaludos.`);

                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${rawEmail}&su=${emailSubject}&body=${emailBody}`;
                    const outlookUrl = `https://outlook.live.com/default.aspx?rru=compose&to=${rawEmail}&subject=${emailSubject}&body=${emailBody}`;

                    const handleCopyEmail = () => {
                        navigator.clipboard.writeText(rawEmail);
                        toast.success(lang === "es" ? "Correo copiado al portapapeles" : "E-mail copiado para a área de transferência");
                        setSelectedContactCourse(null);
                    };

                    return (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedContactCourse(null)}
                                className="absolute inset-0 bg-text-light/60 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl p-8 border border-gray-100 flex flex-col gap-6"
                            >
                                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            <span className="material-icons-round text-base">mail</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-light text-base leading-snug">
                                                {lang === "es" ? "Opciones de Contacto" : "Opções de Contato"}
                                            </h4>
                                            <p className="text-[10px] text-text-dark/80 font-medium">
                                                {selectedContactCourse.instructorName || "AIBAPT"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedContactCourse(null)}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-text-main flex items-center justify-center transition-colors"
                                    >
                                        <span className="material-icons-round text-sm">close</span>
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <a
                                        href={gmailUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setSelectedContactCourse(null)}
                                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-primary/5 border border-gray-100 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons-round text-red-500">alternate_email</span>
                                            <span className="text-sm font-semibold text-text-light group-hover:text-primary transition-colors">Gmail (Web)</span>
                                        </div>
                                        <span className="material-icons-round text-gray-400 group-hover:translate-x-1 transition-transform text-sm">open_in_new</span>
                                    </a>

                                    <a
                                        href={outlookUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setSelectedContactCourse(null)}
                                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-primary/5 border border-gray-100 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons-round text-blue-500">mail_outline</span>
                                            <span className="text-sm font-semibold text-text-light group-hover:text-primary transition-colors">Outlook / Hotmail (Web)</span>
                                        </div>
                                        <span className="material-icons-round text-gray-400 group-hover:translate-x-1 transition-transform text-sm">open_in_new</span>
                                    </a>

                                    <button
                                        onClick={handleCopyEmail}
                                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-primary/5 border border-gray-100 rounded-2xl transition-all group w-full text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons-round text-amber-500">content_copy</span>
                                            <span className="text-sm font-semibold text-text-light group-hover:text-primary transition-colors">
                                                {lang === "es" ? "Copiar dirección de correo" : "Copiar endereço de e-mail"}
                                            </span>
                                        </div>
                                        <span className="material-icons-round text-gray-400 group-hover:translate-x-1 transition-transform text-sm">content_copy</span>
                                    </button>

                                    <a
                                        href={selectedContactCourse.route}
                                        onClick={() => setSelectedContactCourse(null)}
                                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-primary/5 border border-gray-100 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons-round text-primary">computer</span>
                                            <span className="text-sm font-semibold text-text-light group-hover:text-primary transition-colors">
                                                {lang === "es" ? "Usar aplicación del sistema" : "Usar aplicativo do sistema"}
                                            </span>
                                        </div>
                                        <span className="material-icons-round text-gray-400 group-hover:translate-x-1 transition-transform text-sm">open_in_new</span>
                                    </a>
                                </div>

                                <p className="text-[10px] text-center text-text-muted mt-2">
                                    {lang === "es" 
                                        ? "* Selecciona tu cliente de correo preferido para ponerte en contacto." 
                                        : "* Selecione o seu cliente de e-mail preferido para entrar em contato."}
                                </p>
                            </motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
}

export default function FormacionesClient(props: FormacionesClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <FormacionesContent {...props} />
        </Suspense>
    );
}
