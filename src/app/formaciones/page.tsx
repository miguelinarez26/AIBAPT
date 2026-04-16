"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WEBINARS_DATA } from "@/data/webinars";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function FormacionesContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "events" | "recordings" | "accredited" | "accreditation">("all");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && ["all", "events", "recordings", "accredited", "accreditation"].includes(tab)) {
            setActiveTab(tab as any);
        }
    }, [searchParams]);

    // TABS DEFINITION
    const tabs = [
        { id: "all", label: "Webinars", icon: "grid_view" },
        { id: "events", label: "Próximos Eventos", icon: "event_available" },
        { id: "recordings", label: "Eventos Grabados", icon: "ondemand_video" },
        { id: "accredited", label: t("edu.tab.accredited" as any), icon: "verified" },
        { id: "accreditation", label: t("edu.tab.accreditation" as any), icon: "history_edu" },
    ];

    // DATA FOR "WEBINARS" (Programa 2026)
    const webinarsData = [
        {
            img: "/images/webinar_placeholder_new.png",
            badge: "Marzo 12", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - España", title: "Abusos Sexuales en la Infancia: Secuelas y recuperación con Brainspotting y otros recursos",
            desc: "Abordaje profundo de las secuelas del abuso infantil mediante técnicas de Brainspotting para una recuperación integral del paciente.",
            instructorImg: "/images/secrvetaria.jpg", instructorName: "Susana Díaz", route: "/formaciones", price: "INSCRIPCIÓN"
        },
        {
            img: "/images/webinar_placeholder_new.png",
            badge: "Abril 16", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Brasil", title: "A Arte do Suporte em Psicoterapia: Presença, regulação e recursos clínicos avanzados",
            desc: "Exploraremos a sintonía relacional e recursos neurorrelacionais para apoiar o processo de cura em psicoterapias de foco no trauma.",
            instructorImg: "/images/secrvetaria.jpg", instructorName: "Daniel Gabarra", route: "/formaciones", price: "INSCRIPCIÓN"
        },
        {
            img: "/images/webinar_placeholder_new.png",
            badge: "Mayo 21", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Argentina", title: "Hipnosis y Brainspotting: Sinergia neurobiológica para el abordaje del TEPT y la integración del Trauma",
            desc: "Integración de técnicas de hipnosis y brainspotting para potenciar la neuroplasticidad y la integración de memorias traumáticas.",
            instructorImg: "/images/secrvetaria.jpg", instructorName: "Sebastián Segui", route: "/formaciones", price: "INSCRIPCIÓN"
        },
        {
            img: "/images/webinar_placeholder_new.png",
            badge: "Junio 18", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Portugal", title: "¿Intervenção em Crise, Burnout e Stress, como consequencias ao Trauma?",
            desc: "Análise profunda sobre o impacto do trauma no desenvolvimento de Burnout e stress crônico, e estratégias de intervenção em crise.",
            instructorImg: "/images/secrvetaria.jpg", instructorName: "Renata Teles", route: "/formaciones", price: "INSCRIPCIÓN"
        },
        {
            img: "/images/webinar_placeholder_new.png",
            badge: "Julio 16", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Mexico", title: "Herramientas creativas y Brainspotting",
            desc: "Uso de recursos creativos y expresivos en el marco del Brainspotting para facilitar el acceso a núcleos traumáticos subcorticales.",
            instructorImg: "/images/secrvetaria.jpg", instructorName: "Norma Contreras", route: "/formaciones", price: "INSCRIPCIÓN"
        },
        {
            img: "/images/webinar_placeholder_new.png",
            badge: "Agosto 20", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Brasil", title: "Novas Fronteiras na Clínica do Trauma",
            desc: "Exploração de novos protocolos e abordagens integrativas para o tratamiento de traumas complexos na prática clínica actual.",
            instructorImg: "/images/secrvetaria.jpg", instructorName: "Sandra Fiore", route: "/formaciones", price: "INSCRIPCIÓN"
        },
        {
            img: "/images/webinar_placeholder_new.png",
            badge: "Septiembre 17", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Chile", title: "Trauma, cuerpo y brainspotting",
            desc: "Enfoque somático en el procesamiento del trauma mediante la técnica de Brainspotting, conectando mente y cuerpo en la sanación.",
            instructorImg: "/images/secrvetaria.jpg", instructorName: "Juan Alexis", route: "/formaciones", price: "INSCRIPCIÓN"
        },
        {
            img: "/images/webinar_placeholder_new.png",
            badge: "Octubre 15", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Port - Brasil", title: "Do útero materno à relação terapêutica: A jornada da conexão",
            desc: "Estudo sobre os vínculos primários e sua repercussão na aliança terapêutica e na resolução de traumas de apego precoce.",
            instructorImg: "/images/secrvetaria.jpg", instructorName: "Angela Maranho", route: "/formaciones", price: "INSCRIPCIÓN"
        },
        {
            img: "/images/webinar_placeholder_new.png",
            badge: "Noviembre 19", badgeIcon: "calendar_today", badgeStyle: "text-primary",
            category: "Esp - Mexico", title: "Integración de Memorias Traumáticas",
            desc: "Técnicas avanzadas para la integración de memorias traumáticas fragmentadas en el flujo de la conciencia narrativa.",
            instructorImg: "/images/secrvetaria.jpg", instructorName: "Parcuve Mex", route: "/formaciones", price: "INSCRIPCIÓN"
        }
    ];

    // DATA FOR "PRÓXIMOS EVENTOS" (Entrenamientos/Cursos largos)
    const eventsData = [
        {
            img: "/images/webinar_flyer_2.png",
            badge: t("edu.events.badge" as any), badgeIcon: "event", badgeStyle: "text-primary",
            category: "Entrenamiento | Brasil",
            title: "Práctica Supervisada y Manejo Online",
            desc: "Este é um curso vivencial com demonstrações ao vivo e práticas supervisionadas, contando com manejo do atendimento online com foco no corpo.",
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
            desc: "O curso inclui Teoria e Protocolos Corporais exclusivos desenvolvidos por Silvia Guz.",
            instructorImg: "/images/secrvetaria.jpg",
            instructorName: "Silvia Guz", route: "/formaciones",
            price: t("webinars.event3.btn" as any)
        },
        {
            img: "/images/4.jpeg",
            badge: t("edu.events.badge" as any), badgeIcon: "event", badgeStyle: "text-primary",
            category: "Formação EMDR | Brasil",
            title: "Destravando o TDAH com EMDR e Autorregulação",
            desc: "Uma formação teórico-vivencial com os psicólogos especialistas em EMDR: Beth Maio e Leo Garcia.",
            instructorImg: "/images/secrvetaria.jpg",
            instructorName: "Beth Maio & Leo Garcia", route: "/formaciones",
            price: t("webinars.event4.btn" as any)
        }
    ];

    // DATA FOR "GRABACIONES (VOD)" - MIGRATED TO INTERNAL ROUTES
    const recordingsData = WEBINARS_DATA.map(w => ({
        img: w.img,
        badge: w.badge,
        badgeIcon: w.badgeIcon,
        badgeStyle: w.badgeStyle,
        category: w.category,
        title: w.title,
        desc: w.descLong.length > 100 ? w.descLong.substring(0, 100) + "..." : w.descLong,
        instructorImg: w.instructorImg,
        instructorName: w.instructorName,
        route: `/formaciones/${w.slug}`,
        price: w.price
    }));

    // DATA FOR "CURSOS ACREDITADOS"
    const accreditedData = [
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

    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    // Select active data for list/grid view
    const currentData = useMemo(() => {
        if (activeTab === "all") return webinarsData;
        if (activeTab === "events") return eventsData;
        if (activeTab === "recordings") return recordingsData;
        return [];
    }, [activeTab, webinarsData, eventsData, recordingsData]);

    const filteredData = useMemo(() => {
        let result = currentData;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (c) =>
                    c.title.toLowerCase().includes(term) ||
                    c.desc.toLowerCase().includes(term) ||
                    c.instructorName.toLowerCase().includes(term) ||
                    c.category.toLowerCase().includes(term)
            );
        }
        return result;
    }, [searchTerm, currentData]);

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
                    sourceData = eventsData;
                } else if (tab === "recordings") {
                    sourceData = recordingsData;
                } else if (tab === "all") {
                    sourceData = webinarsData;
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
                        <nav className="flex items-center gap-2 text-sm text-text-muted dark:text-gray-400">
                            <Link className="hover:text-primary transition-colors" href="/">{t("edu.nav.home" as any)}</Link>
                            <span className="material-icons-round text-[16px]">chevron_right</span>
                            <span
                                className={`transition-colors cursor-pointer ${activeTab === 'all' ? "font-medium text-primary cursor-default" : "hover:text-primary"}`}
                                onClick={() => setActiveTab('all')}
                            >
                                {t("edu.nav.edu" as any)}
                            </span>
                            {activeTab !== 'all' && (
                                <>
                                    <span className="material-icons-round text-[16px]">chevron_right</span>
                                    <span className="font-medium text-primary">
                                        {tabs.find(t => t.id === activeTab)?.label}
                                    </span>
                                </>
                            )}
                        </nav>
                        <h2 className="text-3xl md:text-5xl font-extrabold font-display text-text-main dark:text-white leading-tight">
                            {tabs.find(t => t.id === activeTab)?.label || t("edu.hub.title" as any)}
                        </h2>
                        <p className="text-text-muted dark:text-gray-300 text-lg">
                            {t("edu.hub.desc" as any)}
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

                {/* Content Section */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {(activeTab === "all" || activeTab === "events" || activeTab === "recordings") && (
                            <div className="flex-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredData.map((course, idx) => (
                                        <article key={idx} className="group flex flex-col bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-accent/20 dark:border-gray-800 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
                                            <Link href={course.route}>
                                                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer">
                                                    <Image fill alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={course.img} />
                                                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-text-main dark:text-white flex items-center gap-1.5 shadow-sm">
                                                        <span className={`material-icons-round ${course.badgeStyle} text-sm`}>{course.badgeIcon}</span>
                                                        {course.badge}
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
                                                    <span className="text-secondary dark:text-gray-300">{course.category}</span>
                                                </div>
                                                <Link href={course.route}>
                                                    <h3 className="text-lg font-bold text-text-main dark:text-white leading-snug mb-2 group-hover:text-primary transition-colors cursor-pointer">
                                                        {course.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2 mb-4">
                                                    {course.desc}
                                                </p>
                                                <div className="mt-auto pt-4 border-t border-accent/20 dark:border-gray-800 flex flex-col gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-accent/20 overflow-hidden relative">
                                                            <Image fill alt="Instructor" className="w-full h-full object-cover" src={course.instructorImg} />
                                                        </div>
                                                        <span className="text-sm font-medium text-text-main dark:text-gray-300">{course.instructorName}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2 pt-1">
                                                        <span className="text-lg font-bold text-text-main dark:text-white">{activeTab === "recordings" ? course.price : ""}</span>
                                                        <Link href={course.route} className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md">
                                                            ADQUIRIR <span className="material-icons-round text-[18px]">shopping_cart</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Accredited and Accreditation views remain same... */}
                        {activeTab === "accredited" && (
                            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-lg">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                        <span className="material-icons-round text-3xl">verified</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-text-main dark:text-white">{t("edu.tab.accredited" as any)}</h2>
                                        <p className="text-text-muted dark:text-gray-400">{t("edu.accredited.desc" as any)}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {filteredAccredited.map((item, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-surface-light border border-accent/20 dark:border-gray-700 rounded-xl hover:border-primary/40 hover:shadow-md transition-all">
                                            <div>
                                                <h4 className="font-bold text-text-main dark:text-white text-lg mb-1">{item.title}</h4>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted dark:text-gray-400">
                                                    <span className="flex items-center gap-1"><span className="material-icons-round text-[16px]">person</span> {item.instructor}</span>
                                                    <span className="flex items-center gap-1"><span className="material-icons-round text-[16px]">schedule</span> {item.hours.replace("horas", t("edu.label.hours" as any))}</span>
                                                </div>
                                            </div>
                                            <a href={item.contact} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex justify-center items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg transition-colors">
                                                <span className="material-icons-round text-[18px]">{item.linkTitle ? "language" : "mail"}</span> {item.linkTitle || t("edu.btn.contact" as any)}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "accreditation" && (
                            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-lg text-center">
                                <div className="w-20 h-20 bg-accent/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-icons-round text-4xl">history_edu</span>
                                </div>
                                <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">{t("edu.accreditation.title" as any)}</h2>
                                <p className="text-text-muted dark:text-gray-400 text-lg max-w-2xl mx-auto mb-10">{t("edu.accreditation.desc" as any)}</p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <a href="mailto:certificacion@aibapt.org" className="inline-flex justify-center items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                                        <span className="material-icons-round">email</span>
                                        CONTACTAR COMITÉ
                                    </a>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
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
