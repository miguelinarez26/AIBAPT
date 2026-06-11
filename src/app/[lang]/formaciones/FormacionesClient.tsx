"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { UniversalStepper } from "@/components/acreditaciones/UniversalStepper";
import { TramiteSelector } from "@/components/acreditaciones/TramiteSelector";

interface FormacionesClientProps {
    initialCourses: any[];
    initialEvents: any[];
    initialWebinars: any[];
    currentLang: string;
}

export default function FormacionesClient({ 
    initialCourses, 
    initialEvents, 
    initialWebinars,
    currentLang
}: FormacionesClientProps) {
    const { lang } = useLanguage();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"events" | "webinars" | "accredited" | "accreditation">("events");
    const [selectedTramiteId, setSelectedTramiteId] = useState<string | null>(null);
    const [languageFilter, setLanguageFilter] = useState<"all" | "es" | "pt">(currentLang as "es" | "pt");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list"); // Default a list como en producción
    const [categoryFilter, setCategoryFilter] = useState<"all" | "official" | "certified">("all");

    // 🕵️ DEBUG: Verificar datos de Supabase en consola
    useEffect(() => {
        console.log("🔍 [AIBAPT Debug] Datos de Supabase cargados:");
        console.log("Eventos:", initialEvents);
        console.log("Webinars:", initialWebinars);
    }, [initialEvents, initialWebinars]);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "recordings") setActiveTab("webinars");
        else if (tab && ["events", "webinars", "accredited", "accreditation"].includes(tab)) {
            setActiveTab(tab as any);
        }
    }, [searchParams]);

    const pageTitle = useMemo(() => {
        const titles: Record<string, string> = {
            events: lang === "es" ? "Próximos Eventos" : "Próximos Eventos",
            webinars: lang === "es" ? "Videoteca" : "Videoteca",
            accredited: lang === "es" ? "Directorio de Cursos Acreditados" : "Diretório de Cursos Acreditados",
            accreditation: lang === "es" ? "Acreditación de Cursos y Eventos" : "Acreditação de Cursos e Eventos"
        };
        return titles[activeTab] || titles.events;
    }, [activeTab, lang]);

    const pageSubtitle = useMemo(() => {
        if (activeTab === "events") return lang === "es" ? "Agenda de eventos futuros con inscripciones abiertas." : "Agenda de eventos futuros com inscrições abertas.";
        if (activeTab === "webinars") return lang === "es" ? "Lista de cursos y eventos grabados, disponibles para ver en cualquier momento." : "Lista de cursos e eventos gravados, disponíveis para ver a cualquier momento.";
        return lang === "es" ? "Avanzando en el estudio y tratamiento del trauma en Iberoamérica." : "Avançando no estudo e tratamento do trauma na Ibero-América.";
    }, [activeTab, lang]);

    // MAPEO DE EVENTOS
    const eventsData = useMemo(() => initialEvents.map(e => ({
        img: e.thumbnail_url || "/images/webinar_placeholder.png",
        badge: e.event_date ? (() => {
            const [year, month, day] = e.event_date.split('-').map(Number);
            return new Date(year, month - 1, day).toLocaleDateString(lang === "es" ? "es-ES" : "pt-BR", { day: "numeric", month: "long" });
        })() : "Próximamente",
        badgeIcon: e.badge_icon || "calendar_today",
        category: e.location || "ONLINE",
        categoryLabel: e.category_label || (e.is_official ? "EVENTO OFICIAL AIBAPT" : ""),
        isOfficial: e.is_official || e.category_label?.toLowerCase().includes("oficial"),
        title: e.title,
        desc: e.description,
        instructorImg: e.instructor_img || "/images/secrvetaria.jpg",
        instructorName: e.instructor_name || "AIBAPT",
        route: e.registration_url || "/formaciones",
        isExternal: e.is_external || false,
        price: e.price || (lang === "es" ? "Inscripción Abierta" : "Inscrição Aberta"),
        language: e.language || "es"
    })), [initialEvents, lang]);

    // MAPEO DE VIDEOTECA
    const webinarsData = useMemo(() => initialWebinars.map(w => ({
        img: w.thumbnail_url || "/images/webinar_placeholder.png",
        badge: w.badge || "VOD / Grabación",
        badgeIcon: "play_circle",
        category: w.category || "WEBINAR",
        title: w.title,
        desc: w.description,
        instructorImg: w.instructor_img || "/images/secrvetaria.jpg",
        instructorName: w.instructor_name || "AIBAPT",
        route: w.video_url || `/formaciones/${w.slug}`,
        duration: w.duration,
        price: w.price || "USD 0.00",
        isExternal: false,
        language: w.language || "es"
    })), [initialWebinars]);

    const currentData = useMemo(() => {
        if (activeTab === "events") return eventsData;
        if (activeTab === "webinars") return webinarsData;
        return [];
    }, [activeTab, eventsData, webinarsData]);

    const filteredData = useMemo(() => {
        let data: any[] = currentData;
        if (languageFilter !== "all") {
            data = data.filter(c => c.language === languageFilter);
        }
        if (activeTab === "events" && categoryFilter !== "all") {
            if (categoryFilter === "official") data = data.filter(c => c.isOfficial);
            if (categoryFilter === "certified") data = data.filter(c => !c.isOfficial);
        }
        if (!searchTerm) return data;
        const term = searchTerm.toLowerCase();
        return data.filter(c =>
            c.title.toLowerCase().includes(term) ||
            c.instructorName.toLowerCase().includes(term)
        );
    }, [searchTerm, currentData, languageFilter, categoryFilter, activeTab]);

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

    return (
        <div className="pt-20 bg-cream dark:bg-bg-dark min-h-screen pb-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]"></div>
            </div>

            <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-16">
                <div className="mb-14 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-text-main dark:text-white mb-4 tracking-tight">
                            {pageTitle}
                        </h1>
                        <p className="text-lg text-text-muted dark:text-gray-400 font-medium">
                            {pageSubtitle}
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                    >
                        {(activeTab === "events" || activeTab === "webinars") && (
                            <>
                            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-accent/10 shadow-xl shadow-gray-200/50 dark:shadow-none mb-10">
                                <div className="flex flex-col lg:flex-row items-center gap-6">
                                    <div className="relative w-full lg:w-1/3">
                                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl">search</span>
                                        <input 
                                            type="text" 
                                            placeholder={lang === "es" ? "Buscar por título o instructor..." : "Buscar por título ou instrutor..."}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-cream/50 dark:bg-bg-dark/50 border border-accent/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>

                                    <div className="hidden lg:block w-px h-10 bg-accent/10"></div>

                                    {activeTab === "events" && (
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                                            {([
                                                { value: "all", label: lang === "es" ? "Todos" : "Todos", icon: "dashboard" },
                                                { value: "official", label: lang === "es" ? "Oficial AIBAPT" : "Oficial AIBAPT", icon: "verified" },
                                                { value: "certified", label: lang === "es" ? "Certificados" : "Certificados", icon: "workspace_premium" }
                                            ] as const).map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setCategoryFilter(opt.value)}
                                                    className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                                        categoryFilter === opt.value 
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                                        : "bg-transparent text-text-muted hover:bg-accent/5"
                                                    }`}
                                                >
                                                    <span className="material-icons-round text-sm">{opt.icon}</span>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 bg-cream/30 dark:bg-bg-dark/30 p-1.5 rounded-2xl border border-accent/5">
                                        {([
                                            { value: "all", label: "🌐" },
                                            { value: "es", label: "ES" },
                                            { value: "pt", label: "PT" }
                                        ] as const).map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setLanguageFilter(opt.value)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                                                    languageFilter === opt.value 
                                                    ? "bg-white dark:bg-surface-dark text-primary shadow-md border border-accent/10" 
                                                    : "text-text-muted hover:text-primary"
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="ml-auto flex items-center gap-2 bg-accent/5 p-1 rounded-xl">
                                        <button 
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-surface-dark text-primary shadow-sm" : "text-text-muted"}`}
                                        >
                                            <span className="material-icons-round text-xl block">grid_view</span>
                                        </button>
                                        <button 
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-surface-dark text-primary shadow-sm" : "text-text-muted"}`}
                                        >
                                            <span className="material-icons-round text-xl block">view_list</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {filteredData.length === 0 ? (
                                <div className="text-center py-24 text-text-muted dark:text-gray-500">
                                    <span className="material-icons-round text-5xl mb-4 block">search_off</span>
                                    <p className="font-bold text-lg">{lang === "es" ? "Sin resultados para este filtro" : "Sem resultados para este filtro"}</p>
                                </div>
                            ) : (
                                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-4"}>
                                    {filteredData.map((course, idx) => (
                                        <article key={idx} className={`group bg-white dark:bg-surface-dark overflow-hidden border border-accent/10 transition-all duration-300 ${viewMode === "grid" ? "rounded-[2rem] flex flex-col h-full hover:shadow-2xl hover:shadow-primary/10 shadow-soft" : "rounded-3xl flex flex-row items-center p-3 sm:p-4 gap-4 sm:gap-6 shadow-sm hover:shadow-md"}`}>
                                            {/* Thumbnail */}
                                            <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 ${viewMode === "grid" ? "h-52 w-full" : "h-24 w-40 sm:h-28 sm:w-48 rounded-2xl"}`}>
                                                <img
                                                    src={course.img || "/images/webinar_placeholder.png"}
                                                    alt={course.title || "Formación"}
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/webinar_placeholder.png"; }}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                
                                                {viewMode === "grid" && activeTab === "events" && course.categoryLabel && (
                                                    <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg backdrop-blur-md ${
                                                        course.isOfficial ? "bg-primary text-white" : "bg-[#f3f4f6]/90 text-[#64748b]"
                                                    }`}>
                                                        <span className="material-icons-round text-xs">{course.isOfficial ? "verified" : "workspace_premium"}</span>
                                                        {course.categoryLabel}
                                                    </div>
                                                )}

                                                {viewMode === "grid" && (
                                                    <div className="absolute top-4 right-4 bg-white/95 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 shadow-xl border border-white/20">
                                                        <span className="material-icons-round text-primary text-sm">{course.badgeIcon}</span>
                                                        <span className="text-text-main dark:text-white uppercase tracking-tight">{course.badge}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`flex flex-col flex-1 ${viewMode === "grid" ? "p-6" : ""}`}>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                                                        {course.category}
                                                    </span>
                                                    {course.categoryLabel && viewMode === "list" && (
                                                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase ${
                                                            course.isOfficial 
                                                            ? "bg-primary/10 text-primary border border-primary/10" 
                                                            : "bg-gray-100 dark:bg-gray-800 text-text-muted"
                                                        }`}>
                                                            {course.categoryLabel}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className={`font-black mb-2 line-clamp-2 text-primary group-hover:text-primary-dark transition-colors leading-tight ${viewMode === "grid" ? "text-xl" : "text-xl sm:text-2xl"}`}>
                                                    {course.title}
                                                </h3>

                                                <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 ${viewMode === "grid" ? "mb-4" : "mb-2"}`}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full overflow-hidden border border-primary/20 flex-shrink-0">
                                                            <img
                                                                src={course.instructorImg || "/images/secrvetaria.jpg"}
                                                                alt={course.instructorName}
                                                                onError={(e) => { (e.target as HTMLImageElement).src = "/images/secrvetaria.jpg"; }}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-[11px] font-bold text-text-main dark:text-gray-300">{course.instructorName}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1.5 text-text-muted font-bold text-[11px]">
                                                        <span className="material-icons-round text-xs">{activeTab === "events" ? "calendar_today" : "play_circle"}</span>
                                                        {course.badge}
                                                    </div>
                                                </div>

                                                <p className={`text-text-muted dark:text-gray-400 leading-relaxed line-clamp-1 sm:line-clamp-2 ${viewMode === "grid" ? "text-sm mb-6 flex-1" : "text-[11px] mt-1"}`}>
                                                    {course.desc}
                                                </p>

                                                <div className={`flex items-center justify-between ${viewMode === "grid" ? "pt-5 border-t border-gray-50 dark:border-gray-800/50 mt-auto" : "hidden"}`}>
                                                    <div className="text-left">
                                                        <span className="block text-[10px] text-text-muted uppercase font-bold tracking-tighter mb-0.5">Inversión</span>
                                                        <span className="text-sm font-black text-primary">{course.price}</span>
                                                    </div>
                                                    <Link
                                                        href={course.route}
                                                        target={course.isExternal ? "_blank" : "_self"}
                                                        rel={course.isExternal ? "noopener noreferrer" : ""}
                                                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-xl font-black text-[10px] transition-all shadow-lg shadow-primary/10"
                                                    >
                                                        {activeTab === "events" ? "INSCRIPCIÓN" : "ADQUIRIR"}
                                                        <span className="material-icons-round text-sm">arrow_forward</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {viewMode === "list" && (
                                                <div className="flex flex-col items-end gap-2 shrink-0 pl-6 border-l border-accent/10 min-w-[150px] sm:min-w-[180px]">
                                                    {/* Mostrar precio solo en videoteca o si no es "Inscripción Abierta" */}
                                                    {activeTab === "webinars" && (
                                                        <div className="text-right mb-1">
                                                            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-tighter mb-0">Inversión</span>
                                                            <span className="text-base sm:text-lg font-black text-primary">{course.price}</span>
                                                        </div>
                                                    )}
                                                    <Link
                                                        href={course.route}
                                                        target={course.isExternal ? "_blank" : "_self"}
                                                        rel={course.isExternal ? "noopener noreferrer" : ""}
                                                        className="flex items-center justify-center gap-3 w-full bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black text-[10px] sm:text-xs transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 group/btn"
                                                    >
                                                        {activeTab === "events" ? "INSCRIPCIÓN" : "ADQUIRIR"}
                                                        <span className="material-icons-round text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                                    </Link>
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                            </>
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
                                                    {lang === "es" ? "Solicitar Información" : "Solicitar Informações"}
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
