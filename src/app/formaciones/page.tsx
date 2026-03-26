"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
        { id: "all", label: t("edu.tab.all" as any), icon: "grid_view" },
        { id: "events", label: t("edu.tab.events" as any), icon: "event_available" },
        { id: "recordings", label: t("edu.tab.recordings" as any), icon: "ondemand_video" },
        { id: "accredited", label: t("edu.tab.accredited" as any), icon: "verified" },
        { id: "accreditation", label: t("edu.tab.accreditation" as any), icon: "history_edu" },
    ];

    // DATA FOR "EVENTOS FUTUROS"
    const eventsData = [
        {
            img: "/images/Gemini_Generated_Image_6hif2l6hif2l6hif.png",
            badge: t("edu.events.badge" as any), badgeIcon: "event", badgeStyle: "text-primary",
            category: t("edu.cat.trauma" as any),
            title: t("webinars.event1.title" as any),
            desc: t("webinars.event1.desc" as any),
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoOzwVvSo8OtzhSZ9ejd_KbxNBjpnhXQL9-Gw2H5V3FFwwQnXX5UjzfRAvUS4Y4L-dVuJixN9r2RorGMDH_M7mCaG0472485sdJvL6uD8UHUhJU3yWwtRrddQC8XZBo--UiwOn8LQEqAKqx50_Ar7sho3VrEyLybP8kOFAkqUMrTtvc4PegfqwK88cTsfAqjGwtiWMF-jnMkavODzqJe4tCRO5df6KLvWHegIBaYX3qVTvdQr9GQPdgp0rXMwg4Ya3Z8IbsvOgt0C",
            instructorName: "Daniel Gabarra", route: "/formaciones/arte-apoyo-gabarra",
            price: t("edu.btn.register" as any)
        },
        {
            img: "/images/Gemini_Generated_Image_5ekuqs5ekuqs5eku.png",
            badge: t("edu.events.presencial" as any), badgeIcon: "location_on", badgeStyle: "text-amber-500",
            category: t("edu.cat.psicodrama" as any),
            title: t("webinars.event2.title" as any),
            desc: t("webinars.event2.desc" as any),
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZZoN75buPkv39MTVOsuw-fBLszBlKmA9opTeWzIaxy2-7JpViUiVyY5BhKsQwkwHqR5w38bbcIeOtjpZj7t7D6kcuUNMTnaJ1ParB2dhZuZhicFVngsvlZ3UPGlhrxQ6HkBqNBD9Ia7Rx751fo_ZZ2isPFRpi7NNwj5O9nvu8xTrfDPRaJUB7ySaa9U3NljKBolHS6gEMNDgIEZRADPTgjAYnl4_jPmwYUW2nQ0vAxdVEj6x20zloWkEc_V-Zwq7hS7HEOscDQssJ",
            instructorName: "Dra. Esly Carvalho", route: "/formaciones/introduccion-psicodrama-esly",
            price: t("edu.btn.register" as any)
        },
        {
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOSz3yrAAVIFvEvTU7HtDm-FplkXoOHo6U7hnzW70qijyhQOVMhxr4DkaC5BFJ0zbjHEuVRIIsKrhoS4MxAvCbPenlwVR96Qu5nXwrYvBit6wmwpWQXwR6aaOKJU4ZViiVrWbrvYXAFDQATSgDx7HcJ5aAOmFrjClLM0DdsjJXxEUbScIJTtxs_KykLaRIeUi6NNud7w8Pgnq7frwEhmhXNprL0OQ8NRQGBA3Yv-wUt4ZL8Dr6LJgstZI_nY3fHXYmZ-6qLOy32Z9c",
            badge: t("edu.events.badge" as any), badgeIcon: "event", badgeStyle: "text-primary",
            category: t("edu.cat.emdr" as any),
            title: "Formación EMDR con Foco en el Cuerpo",
            desc: "Curso vivencial con demostraciones en vivo. Teoria y Protocolos Corporales de Silvia Guz.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNdL1EvGJ-TP7UjufnWMsgHfxumeFtXyT7V4kS7UI46ruqRQmBEu3Oj0_u9so7ZJqqmNnFa5kft4D7SRqdkbDggEN8FEG2cfZ-lK5OmcpCNZDa0MYE2V8KgHi1fjEbh68HzW0CA9qMiN2A2Zc1_kWTIOch4QDhhrGNAj3zWdzr8pJ0hPanvSZKj6AIeLPDwzPNESXAV7dISaKN8mE2MT7OU5I6AAU4V4wpzaiYr8yDHjJ-AxP5hTMznNu0XYrjR0M4g_mnssaMPYYd",
            instructorName: "Beth Maio & Leo Garcia", route: "/formaciones/emdr-cuerpo",
            price: t("edu.btn.register" as any)
        }
    ];

    // DATA FOR "GRABACIONES (VOD)"
    const recordingsData = [
        {
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwjFC5Lqrsmp9SkpZJBTVG_JbbrRAFgQ_3cZOFvZTEwTITGSrOiSNtbsvdTaDjq-mPDFM-0iiybDqdMIK2kUl_PHBeQ4k8JvOrv0miSzm5I5wRXjAPZ_UNmlI8Aric3V1sGRGnXPQdumg4ORULY_Ql3BDDqG03F_KQBtqbCbe93GCUcRZ-5Kd6hSenP-XA6nm7Zsv8QiRSDaPl7jNcEa-TNRBwnxFjRVyLPztesJWPiZT3vkgCQuTqyppKaciBZQC_7wSnF3bUvf7c",
            badge: t("edu.recordings.badge" as any), badgeIcon: "play_circle", badgeStyle: "text-white",
            category: t("edu.cat.trauma" as any),
            title: "Trauma Webinar #19 | Mirando a través de la Voracidad",
            desc: "Sanando el Trauma Complejo y la Compulsión Alimentaria con Psicoterapias de Reprocesamiento.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoOzwVvSo8OtzhSZ9ejd_KbxNBjpnhXQL9-Gw2H5V3FFwwQnXX5UjzfRAvUS4Y4L-dVuJixN9r2RorGMDH_M7mCaG0472485sdJvL6uD8UHUhJU3yWwtRrddQC8XZBo--UiwOn8LQEqAKqx50_Ar7sho3VrEyLybP8kOFAkqUMrTtvc4PegfqwK88cTsfAqjGwtiWMF-jnMkavODzqJe4tCRO5df6KLvWHegIBaYX3qVTvdQr9GQPdgp0rXMwg4Ya3Z8IbsvOgt0C",
            instructorName: "Múltiples Ponentes", route: "/formaciones/trauma-webinar-19",
            price: t("edu.btn.buy" as any)
        },
        {
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOSz3yrAAVIFvEvTU7HtDm-FplkXoOHo6U7hnzW70qijyhQOVMhxr4DkaC5BFJ0zbjHEuVRIIsKrhoS4MxAvCbPenlwVR96Qu5nXwrYvBit6wmwpWQXwR6aaOKJU4ZViiVrWbrvYXAFDQATSgDx7HcJ5aAOmFrjClLM0DdsjJXxEUbScIJTtxs_KykLaRIeUi6NNud7w8Pgnq7frwEhmhXNprL0OQ8NRQGBA3Yv-wUt4ZL8Dr6LJgstZI_nY3fHXYmZ-6qLOy32Z9c",
            badge: t("edu.recordings.badge" as any), badgeIcon: "play_circle", badgeStyle: "text-white",
            category: t("edu.cat.trauma" as any),
            title: "Trauma Webinar #18 | Guion de vida y Trauma Psicológico",
            desc: "Mi historia en el espejo. Cómo nuestras narrativas moldean el manejo del trauma.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIMYXD1XBkPUXnI7W8TK-Falr56QML6_oYvevsXwebVRLM6yM484YbyqQP62PD9-1HELQs-V-7Q1-jz2iy4ROyDofWCFtXmtark3aEyXFYxUWRaaMb-b8rSDe5yEks2qcHgLQYrjZSQfdbnBgkPOErphM9pG-G11gIGy3kIfRUeMCk9wa3IXguNUxHK1gz7FvrBVAIgIi6JCwHkQoxYVBFN5acONzCgDZcx0X6yjuJSB-pVx6ir8zRpOuIKCLsMBRX5I2eaKJA80cf",
            instructorName: t("edu.instructor.committee" as any), route: "/formaciones/trauma-webinar-18",
            price: t("edu.btn.buy" as any)
        },
        {
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg0CvRIYkg4wPoJolTJNC_Zr1bxk5BqCd5apRpWa9kG7s7SwxjPrL1-hBhzsdjlVhh66bZCjKoNMfKJtrZIqHod5P0f7aHH276s7_hU6gwn-WjS-absUJn2eZVKpMXblST-Uspy2TOfal2AGJNJMKBDRAEYgQqGNKf5NHrdH-sCyoIwhNNGVSQkzJSIED35BFfFIOqmVI0O-AkdDJDbfo2HE_wUdB4VjvFQlwN7r5PEf6IzgCsYH0N0tg67N4Bpqu4u-YEDGf05xER",
            badge: t("edu.recordings.badge" as any), badgeIcon: "play_circle", badgeStyle: "text-white",
            category: t("edu.cat.emdr" as any),
            title: "Trauma Webinar #17 | IA para Psicoterapeutas EMDR",
            desc: "Orientaciones prácticas para sesiones incorporando Inteligencia Artificial en el flujo clinico.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtx3ZYvsza8SXCic3k-NtlmoM0Dpuz9uUrkFYAL5wpxD18NZyQawcnouB8ySDwZHw6qDl_wOzhsvekoEQMS3P94SiBuXtpcSR2hnN7XVfdyRP_T_6C6HrMaMxkE8_511L4PyGz78oeVbcARh5tlDvFFbjG1I7RQ8vXkhhBbI7ZBDSl9kNIrZr1xoXQLbebsU4nLB6tNzzBl14IpOB5noOXJjNLBPp6g_uGB35X6KA_JQL5hupKSc47Ag-otItC-HOV0s70XyJ--Ssj",
            instructorName: "Comité", route: "/formaciones/trauma-webinar-17",
            price: t("edu.btn.buy" as any)
        },
        {
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFqVfbqfrxeVaN8arWBYhx92ysovO8ycmOEMqgLHphoqoaZX3YVyN8Iyj1ZQ68Js91JmFxn-SzqGm6Rizp9aLbIrzR_Qi5W95BJ_vTTQBs8fcqQjU5swef1wmJ9_TY_AIsTRbvo5Y2GXI34vl-Nnh0x8rhtUbHnq8MBPuEveAXUUT5D3-7wVp3aE8DmmWg5nX_-jyruUVicPwaf3E7d0JFEJ0gyvmwIL4nwtP9jxWcTEALOBbLPrq36rOShJ373bn90i1QkQ_djCIv",
            badge: t("edu.recordings.badge" as any), badgeIcon: "play_circle", badgeStyle: "text-white",
            category: t("edu.cat.infantil" as any),
            title: "Trauma Webinar #16 | El abuso sexual infantil",
            desc: "Desafíos en el acompañamiento y prevención en la terapia.",
            instructorImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoOzwVvSo8OtzhSZ9ejd_KbxNBjpnhXQL9-Gw2H5V3FFwwQnXX5UjzfRAvUS4Y4L-dVuJixN9r2RorGMDH_M7mCaG0472485sdJvL6uD8UHUhJU3yWwtRrddQC8XZBo--UiwOn8LQEqAKqx50_Ar7sho3VrEyLybP8kOFAkqUMrTtvc4PegfqwK88cTsfAqjGwtiWMF-jnMkavODzqJe4tCRO5df6KLvWHegIBaYX3qVTvdQr9GQPdgp0rXMwg4Ya3Z8IbsvOgt0C",
            instructorName: t("edu.instructor.pediatric" as any), route: "/formaciones/trauma-webinar-16",
            price: t("edu.btn.buy" as any)
        }
    ];

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
        if (activeTab === "all") return [...eventsData, ...recordingsData];
        if (activeTab === "events") return eventsData;
        if (activeTab === "recordings") return recordingsData;
        return [];
    }, [activeTab]);

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
                            <span className="font-medium text-primary">{t("edu.nav.edu" as any)}</span>
                        </nav>
                        <h2 className="text-3xl md:text-5xl font-extrabold font-display text-text-main dark:text-white leading-tight">
                            {t("edu.hub.title" as any)}
                        </h2>
                        <p className="text-text-muted dark:text-gray-300 text-lg">
                            {t("edu.hub.desc" as any)}
                        </p>
                    </div>
                    <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto flex-1">
                        {/* Tabs Navigation (Filtros) moved next to search */}
                        <div className="flex justify-start md:justify-end overflow-x-auto gap-3 py-2 no-scrollbar w-full">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm whitespace-nowrap ${activeTab === tab.id
                                        ? "bg-primary text-white scale-105 shadow-md border-transparent"
                                        : "bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm border border-accent/20 dark:border-gray-800 text-text-muted dark:text-white/70 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
                                        }`}
                                >
                                    <span className="material-icons-round text-[18px]">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
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
                        {/* VIEW 1 & 2: Events and Recordings (No Sidebar) */}
                        {(activeTab === "all" || activeTab === "events" || activeTab === "recordings") && (
                            <div className="flex-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredData.map((course, idx) => (
                                        <article key={idx} className="group flex flex-col bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-accent/20 dark:border-gray-800 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
                                            <div 
                                                className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                                                onClick={() => setSelectedCourse(course)}
                                            >
                                                <Image fill alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={course.img} />
                                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-text-main dark:text-white flex items-center gap-1.5 shadow-sm">
                                                    <span className={`material-icons-round ${course.badgeStyle} text-sm`}>{course.badgeIcon}</span>
                                                    {course.badge}
                                                </div>
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="bg-white/90 text-primary px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                        Ver detalles
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
                                                    <span className="text-secondary dark:text-gray-300">{course.category}</span>
                                                </div>
                                                <h3 
                                                    className="text-lg font-bold text-text-main dark:text-white leading-snug mb-2 group-hover:text-primary transition-colors cursor-pointer"
                                                    onClick={() => setSelectedCourse(course)}
                                                >
                                                    {course.title}
                                                </h3>
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
                                                        <Link href={course.route} className="bg-primary hover:bg-[#689153] text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md">
                                                            {activeTab === "recordings" ? t("edu.btn.buy" as any) : course.price} <span className="material-icons-round text-[18px]">arrow_forward</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* VIEW 3: List of Accredited Courses */}
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

                        {/* VIEW 4: Accreditation Info */}
                        {activeTab === "accreditation" && (
                            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-lg text-center">
                                <div className="w-20 h-20 bg-accent/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-icons-round text-4xl">history_edu</span>
                                </div>
                                <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">{t("edu.accreditation.title" as any)}</h2>
                                <p className="text-text-muted dark:text-gray-400 text-lg max-w-2xl mx-auto mb-10">{t("edu.accreditation.desc" as any)}</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    <div className="p-6 bg-white dark:bg-surface-light border border-accent/20 dark:border-gray-700 rounded-2xl">
                                        <div className="text-3xl font-extrabold text-primary/20 mb-2">1</div>
                                        <h4 className="font-bold text-text-main dark:text-white">{t("edu.accreditation.step1" as any)}</h4>
                                    </div>
                                    <div className="p-6 bg-white dark:bg-surface-light border border-accent/20 dark:border-gray-700 rounded-2xl">
                                        <div className="text-3xl font-extrabold text-primary/20 mb-2">2</div>
                                        <h4 className="font-bold text-text-main dark:text-white">{t("edu.accreditation.step2" as any)}</h4>
                                    </div>
                                    <div className="p-6 bg-white dark:bg-surface-light border border-accent/20 dark:border-gray-700 rounded-2xl">
                                        <div className="text-3xl font-extrabold text-primary/20 mb-2">3</div>
                                        <h4 className="font-bold text-text-main dark:text-white">{t("edu.accreditation.step3" as any)}</h4>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <a href="https://esp.aibapt.org/38373/files/661d901c020ec_1713213468_esp-manual-normas-y-certificaci-n-acreditac-on-cursos-avanzados-2024.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#689153] transition-colors shadow-md">
                                        <span className="material-icons-round">picture_as_pdf</span>
                                        {t("edu.accreditation.btn.pdf" as any)}
                                    </a>
                                    <a href="mailto:certificacion@aibapt.org" className="inline-flex justify-center items-center gap-2 px-8 py-3 bg-white dark:bg-surface-light text-primary border border-primary/20 font-bold rounded-xl hover:bg-primary/5 transition-colors">
                                        <span className="material-icons-round">email</span>
                                        {t("edu.accreditation.btn.committee" as any)}
                                    </a>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* QUICK VIEW MODAL */}
            <AnimatePresence>
                {selectedCourse && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCourse(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] cursor-pointer"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[90vh] bg-white dark:bg-surface-dark rounded-[32px] overflow-hidden shadow-2xl z-[101] flex flex-col md:flex-row"
                        >
                            <div className="md:w-5/12 relative h-64 md:h-auto bg-[#f0f2f0] dark:bg-gray-900 flex items-center justify-center">
                                <Image fill src={selectedCourse.img} alt={selectedCourse.title} className="object-contain" />
                                <div className="absolute top-6 left-6 bg-white/95 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <span className={`material-icons-round ${selectedCourse.badgeStyle}`}>{selectedCourse.badgeIcon}</span>
                                        {selectedCourse.badge}
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-7/12 p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col">
                                <button 
                                    onClick={() => setSelectedCourse(null)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors group"
                                >
                                    <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">close</span>
                                </button>
                                
                                <div className="space-y-6">
                                    <div>
                                        <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 block">{selectedCourse.category}</span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-secondary dark:text-white leading-tight">
                                            {selectedCourse.title}
                                        </h2>
                                    </div>

                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="text-text-main dark:text-white/80 leading-relaxed text-lg italic border-l-4 border-primary/20 pl-4 py-1">
                                            {selectedCourse.desc}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full border-2 border-primary/20 overflow-hidden relative shadow-inner">
                                            <Image fill src={selectedCourse.instructorImg} alt="Instructor" className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted dark:text-gray-400 font-medium uppercase tracking-wider">Instructor</p>
                                            <h4 className="font-bold text-secondary dark:text-white text-lg">{selectedCourse.instructorName}</h4>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                        <Link href={selectedCourse.route} className="flex-1 bg-primary hover:bg-[#689153] text-white font-bold py-4 px-8 rounded-2xl text-center shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                                            Inscribirse ahora
                                            <span className="material-icons-round">arrow_forward</span>
                                        </Link>
                                        <button 
                                            onClick={() => setSelectedCourse(null)}
                                            className="px-8 py-4 rounded-2xl font-bold text-text-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
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
