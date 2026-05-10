"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WEBINARS_DATA } from "@/data/webinars";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { UniversalStepper } from "@/components/acreditaciones/UniversalStepper";
import { TramiteSelector } from "@/components/acreditaciones/TramiteSelector";

export default function FormacionesClient({ initialCourses }: { initialCourses: any[] }) {
    const { t, lang } = useLanguage();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    
    // El estado activeTab se sincroniza EXCLUSIVAMENTE con la URL (?tab=)
    const [activeTab, setActiveTab] = useState<"events" | "webinars" | "accredited" | "accreditation">("events");
    const [selectedTramiteId, setSelectedTramiteId] = useState<string | null>(null);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && ["events", "webinars", "accredited", "accreditation"].includes(tab)) {
            setActiveTab(tab as any);
        }
    }, [searchParams]);

    // Títulos dinámicos centralizados para SEO e i18n
    const pageTitle = useMemo(() => {
        const titles: Record<string, string> = {
            events: lang === 'es' ? "Próximos Eventos y Formaciones" : "Próximos Eventos e Formações",
            webinars: "Videoteca AIBAPT",
            accredited: lang === 'es' ? "Directorio de Cursos Acreditados" : "Diretório de Cursos Acreditados",
            accreditation: lang === 'es' ? "Acreditación de Cursos y Eventos" : "Acreditação de Cursos e Eventos"
        };
        return titles[activeTab] || titles.events;
    }, [activeTab, lang]);

    // Mapear los cursos que vienen del Server Component (Supabase)
    const serverCourses = initialCourses.map(course => ({
        img: course.img || "/images/webinar_placeholder_new.png",
        badge: "Nuevo", badgeIcon: "new_releases", badgeStyle: "text-primary",
        category: course.category || "General",
        title: course.title,
        desc: course.description || "",
        instructorImg: "/images/secrvetaria.jpg",
        instructorName: "Instructor AIBAPT",
        route: `/formaciones/${course.id}`,
        price: course.price || "INSCRIPCIÓN"
    }));

    // DATA FOR "PRÓXIMOS EVENTOS"
    const eventsData = useMemo(() => [
        {
            img: "/images/webinar_flyer_2.png",
            badge: t("edu.events.badge" as any), badgeIcon: "event", badgeStyle: "text-primary",
            category: "Entrenamiento | Brasil",
            title: "Práctica Supervisada y Manejo Online",
            desc: "Este é um curso vivencial com demonstrações ao vivo e práticas supervisionadas, contando com manejo do atendimento online con foco no corpo.",
            instructorImg: "/images/secrvetaria.jpg",
            instructorName: "Silvia Guz", route: "/formaciones",
            price: t("webinars.event1.btn" as any)
        },
        {
            img: "/images/webinar_flyer_1.png",
            badge: t("edu.events.presencial" as any), badgeIcon: "location_on", badgeStyle: "text-amber-500",
            category: "Psicodrama | Presencial",
            title: "Introdução ao Psicodrama: Técnicas, Metodologia e Ateliê de Direção",
            desc: "Neste curso presencial em Brasília, a Dra. Esly Carvalho irá guiá-lo por una jornada teórico-prática e vivencial.",
            instructorImg: "/images/secrvetaria.jpg",
            instructorName: "Dra. Esly Carvalho", route: "/formaciones",
            price: t("webinars.event2.btn" as any)
        },
        {
            img: "/images/3.png",
            badge: t("edu.events.badge" as any), badgeIcon: "event", badgeStyle: "text-primary",
            category: "Protocolos Corporais | Online",
            title: "Protocolos Corporais em Terapia EMDR - Online",
            desc: "O curso incluye Teoria e Protocolos Corporais exclusivos desenvolvidos por Silvia Guz.",
            instructorImg: "/images/secrvetaria.jpg",
            instructorName: "Silvia Guz", route: "/formaciones",
            price: t("webinars.event3.btn" as any)
        },
        {
            img: "/images/4.jpeg",
            badge: t("edu.events.badge" as any), badgeIcon: "event", badgeStyle: "text-primary",
            category: "Formação EMDR | Brasil",
            title: "Destravando o TDAH con EMDR e Autorregulação",
            desc: "Uma formación teórico-vivencial con os psicólogos especialistas en EMDR: Beth Maio e Leo Garcia.",
            instructorImg: "/images/secrvetaria.jpg",
            instructorName: "Beth Maio & Leo Garcia", route: "/formaciones",
            price: t("webinars.event4.btn" as any)
        }
    ], [t]);

    // DATA FOR "VIDEOTECA" (webinars)
    const recordingsData = WEBINARS_DATA.map(w => ({
        img: w.img,
        badge: w.badge,
        badgeIcon: w.badgeIcon || "play_circle",
        badgeStyle: w.badgeStyle || "text-secondary",
        category: w.category,
        title: w.title,
        desc: w.descLong.length > 100 ? w.descLong.substring(0, 100) + "..." : w.descLong,
        instructorImg: w.instructorImg,
        instructorName: w.instructorName,
        route: `/formaciones/${w.slug}`,
        price: w.price
    }));

    // DATA FOR "DIRECTORIO" (accredited)
    const accreditedData = [
        { title: "Acompañar pérdidas y procesos de duelo", instructor: "Belén Romá y Santiago Jácome", hours: "04 horas", contact: "mailto:belenromaromero@gmail.com" },
        { title: "Aleces: Introducción a la Comprensión y Curación del Trauma", instructor: "C. Cuenca, C. Melo y M. Salvador", hours: "28 horas", contact: "https://www.aleces.com" },
        { title: "Atención intensiva", instructor: "Esly Carvalho / TraumaClinic", hours: "02 horas", contact: "https://www.traumacliniclatinoamerica.com/courses/atencionintensiva" },
        { title: "Capacitación para Supervisores Certificados en EMDR", instructor: "Elizabeth Maio e Silvia Guz", hours: "10 horas", contact: "mailto:helo.ludovice@gmail.com" },
        { title: "Dilemas y toma de decisiones en la Terapia EMDR", instructor: "Belén Romá y Santiago Jácome", hours: "02 horas", contact: "mailto:belenromaromero@gmail.com" },
        { title: "El arte de crear entretejidos terapéuticos", instructor: "Belén Romá y Santiago Jácome", hours: "06 horas", contact: "mailto:belenromaromero@gmail.com" },
        { title: "PIPA: Intervención de Profesionales en la Adversidad", instructor: "Esly Carvalho / TraumaClinic", hours: "13 horas", contact: "mailto:soporte@traumacliniclatinoamerica.com" },
        { title: "Protocolo de Episodios Traumáticos Grupales (G-TEP)", instructor: "Patricio Galleguillos", hours: "06 horas", contact: "mailto:contacto@atept.cl" },
        { title: "Terapia Centrada en Esquemas", instructor: "Ariel Milton Pinto de Sousa", hours: "22 horas", contact: "mailto:arielmilton@gmail.com" },
        { title: "Trauma Complejo, Disociación y EMDR", instructor: "Patricio Galleguillos", hours: "12 horas", contact: "mailto:contacto@atept.cl" },
    ];

    const currentData = useMemo(() => {
        if (activeTab === "events") return [...serverCourses, ...eventsData];
        if (activeTab === "webinars") return recordingsData;
        return [];
    }, [activeTab, serverCourses, eventsData, recordingsData]);

    const filteredData = useMemo(() => {
        if (!searchTerm) return currentData;
        const term = searchTerm.toLowerCase();
        return currentData.filter(c => 
            c.title.toLowerCase().includes(term) || 
            c.instructorName.toLowerCase().includes(term)
        );
    }, [searchTerm, currentData]);

    return (
        <div className="pt-20 bg-cream dark:bg-bg-dark min-h-screen pb-20 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]"></div>
            </div>

            <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-16">
                {/* Header Dinámico (Breadcrumbs + H1) */}
                <div className="mb-14 text-center md:text-left">
                    <nav className="flex items-center justify-center md:justify-start gap-2 text-sm text-text-muted mb-6">
                        <Link href={`/${lang}`} className="hover:text-primary transition-colors">{t("edu.nav.home" as any)}</Link>
                        <span className="material-icons-round text-[16px]">chevron_right</span>
                        <span className="text-primary font-bold">{pageTitle}</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-black text-text-main dark:text-white mb-4 tracking-tight">
                        {pageTitle}
                    </h1>
                    <div className="h-1.5 w-24 bg-primary rounded-full mx-auto md:mx-0"></div>
                </div>

                {/* El componente de Tabs ha sido eliminado para simplificar la UX y evitar redundancia con el Header */}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                    >
                        {(activeTab === "events" || activeTab === "webinars") && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredData.map((course, idx) => (
                                    <article key={idx} className="group bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-accent/10 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                                        <div className="relative h-56">
                                            <Image fill src={course.img} alt={course.title} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                                <span className="material-icons-round text-primary text-sm">{course.badgeIcon || 'star'}</span>
                                                {course.badge}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                                    {course.category}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-xl mb-3 line-clamp-2 text-text-main dark:text-white group-hover:text-primary transition-colors">{course.title}</h3>
                                            <p className="text-sm text-text-muted dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">{course.desc}</p>
                                            <div className="pt-5 border-t border-gray-100 dark:border-gray-800">
                                                <Link href={course.route} className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white text-center py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20">
                                                    {lang === 'es' ? 'VER DETALLES' : 'VER DETALHES'}
                                                    <span className="material-icons-round text-[18px]">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {activeTab === "accredited" && (
                            <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] p-10 border border-accent/10 shadow-xl shadow-gray-200/50 dark:shadow-none">
                                <div className="grid grid-cols-1 gap-6">
                                    {accreditedData.map((item, i) => (
                                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20 group">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-text-main dark:text-white group-hover:text-primary transition-colors">{item.title}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                                                    <span className="flex items-center gap-1"><span className="material-icons-round text-sm">person</span> {item.instructor}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                    <span className="flex items-center gap-1"><span className="material-icons-round text-sm">schedule</span> {item.hours}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 md:mt-0">
                                                <a href={item.contact} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 border border-primary/20 text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-white transition-all">
                                                    {lang === 'es' ? 'Solicitar Información' : 'Solicitar Informações'}
                                                    <span className="material-icons-round text-sm">mail</span>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "accreditation" && (
                            <div className="max-w-4xl mx-auto py-4">
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
        </div>
    );
}
