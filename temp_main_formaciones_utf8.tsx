"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WEBINARS_DATA } from "@/data/webinars";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Import images for proper base path resolution
import placeholderImg from "../../../public/images/webinar_placeholder_new.png";
import imgEMDR from "../../../public/images/protocolos-corporais-em-terapia-emdr.png";
import imgBS from "../../../public/images/treinamento-basico-em-brainspotting.jpeg";
import imgTDAH from "../../../public/images/destravando-o-tdah-com-emdr-e-autorregula.jpeg";
import imgCongreso from "../../../public/images/i-congreso-internacional-traumaclinic.jpg";
import logoAibapt from "../../../public/images/favicon_official.png";

function FormacionesContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"events" | "recordings" | "accredited" | "accreditation" | "all">("events");
    const [filterType, setFilterType] = useState<"all" | "official" | "external">("all");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");

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

    // TABS DEFINITION
    const tabs = [
        { id: "events", label: "Pr├│ximos Eventos", icon: "event_available" },
        { id: "recordings", label: "Videoteca", icon: "ondemand_video" },
        { id: "accredited", label: "Cursos y eventos acreditados", icon: "verified" },
        { id: "accreditation", label: "Acredita tu curso o evento", icon: "history_edu" },
    ];
    // DATA FOR "WEBINARS" (Programa 2026)
    const webinarsData = [
        {
            img: placeholderImg,
            badge: "Marzo 12", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Espa├▒a", title: "Abusos Sexuales en la Infancia: Secuelas y recuperaci├│n con Brainspotting y otros recursos",
            desc: "Abordaje profundo de las secuelas del abuso infantil mediante t├®cnicas de Brainspotting para una recuperaci├│n integral del paciente.",
            instructorImg: "", instructorName: "Susana D├¡az", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "1 Cr├®dito AIBAPT"
        },
        {
            img: placeholderImg,
            badge: "Abril 16", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Brasil", title: "A Arte do Suporte em PSicoterapia: Presen├ºa, regula├º├úo e recursos cl├¡nicos",
            desc: "Exploraremos a sinton├¡a relacional e recursos neurorrelacionais para apoiar o processo de cura em psicoterapias de foco no trauma.",
            instructorImg: "", instructorName: "Daniel Gabarra", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "1 Cr├®dito AIBAPT"
        },
        {
            img: placeholderImg,
            badge: "Mayo 21", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Argentina", title: "Hipnosis y Brainspotting: Sinergia neurobiol├│gica para el abordaje del TEPT y la integraci├│n del Trauma",
            desc: "Integraci├│n de t├®cnicas de hipnosis y brainspotting para potenciar la neuroplasticidad y la integraci├│n de memorias traum├íticas.",
            instructorImg: "", instructorName: "Sebasti├ín Segui", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "1 Cr├®dito AIBAPT"
        },
        {
            img: placeholderImg,
            badge: "Junio 18", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Portugal", title: "┬┐interven├º├úo em Crise - Burnout e Stress, como consequencias ao Trauma?",
            desc: "An├ílise profunda sobre o impacto do trauma no desarrollo de Burnout e stress cr├┤nico, e estrat├®gias de interven├º├úo em crise.",
            instructorImg: "", instructorName: "Renata Teles", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "1 Cr├®dito AIBAPT"
        },
        {
            img: placeholderImg,
            badge: "Julio 16", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Mexico", title: "Herramientas creativas y Brainspotting",
            desc: "Uso de recursos creativos y expresivos en el marco del Brainspotting para facilitar el acceso a n├║cleos traum├íticos subcorticales.",
            instructorImg: "", instructorName: "Norma Contreras", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "1 Cr├®dito AIBAPT"
        },
        {
            img: placeholderImg,
            badge: "Agosto 20", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Brasil", title: "Esquemas relacionais organizadores",
            desc: "Explora├º├úo de novos protocolos e abordagens integrativas para o tratamiento de traumas complexos na pr├ítica cl├¡nica actual.",
            instructorImg: "", instructorName: "Sandra Fiore", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "1 Cr├®dito AIBAPT"
        },
        {
            img: placeholderImg,
            badge: "Septiembre 17", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Chile", title: "Trauma, cuerpo y Brainspotting desde la mirada Junguiana y Ericksoniana",
            desc: "Enfoque som├ítico en el procesamiento del trauma mediante la t├®cnica de Brainspotting, conectando mente y cuerpo en la sanaci├│n.",
            instructorImg: "", instructorName: "Juan Alexis", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "1 Cr├®dito AIBAPT"
        },
        {
            img: placeholderImg,
            badge: "Octubre 15", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Brasil", title: "Do ├║tero materno ├á relaci├│n terap├®utica: A jornada da conex├úo",
            desc: "Estudo sobre os v├¡nculos prim├írios e sua repercuss├úo na alian├ºa terap├¬utica e na resoluci├│n de traumas de apego precoce.",
            instructorImg: "", instructorName: "Angela Maranho", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "1 Cr├®dito AIBAPT"
        },
        {
            img: placeholderImg,
            badge: "Noviembre 19", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Mexico", title: "Entendiendo el Trauma desde el modelo PARCUVE",
            desc: "T├®cnicas avanzadas para la integraci├│n de memorias traum├íticas fragmentadas en el flujo de la conciencia narrativa.",
            instructorImg: "", instructorName: "Paulina Gonz├ílez Aguilar", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "1 Cr├®dito AIBAPT"
        },
        {
            img: placeholderImg,
            badge: "Diciembre 5", badgeIcon: "groups", badgeStyle: "text-primary",
            category: "Institucional", title: "Asamblea General AIBAPT",
            desc: "Reuni├│n anual de miembros de la Asociaci├│n Iberoamericana de Psicotrauma.",
            instructorImg: logoAibapt, instructorName: "AIBAPT", route: "/formaciones", price: "INSCRIPCI├ôN", isOfficial: true, duration: "Participaci├│n Socios"
        }
    ];

    // DATA FOR "PR├ôXIMOS EVENTOS" (Entrenamientos/Cursos largos)
    const eventsData = [
        {
            img: imgEMDR,
            badge: "Online", badgeIcon: "event", badgeStyle: "text-primary",
            category: "EMDR",
            title: "Protocolos Corporais em Terapia EMDR - Online",
            desc: "Curso vivencial com demonstra├º├Áes ao vivo e pr├íticas supervisionadas, focado no manejo do corpo no atendimento online. Inicia 8 de mayo de 2026.",
            instructorImg: "",
            instructorName: "Silvia Guz", route: "https://forms.gle/bxZ3Mo9xi7ryMWMR8",
            price: "IR A LA INSCRIPCI├ôN", isOfficial: false, duration: ""
        },
        {
            img: imgBS,
            badge: "Online", badgeIcon: "event", badgeStyle: "text-primary",
            category: "Brainspotting",
            title: "Treinamento B├ísico em Brainspotting ÔÇô online (Fases 1 e 2)",
            desc: "Teoria, demonstra├º├úo ao vivo e pr├íticas supervisionadas. Certifica├º├úo internacional de Brainspotting Inc. EUA e AIBAPT.",
            instructorImg: "",
            instructorName: "Silvia Guz", route: "https://docs.google.com/forms/d/e/1FAIpQLSeR2vfRztdvI-veMUkfJBBl1GFLje9_lEoL-BEATTQkYLInAQ/viewform",
            price: "IR A LA INSCRIPCI├ôN", isOfficial: false, duration: ""
        },
        {
            img: imgTDAH,
            badge: "Online", badgeIcon: "event", badgeStyle: "text-primary",
            category: "Formaci├│n EMDR | Brasil",
            title: "Destravando o TDAH com EMDR e Autorregula├º├úo",
            desc: "Uma leitura humana e neurocient├¡fica do TDAH articulada com EMDR e autorregula├º├úo, programado para el 20 de junio de 2026.",
            instructorImg: "",
            instructorName: "Beth Maio & Leo Garcia", route: "https://docs.google.com/forms/d/e/1FAIpQLSdOaAF7HfXPweQp9utzeKAOd62jLglIm95rAFUBelcRrcV1pg/viewform?pli=1",
            price: "IR A LA INSCRIPCI├ôN", isOfficial: false, duration: ""
        },
        {
            img: imgCongreso,
            badge: "H├¡brido", badgeIcon: "event", badgeStyle: "text-primary",
            category: "Congreso",
            title: "I Congreso Internacional TraumaClinic Latinoamerica",
            desc: "'Del Nacimiento a la Vida: Reprocesando Nuestro Desarrollo'. Evento h├¡brido del 9 al 12 de octubre de 2026. 10% dto. para miembros.",
            instructorImg: "",
            instructorName: "TraumaClinic", route: "https://congreso.traumacliniclatinoamerica.com",
            price: "IR A LA INSCRIPCI├ôN", isOfficial: false, duration: ""
        }
    ];

    // DATA FOR "GRABACIONES (VOD)" - MIGRATED TO INTERNAL ROUTES
    const recordingsData = WEBINARS_DATA
        .filter(w => w?.badge === "VOD / Grabaci├│n")
        .map(w => ({
            img: w?.img || placeholderImg,
            badge: w?.badge || "VOD",
            badgeIcon: w?.badgeIcon || "play_circle",
            badgeStyle: w?.badgeStyle || "text-secondary",
            category: w?.category || "Webinar",
            title: w?.title || "Sin t├¡tulo",
            desc: w?.descLong?.length > 100 ? w.descLong.substring(0, 100) + "..." : (w?.descLong || w?.desc || ""),
            instructorImg: w?.instructorImg || "",
            instructorName: w?.instructorName || "AIBAPT",
            route: `/formaciones/${w?.slug || ""}`,
            price: w?.price || "Consultar",
            isOfficial: w?.isOfficial !== undefined ? w.isOfficial : true,
            duration: w?.duration || "1 Cr├®dito AIBAPT"
        }));

    // DATA FOR "CURSOS ACREDITADOS"
    const accreditedData = [
        { title: "Acompa├▒ar p├®rdidas y procesos de duelo", instructor: "Bel├®n Rom├í y Santiago J├ícome", hours: "04 horas", contact: "mailto:belenromaromero@gmail.com" },
        { title: "Aleces: Introducci├│n a la Comprensi├│n y Curaci├│n del Trauma", instructor: "C. Cuenca, C. Melo y M. Salvador", hours: "28 horas", contact: "https://www.aleces.com", linkTitle: t("edu.btn.website" as any) },
        { title: "Atenci├│n intensiva", instructor: "Esly Carvalho / TraumaClinic", hours: "02 horas", contact: "https://www.traumacliniclatinoamerica.com/courses/atencionintensiva", linkTitle: t("edu.btn.website" as any) },
        { title: "Capacitaci├│n para Supervisores Certificados en EMDR", instructor: "Elizabeth Maio e Silvia Guz", hours: "10 horas", contact: "mailto:helo.ludovice@gmail.com" },
        { title: "Dilemas y toma de decisiones en la Terapia EMDR", instructor: "Bel├®n Rom├í y Santiago J├ícome", hours: "02 horas", contact: "mailto:belenromaromero@gmail.com" },
        { title: "El arte de crear entretejidos terap├®uticos", instructor: "Bel├®n Rom├í y Santiago J├ícome", hours: "06 horas", contact: "mailto:belenromaromero@gmail.com" },
        { title: "PIPA: Intervenci├│n de Profesionales en la Adversidad", instructor: "Esly Carvalho / TraumaClinic", hours: "13 horas", contact: "mailto:soporte@traumacliniclatinoamerica.com" },
        { title: "Protocolo de Episodios Traum├íticos Grupales (G-TEP)", instructor: "Patricio Galleguillos", hours: "06 horas", contact: "mailto:contacto@atept.cl" },
        { title: "Terapia Centrada en Esquemas", instructor: "Ariel Milton Pinto de Sousa", hours: "22 horas", contact: "mailto:arielmilton@gmail.com" },
        { title: "Trauma Complejo, Disociaci├│n y EMDR", instructor: "Patricio Galleguillos", hours: "12 horas", contact: "mailto:contacto@atept.cl" },
    ];


    // Select active data for list/grid view
    const currentData = useMemo(() => {
        if (activeTab === "events") return [...webinarsData, ...eventsData];
        if (activeTab === "recordings") return recordingsData;
        return [];
    }, [activeTab, webinarsData, eventsData, recordingsData]);

    const filteredData = useMemo(() => {
        let result = currentData;

        // Apply type filter
        if (filterType === "official") {
            result = result.filter(c => c.isOfficial === true);
        } else if (filterType === "external") {
            result = result.filter(c => c.isOfficial === false);
        }

        // Apply search filter
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

    const filteredAccredited = useMemo(() => {
        if (!searchTerm) return accreditedData;
        const term = searchTerm.toLowerCase();
        return accreditedData.filter(a => a.title.toLowerCase().includes(term) || a.instructor.toLowerCase().includes(term));
    }, [searchTerm, accreditedData]);

    // Handle incoming ?id URL parametr
    useEffect(() => {
        const idStr = searchParams.get("id");
        if (idStr !== null) {
            const index = parseInt(idStr, 10);
            if (!isNaN(index)) {
                let sourceData: any[] = [];
                const tab = searchParams.get("tab");
                if (tab === "events") {
                    sourceData = [...webinarsData, ...eventsData];
                } else if (tab === "recordings") {
                    sourceData = recordingsData;
                }

                if (index >= 0 && index < sourceData.length) {
                    // Slight delay to ensure UI renders first
                    setTimeout(() => setSelectedCourse(sourceData[index]), 100);
                }
            }
        }
    }, [searchParams, webinarsData, eventsData, recordingsData, activeTab]);

    return (
        <div className="pt-20 bg-cream dark:bg-bg-dark min-h-screen pb-20 relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
            </div>

            <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-12">
                {/* Header Area */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                    <div className="flex flex-col gap-4 max-w-xl">

                        <h2 className="text-3xl md:text-5xl font-extrabold font-display text-text-main dark:text-white leading-tight">
                            {tabs.find(t => t.id === activeTab)?.label || t("edu.hub.title" as any)}
                        </h2>
                        <p className="text-text-muted dark:text-gray-300 text-lg">
                            {activeTab === "events"
                                ? "Agenda de eventos futuros con inscripciones abiertas"
                                : activeTab === "recordings"
                                    ? "Lista de cursos y eventos grabados disponibles para adquisici├│n en el sitio web de la AIBAPT"
                                    : t("edu.hub.desc" as any)}
                        </p>
                    </div>
                    <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto flex-1">
                        {/* Search Bar */}
                        <div className="relative group w-full lg:max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-icons-round text-text-muted group-focus-within:text-primary transition-colors">search</span>
                            </div>
                            <input
                                className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-xl text-text-main dark:text-white placeholder-text-muted dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                                placeholder={t("edu.search" as any)}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {(activeTab === "events" || activeTab === "recordings") && (
                            <div className="flex-1">
                                {/* Filter Pills */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    {/* Filter Pills */}
                                    {activeTab === "events" ? (
                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                onClick={() => setFilterType("all")}
                                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filterType === "all" ? "bg-primary text-white shadow-md" : "bg-white/60 dark:bg-surface-dark border border-accent/20 dark:border-gray-800 text-text-main dark:text-gray-300 hover:bg-primary/10"}`}
                                            >
                                                Todos
                                            </button>
                                            <button
                                                onClick={() => setFilterType("official")}
                                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filterType === "official" ? "bg-primary text-white shadow-md" : "bg-white/60 dark:bg-surface-dark border border-accent/20 dark:border-gray-800 text-text-main dark:text-gray-300 hover:bg-primary/10"}`}
                                            >
                                                Oficiales AIBAPT
                                            </button>
                                            <button
                                                onClick={() => setFilterType("external")}
                                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filterType === "external" ? "bg-primary text-white shadow-md" : "bg-white/60 dark:bg-surface-dark border border-accent/20 dark:border-gray-800 text-text-main dark:text-gray-300 hover:bg-primary/10"}`}
                                            >
                                                Cursos y Eventos Certificados
                                            </button>
                                        </div>
                                    ) : <div />}

                                    {/* View Toggle */}
                                    <div className="flex items-center bg-white/60 dark:bg-surface-dark/60 backdrop-blur-sm rounded-xl p-1 border border-accent/20 dark:border-gray-800 self-end md:self-auto">
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "bg-primary text-white shadow-md" : "text-text-muted dark:text-gray-400 hover:text-primary"}`}
                                            title="Vista Lista"
                                        >
                                            <span className="material-icons-round text-[20px]">view_list</span>
                                        </button>
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-md" : "text-text-muted dark:text-gray-400 hover:text-primary"}`}
                                            title="Vista Cuadr├¡cula"
                                        >
                                            <span className="material-icons-round text-[20px]">grid_view</span>
                                        </button>
                                    </div>
                                </div>

                                <div className={viewMode === "grid" 
                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                                    : "flex flex-col gap-4"
                                }>
                                    {filteredData.map((course, idx) => (
                                        viewMode === "grid" ? (
                                            /* GRID VIEW CARD */
                                            <article key={idx} className="group flex flex-col bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-accent/20 dark:border-gray-800 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
                                                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                    <Image fill alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={course.img || placeholderImg} />
                                                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-text-main dark:text-white flex items-center gap-1.5 shadow-sm">
                                                        <span className={`material-icons-round ${course.badgeStyle} text-sm`}>{course.badgeIcon}</span>
                                                        {course.badge}
                                                    </div>
                                                    <div className="absolute top-3 right-3">
                                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm backdrop-blur-md uppercase tracking-wider ${course.isOfficial ? "bg-primary/90 text-white" : "bg-blue-600/90 text-white"}`}>
                                                            {course.isOfficial ? "Evento Oficial AIBAPT" : "Cursos y Eventos Certificados"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 flex flex-col flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] font-bold text-primary dark:text-gold uppercase tracking-widest">{course.category}</span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-secondary dark:text-white mb-2 group-hover:text-primary transition-colors duration-300 leading-snug min-h-[3rem]">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2 mb-4">
                                                        {course.desc}
                                                    </p>
                                                    <div className="mt-auto pt-4 border-t border-accent/20 dark:border-gray-800 flex flex-col gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center overflow-hidden relative border border-primary/20 p-1">
                                                                {course.instructorImg ? (
                                                                    <Image fill alt="Instructor" className="w-full h-full object-contain p-1" src={course.instructorImg} />
                                                                ) : (
                                                                    <span className="text-[10px] font-bold text-primary dark:text-gold uppercase tracking-tighter">
                                                                        {getInitials(course.instructorName)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-medium text-text-main dark:text-gray-300">{course.instructorName}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2 pt-1">
                                                            <span className="text-lg font-bold text-text-main dark:text-white">{activeTab === "recordings" ? course.price : ""}</span>
                                                            {course.isOfficial ? (
                                                                <button 
                                                                    onClick={() => setSelectedCourse(course)}
                                                                    className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md text-center justify-center w-full sm:w-auto"
                                                                >
                                                                    {activeTab === "recordings" ? "ADQUIRIR" : course.price}
                                                                    <span className="material-icons-round text-[18px]">
                                                                        {activeTab === "recordings" ? "shopping_cart" : "arrow_forward"}
                                                                    </span>
                                                                </button>
                                                            ) : (
                                                                <Link 
                                                                    href={course.route} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md text-center justify-center w-full sm:w-auto"
                                                                >
                                                                    {activeTab === "recordings" ? "ADQUIRIR" : course.price}
                                                                    <span className="material-icons-round text-[18px]">
                                                                        {activeTab === "recordings" ? "shopping_cart" : "open_in_new"}
                                                                    </span>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ) : (
                                            /* LIST VIEW ROW */
                                            <article key={idx} className="group flex flex-col md:flex-row items-center bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-accent/20 dark:border-gray-800 hover:shadow-lg hover:border-primary/30 transition-all duration-300 gap-4">
                                                <div className="relative w-full md:w-40 h-32 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                                                    <Image fill alt={course.title} className="object-cover group-hover:scale-105 transition-transform duration-500" src={course.img || placeholderImg} />
                                                </div>
                                                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{course.category}</span>
                                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${course.isOfficial ? "bg-primary/10 text-primary" : "bg-blue-600/10 text-blue-600"}`}>
                                                                {course.isOfficial ? "Evento Oficial AIBAPT" : "Cursos y Eventos Certificados"}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-base font-bold text-secondary dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                                                            {course.title}
                                                        </h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-icons-round text-text-muted text-sm">person</span>
                                                                <span className="text-xs font-medium text-text-muted dark:text-gray-400">{course.instructorName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`material-icons-round ${course.badgeStyle} text-sm`}>{course.badgeIcon}</span>
                                                                <span className="text-xs font-medium text-text-muted dark:text-gray-400">{course.badge}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 min-w-fit border-t md:border-t-0 md:border-l border-accent/10 dark:border-gray-800 pt-3 md:pt-0 md:pl-6">
                                                        <span className="text-lg font-bold text-text-main dark:text-white">{activeTab === "recordings" ? course.price : ""}</span>
                                                        {course.isOfficial ? (
                                                            <button 
                                                                onClick={() => setSelectedCourse(course)}
                                                                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md"
                                                            >
                                                                {activeTab === "recordings" ? "ADQUIRIR" : course.price}
                                                                <span className="material-icons-round text-[18px]">
                                                                    {activeTab === "recordings" ? "shopping_cart" : "arrow_forward"}
                                                                </span>
                                                            </button>
                                                        ) : (
                                                            <Link 
                                                                href={course.route} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md"
                                                            >
                                                                {activeTab === "recordings" ? "ADQUIRIR" : course.price}
                                                                <span className="material-icons-round text-[18px]">
                                                                    {activeTab === "recordings" ? "shopping_cart" : "open_in_new"}
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Accredited and Accreditation views - Temporarily placeholder as requested */}
                        {activeTab === "accredited" && (
                            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-lg text-center">
                                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-icons-round text-4xl">verified</span>
                                </div>
                                <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">Cursos y eventos acreditados</h2>
                                <p className="text-text-muted dark:text-gray-400 text-lg">Secci├│n en construcci├│n. Pr├│ximamente encontrar├ís aqu├¡ el cat├ílogo de eventos externos avalados por AIBAPT.</p>
                            </div>
                        )}

                        {activeTab === "accreditation" && (
                            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-lg text-center">
                                <div className="w-20 h-20 bg-accent/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-icons-round text-4xl">history_edu</span>
                                </div>
                                <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">Acredita tu curso o evento</h2>
                                <p className="text-text-muted dark:text-gray-400 text-lg">Secci├│n en construcci├│n. Aqu├¡ podr├ís enviar la documentaci├│n para que tus programas reciban el reconocimiento de AIBAPT.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Webinar Detail Modal */}
            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCourse(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all"
                            >
                                <span className="material-icons-round">close</span>
                            </button>

                            {/* Left: Image & Quick Info */}
                            <div className="w-full md:w-2/5 relative h-64 md:h-auto bg-gray-100">
                                <Image
                                    fill
                                    src={selectedCourse.img || "/images/webinar_placeholder_new.png"}
                                    alt={selectedCourse.title}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                        <span className="material-icons-round text-sm">calendar_today</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">{selectedCourse.badge}</span>
                                    </div>
                                    <h4 className="text-white text-lg font-bold leading-tight mb-2">{selectedCourse.title}</h4>
                                </div>
                            </div>

                            {/* Right: Details & Checkout */}
                            <div className="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto">
                                <div className="mb-8">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 block">{selectedCourse.category}</span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-4 leading-tight">{selectedCourse.title}</h3>
                                    <p className="text-text-muted dark:text-gray-400 text-base leading-relaxed mb-6">
                                        {selectedCourse.desc}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/10">
                                            <span className="text-[10px] font-bold text-text-muted dark:text-gray-500 uppercase block mb-1">Ponente</span>
                                            <span className="text-sm font-bold text-text-main dark:text-white">{selectedCourse.instructorName}</span>
                                        </div>
                                        <div className="bg-accent/5 dark:bg-accent/10 p-4 rounded-2xl border border-accent/10">
                                            <span className="text-[10px] font-bold text-text-muted dark:text-gray-500 uppercase block mb-1">Duraci├│n / Valor</span>
                                            <span className="text-sm font-bold text-text-main dark:text-white">{selectedCourse.duration || "Consultar"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Area */}
                                <div className="space-y-4 pt-6 border-t border-accent/20 dark:border-gray-800">
                                    <h5 className="text-sm font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                        <span className="material-icons-round text-primary">payments</span>
                                        Opciones de Inscripci├│n
                                    </h5>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-2 border-primary rounded-2xl hover:bg-primary/5 transition-all group">
                                            <div className="flex flex-col items-start">
                                                <span className="text-[10px] font-bold text-primary uppercase">Inscribirse con</span>
                                                <span className="text-sm font-bold text-text-main dark:text-white">Pago Directo</span>
                                            </div>
                                            <span className="material-icons-round text-primary group-hover:translate-x-1 transition-transform">payments</span>
                                        </button>

                                        <button className="flex items-center justify-between p-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group">
                                            <div className="flex flex-col items-start">
                                                <span className="text-[10px] font-bold text-white/80 uppercase">Canjear</span>
                                                <span className="text-sm font-bold">Cr├®dito Prepago</span>
                                            </div>
                                            <span className="material-icons-round group-hover:translate-x-1 transition-transform">confirmation_number</span>
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-center text-text-muted dark:text-gray-500 italic mt-4">
                                        * Los miembros activos de AIBAPT tienen acceso preferencial y descuentos especiales.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FormacionesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cream dark:bg-bg-dark flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <FormacionesContent />
        </Suspense>
    );
}
