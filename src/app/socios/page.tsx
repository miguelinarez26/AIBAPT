"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "@/i18n/translations";
import { useRef, useEffect } from "react";
import { mockPartners, countriesList, type Partner } from "./partnersData";

// Los datos de los socios y países se importan de partnersData.ts

// Lista de certificaciones disponibles basada en tu requerimiento
const certificationTypes = [
    "emdr_therapist",
    "emdr_supervisor",
    "emdr_trainer",
    "brainspotting_trained",
    "brainspotting_certified",
    "brainspotting_consultant",
    "brainspotting_trainer",
    "psychodrama_trainer",
    "other"
];



export default function SociosPage() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("Todos");
    const [selectedCert, setSelectedCert] = useState("Todas");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    // Dropdown state and references
    const [openDropdown, setOpenDropdown] = useState<"country" | "cert" | null>(null);
    const countryRef = useRef<HTMLDivElement>(null);
    const certRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside of dropdowns to close them
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown === "country" && countryRef.current && !countryRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
            if (openDropdown === "cert" && certRef.current && !certRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdown]);

    // Filtrado de la data
    const filteredPartners = mockPartners.filter(partner => {
        const matchesSearch =
            partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.city.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCountry = selectedCountry === "Todos" || partner.country === selectedCountry;

        const matchesCert = selectedCert === "Todas" || partner.certifications.includes(selectedCert);

        return matchesSearch && matchesCountry && matchesCert;
    });

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pt-20">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Cabecera */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary dark:text-gold font-display italic text-xl mb-4 block">
                        {t("partners.nav.partners")}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary dark:text-white mb-6">
                        {t("partners.title")}
                    </h1>
                    <p className="text-text-main dark:text-white/80 text-lg">
                        {t("partners.desc")}
                    </p>
                </div>

                {/* Filtros de Búsqueda - Variante 2 (Glassmorphism Expandible / Modern Clean Bar) */}
                <div className="relative max-w-5xl mx-auto mb-16 z-10">
                    {/* Resplandor de fondo sutil */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 blur-2xl -z-10 rounded-full" />

                    <div className="flex flex-col md:flex-row items-center gap-2 p-2.5 rounded-3xl md:rounded-full bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(33,150,83,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all">

                        {/* Barra de Búsqueda Principal */}
                        <div className="flex items-center flex-1 w-full md:w-auto px-4 py-2">
                            <span className="material-icons-round text-primary dark:text-gray-400 mr-3">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder={t("partners.search")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-text-main dark:text-white placeholder:text-text-muted/60 dark:placeholder:text-gray-400 text-[15px] font-medium"
                            />
                        </div>

                        {/* Separador Desktop */}
                        <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                        {/* Controles de Filtrado Integrados */}
                        <div className="flex items-center gap-2 w-full md:w-auto px-1 pb-1 md:pb-0 justify-between md:justify-end flex-wrap md:flex-nowrap">

                            {/* Filtro País (Custom Dropdown) */}
                            <div className="relative flex-1 md:flex-none" ref={countryRef}>
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "country" ? null : "country")}
                                    className="w-full md:w-44 pl-10 pr-8 py-2.5 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 border border-gray-100 dark:border-gray-700 rounded-2xl md:rounded-full text-sm font-bold text-secondary dark:text-white outline-none cursor-pointer transition-colors shadow-sm focus:ring-2 focus:ring-primary/20 flex items-center justify-between"
                                >
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons-round text-primary font-bold dark:text-gray-400 text-[18px]">
                                        public
                                    </span>
                                    <span className="truncate">
                                        {selectedCountry === "Todos" ? `${t("partners.filter.country")} (Todos)` : selectedCountry}
                                    </span>
                                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-400 text-[16px] transition-transform duration-300 ${openDropdown === "country" ? "rotate-180" : ""}`}>
                                        expand_more
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {openDropdown === "country" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[220px] bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(33,150,83,0.12)] border border-gray-100 dark:border-gray-800 p-2 z-50 origin-top"
                                        >
                                            <div className="max-h-[50vh] overflow-y-auto flex flex-col gap-1 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(33,150,83,0.3) transparent' }}>
                                                <button
                                                    onClick={() => { setSelectedCountry("Todos"); setOpenDropdown(null); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm leading-normal rounded-xl transition-colors ${selectedCountry === "Todos" ? "bg-primary/10 text-primary font-bold" : "text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                                >
                                                    {t("partners.filter.country")} (Todos)
                                                </button>
                                                {countriesList.map(country => (
                                                    <button
                                                        key={country}
                                                        onClick={() => { setSelectedCountry(country); setOpenDropdown(null); }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm leading-normal rounded-xl transition-colors ${selectedCountry === country ? "bg-primary/10 text-primary font-bold" : "text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                                    >
                                                        {country}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Filtro Certificación (Custom Dropdown) */}
                            <div className="relative flex-1 md:flex-none" ref={certRef}>
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "cert" ? null : "cert")}
                                    className="w-full md:w-[220px] pl-10 pr-8 py-2.5 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 border border-gray-100 dark:border-gray-700 rounded-2xl md:rounded-full text-sm font-bold text-secondary dark:text-white outline-none cursor-pointer transition-colors shadow-sm focus:ring-2 focus:ring-primary/20 flex items-center justify-between"
                                >
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons-round text-primary font-bold dark:text-gray-400 text-[18px]">
                                        verified
                                    </span>
                                    <span className="truncate">
                                        {selectedCert === "Todas" ? `${t("partners.filter.certification")} (Todas)` : t(`partners.cert.${selectedCert}` as any)}
                                    </span>
                                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-400 text-[16px] transition-transform duration-300 ${openDropdown === "cert" ? "rotate-180" : ""}`}>
                                        expand_more
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {openDropdown === "cert" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute md:right-0 top-[calc(100%+8px)] left-0 md:left-auto w-[calc(100vw-32px)] md:w-auto min-w-[260px] sm:min-w-[500px] max-w-[600px] bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_rgba(33,150,83,0.15)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-800 p-3 z-50 origin-top-right flex flex-col"
                                        >
                                            {/* Scrollable Indicator / Title */}
                                            <div className="flex items-center justify-between px-4 pb-2 mb-2 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                                <span>{t("news.sidebar.categories")}</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[50vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(33,150,83,0.3) transparent' }}>
                                                <button
                                                    onClick={() => { setSelectedCert("Todas"); setOpenDropdown(null); }}
                                                    className={`w-full text-left px-4 py-2.5 text-[15px] leading-normal rounded-xl transition-colors ${selectedCert === "Todas" ? "bg-primary/10 text-primary font-bold" : "text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                                >
                                                    {t("partners.filter.certification")} (Todas)
                                                </button>
                                                {certificationTypes.map(cert => (
                                                    <button
                                                        key={cert}
                                                        onClick={() => { setSelectedCert(cert); setOpenDropdown(null); }}
                                                        className={`w-full text-left px-4 py-2.5 text-[15px] leading-normal rounded-xl transition-colors ${selectedCert === cert ? "bg-primary/10 text-primary font-bold" : "text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                                    >
                                                        {t(`partners.cert.${cert}` as Extract<keyof typeof translations.es, string>)}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Botón Limpiar Filtros - Solo se muestra si hay algún filtro activo */}
                            <AnimatePresence>
                                {(searchTerm || selectedCountry !== "Todos" || selectedCert !== "Todas") && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedCountry("Todos");
                                            setSelectedCert("Todas");
                                        }}
                                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 dark:text-red-400 dark:hover:text-white rounded-2xl md:rounded-full transition-colors flex-shrink-0 origin-right"
                                        title="Limpiar filtros"
                                    >
                                        <span className="material-icons-round text-[20px]">close</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Controles de Vista y Resultados Reales */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-text-muted dark:text-gray-400 font-medium">
                        {t("partners.label.showing")} <strong className="text-secondary dark:text-white">{filteredPartners.length}</strong> {t("partners.all_specialists")}
                    </span>

                    {/* Toggle: List vs Grid */}
                    <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1 border border-gray-200 dark:border-gray-700/50">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-white dark:bg-surface-dark shadow-sm text-primary dark:text-gold" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                            title={t("partners.view.grid")}
                        >
                            <span className="material-icons-round text-[20px]">grid_view</span>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "bg-white dark:bg-surface-dark shadow-sm text-primary dark:text-gold" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                            title={t("partners.view.list")}
                        >
                            <span className="material-icons-round text-[20px]">view_list</span>
                        </button>
                    </div>
                </div>

                {/* Resultados - Evaluando Vista */}
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
                    <AnimatePresence>
                        {filteredPartners.length > 0 ? (
                            filteredPartners.map((partner) => (
                                viewMode === "grid" ? (
                                    /* -----------------------------
                                       VISTA: TARJETAS (GRID)
                                    ----------------------------- */
                                    <motion.div
                                        key={`grid-${partner.id}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-[0_8px_30px_rgba(33,150,83,0.06)] hover:shadow-[0_20px_40px_rgba(33,150,83,0.12)] border border-gray-100 dark:border-gray-800 transition-all hover:-translate-y-1 flex flex-col h-full"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={partner.avatar}
                                                    alt={partner.name}
                                                    loading="lazy"
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                                                />
                                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-surface-dark"></div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-secondary dark:text-white">
                                                    {partner.name}
                                                </h3>
                                                <p className="text-sm text-text-muted dark:text-gray-400 flex items-center gap-1">
                                                    <span className="material-icons-round text-[16px]">location_on</span>
                                                    {partner.city}, {partner.country}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Etiquetas de Certificación */}
                                        <div className="mb-6 flex-1">
                                            <div className="flex flex-wrap gap-2">
                                                {partner.certifications.map((cert) => (
                                                    <span
                                                        key={cert}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary dark:bg-primary/20 dark:text-gold"
                                                    >
                                                        <span className="material-icons-round text-[14px] mr-1.5 opacity-80">verified</span>
                                                        {t(`partners.cert.${cert}` as any)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Footer Tarjeta */}
                                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                                            <button
                                                onClick={() => setSelectedPartner(partner)}
                                                className="flex-1 bg-background-light dark:bg-background-dark hover:bg-primary hover:text-white dark:hover:bg-primary text-secondary dark:text-white font-bold py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors text-sm"
                                            >
                                                {t("partners.card.view_profile")}
                                            </button>
                                            <button className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-colors">
                                                <span className="material-icons-round text-[20px]">mail</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* -----------------------------
                                       VISTA: LISTA COMPACTA (TABLE-LIKE)
                                    ----------------------------- */
                                    <motion.div
                                        key={`list-${partner.id}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-white dark:bg-surface-dark rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
                                    >
                                        <div className="flex items-center gap-4 min-w-[300px]">
                                            <div className="relative flex-none">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={partner.avatar}
                                                    alt={partner.name}
                                                    loading="lazy"
                                                    className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                />
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-surface-dark"></div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-secondary dark:text-white">
                                                    {partner.name}
                                                </h3>
                                                <p className="text-sm text-text-muted dark:text-gray-400 flex items-center gap-1">
                                                    <span className="material-icons-round text-[14px]">location_on</span>
                                                    {partner.city}, {partner.country}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Certificaciones List */}
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {partner.certifications.map((cert) => (
                                                    <span
                                                        key={`${partner.id}-${cert}`}
                                                        className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-primary/5 border border-primary/10 text-primary dark:border-primary/20 dark:text-gold"
                                                    >
                                                        {t(`partners.cert.${cert}` as Extract<keyof typeof translations.es, string>)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Row Actions */}
                                        <div className="flex items-center gap-2 justify-end mt-2 md:mt-0 border-t border-gray-100 dark:border-gray-800 md:border-none pt-4 md:pt-0">
                                            <button
                                                onClick={() => setSelectedPartner(partner)}
                                                className="flex-1 md:flex-none px-6 py-2 bg-background-light dark:bg-background-dark hover:bg-primary hover:text-white dark:hover:bg-primary text-secondary dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-700 transition-colors text-sm whitespace-nowrap"
                                            >
                                                {t("partners.card.view_profile")}
                                            </button>
                                            <button className="w-10 h-10 flex-none flex items-center justify-center bg-gray-50 hover:bg-primary text-gray-400 hover:text-white dark:bg-gray-800/50 dark:hover:bg-primary rounded-xl transition-colors">
                                                <span className="material-icons-round text-[20px]">mail</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-20 text-center"
                            >
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                    <span className="material-icons-round text-4xl">search_off</span>
                                </div>
                                <h3 className="text-2xl font-bold text-secondary dark:text-white mb-2">
                                    {t("partners.no_results")}
                                </h3>
                                <p className="text-text-muted dark:text-gray-400">
                                    {t("partners.no_results_desc")}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Modal Perfil Especialista */}
            <AnimatePresence>
                {selectedPartner && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        {/* Overlay backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPartner(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Header Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent dark:from-primary/30 dark:via-transparent dark:to-transparent pointer-events-none" />

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedPartner(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur-md dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-300 transition-colors"
                            >
                                <span className="material-icons-round">close</span>
                            </button>

                            <div className="px-6 sm:px-10 pt-10 pb-6 relative z-10 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(33,150,83,0.3) transparent' }}>
                                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
                                    <div className="relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={selectedPartner.avatar}
                                            alt={selectedPartner.name}
                                            className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-surface-dark shadow-lg shadow-primary/20"
                                        />
                                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-primary rounded-full border-[3px] border-white dark:border-surface-dark"></div>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-secondary dark:text-white mb-2">
                                            {selectedPartner.name}
                                        </h2>
                                        <p className="text-primary dark:text-primary-light font-medium flex items-center gap-1.5 mb-2">
                                            <span className="material-icons-round text-[18px]">workspace_premium</span>
                                            {t("partners.modal.certified_member")}
                                        </p>
                                        <p className="text-text-muted dark:text-gray-400 flex items-center gap-1.5">
                                            <span className="material-icons-round text-[18px]">location_on</span>
                                            {selectedPartner.city}, {selectedPartner.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Reseña / Bio */}
                                    <section>
                                        <h3 className="text-lg font-bold text-secondary dark:text-white mb-3 flex items-center gap-2">
                                            <span className="material-icons-round text-primary text-[20px]">person</span>
                                            {t("partners.modal.review")}
                                        </h3>
                                        <p className="text-text-main dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                                            {selectedPartner.bio || t("partners.modal.review_empty")}
                                        </p>
                                    </section>

                                    {/* Certificaciones */}
                                    <section>
                                        <h3 className="text-lg font-bold text-secondary dark:text-white mb-3 flex items-center gap-2">
                                            <span className="material-icons-round text-primary text-[20px]">verified</span>
                                            {t("partners.modal.certs_active")}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPartner.certifications.map((cert) => (
                                                <span
                                                    key={cert}
                                                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-primary/10 text-primary dark:bg-primary/20 dark:text-gold border border-primary/10"
                                                >
                                                    <span className="material-icons-round text-[16px] mr-2">military_tech</span>
                                                    {t(`partners.cert.${cert}` as any)}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>

                            {/* Modal Footer / Actions */}
                            <div className="px-6 sm:px-10 py-5 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => window.location.href = `mailto:${selectedPartner.email}`}
                                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center gap-2"
                                >
                                    <span className="material-icons-round">mail</span>
                                    {t("partners.modal.contact_btn")}
                                </button>
                                <button
                                    onClick={() => setSelectedPartner(null)}
                                    className="px-6 py-3.5 bg-white dark:bg-surface-dark hover:bg-gray-100 dark:hover:bg-gray-800 text-secondary dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-center"
                                >
                                    {t("partners.modal.close")}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
