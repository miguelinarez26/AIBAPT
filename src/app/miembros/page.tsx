"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "@/i18n/translations";
import { membersData, membersCategories, type Member } from "./membersData";

export default function MiembrosPage() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCat, setSelectedCat] = useState("Todas");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Dropdown state and references
    const [openDropdown, setOpenDropdown] = useState<"cert" | null>(null);
    const certRef = useRef<HTMLDivElement>(null);

    // Filter Logic
    const filteredMembers = membersData.filter(member => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCat === "Todas" || member.category === selectedCat;
        return matchesSearch && matchesCat;
    });

    // Handle clicks outside of dropdowns to close them
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown === "cert" && certRef.current && !certRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdown]);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pt-20">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Cabecera */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary dark:text-gold font-display italic text-xl mb-4 block">
                        {t("nav.membership" as any)}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary dark:text-white mb-6">
                        {t("members.title" as any)}
                    </h1>
                    <p className="text-text-main dark:text-white/80 text-lg">
                        {t("members.desc" as any)}
                    </p>
                </div>

                {/* Filtros de Búsqueda */}
                <div className="relative max-w-4xl mx-auto mb-16 z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 blur-2xl -z-10 rounded-full" />

                    <div className="flex flex-col md:flex-row items-center gap-2 p-2.5 rounded-3xl md:rounded-full bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(33,150,83,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all">

                        {/* Barra de Búsqueda Principal */}
                        <div className="flex items-center flex-1 w-full md:w-auto px-4 py-2">
                            <span className="material-icons-round text-primary dark:text-gray-400 mr-3">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder={t("members.search" as any)}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-text-main dark:text-white placeholder:text-text-muted/60 dark:placeholder:text-gray-400 text-[15px] font-medium"
                            />
                        </div>

                        {/* Separador Desktop */}
                        <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                        {/* Controles de Filtrado Integrados */}
                        <div className="flex items-center gap-2 w-full md:w-auto px-1 pb-1 md:pb-0 justify-between md:justify-end flex-wrap md:flex-nowrap">

                            {/* Filtro Categoría (Custom Dropdown) */}
                            <div className="relative flex-1 md:flex-none" ref={certRef}>
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "cert" ? null : "cert")}
                                    className="w-full md:w-[260px] pl-10 pr-8 py-2.5 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 border border-gray-100 dark:border-gray-700 rounded-2xl md:rounded-full text-sm font-bold text-secondary dark:text-white outline-none cursor-pointer transition-colors shadow-sm focus:ring-2 focus:ring-primary/20 flex items-center justify-between"
                                >
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons-round text-primary font-bold dark:text-gray-400 text-[18px]">
                                        category
                                    </span>
                                    <span className="truncate">
                                        {selectedCat === "Todas" ? `${t("members.filter.category" as any)} (Todas)` : t(`members.cat.${selectedCat}` as any)}
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
                                            className="absolute top-[calc(100%+8px)] right-0 w-full min-w-[280px] bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(33,150,83,0.12)] border border-gray-100 dark:border-gray-800 p-2 z-50 origin-top"
                                        >
                                            <div className="grid grid-cols-1 gap-1.5 max-h-[50vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(33,150,83,0.3) transparent' }}>
                                                <button
                                                    onClick={() => { setSelectedCat("Todas"); setOpenDropdown(null); }}
                                                    className={`w-full text-left px-4 py-2.5 text-[15px] leading-normal rounded-xl transition-colors ${selectedCat === "Todas" ? "bg-primary/10 text-primary font-bold" : "text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                                >
                                                    {t("members.filter.category" as any)} (Todas)
                                                </button>
                                                {membersCategories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => { setSelectedCat(cat); setOpenDropdown(null); }}
                                                        className={`w-full text-left px-4 py-2.5 text-[15px] leading-normal rounded-xl transition-colors ${selectedCat === cat ? "bg-primary/10 text-primary font-bold" : "text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                                    >
                                                        {t(`members.cat.${cat}` as Extract<keyof typeof translations.es, string>)}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Botón Limpiar Filtros */}
                            <AnimatePresence>
                                {(searchTerm || selectedCat !== "Todas") && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedCat("Todas");
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

                {/* Métricas + Toggle Vista */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-text-muted dark:text-gray-400 font-medium">
                        {t("members.label.showing" as any)} <strong className="text-secondary dark:text-white">{filteredMembers.length}</strong> {t("members.all_members" as any)}
                    </span>

                    {/* Toggle Grid / List */}
                    <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1 border border-gray-200 dark:border-gray-700/50">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-white dark:bg-surface-dark shadow-sm text-primary dark:text-gold" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                            title="Vista de Cuadrícula"
                        >
                            <span className="material-icons-round text-[20px]">grid_view</span>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "bg-white dark:bg-surface-dark shadow-sm text-primary dark:text-gold" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                            title="Vista de Lista"
                        >
                            <span className="material-icons-round text-[20px]">view_list</span>
                        </button>
                    </div>
                </div>

                {/* Resultados */}
                <div className={viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-3"
                }>
                    <AnimatePresence>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <motion.div
                                    key={member.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className={`bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 transition-all hover:-translate-y-0.5 flex items-center gap-4
                                        ${viewMode === "grid"
                                            ? "rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(33,150,83,0.08)]"
                                            : "rounded-2xl px-5 py-3.5 shadow-sm hover:shadow-md"
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            loading="lazy"
                                            className={`rounded-full object-cover border-2 border-primary/20 ${viewMode === "grid" ? "w-14 h-14" : "w-10 h-10"}`}
                                        />
                                    </div>

                                    <div className={`flex-1 min-w-0 ${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
                                        <h3 className={`font-bold text-secondary dark:text-white truncate ${viewMode === "grid" ? "text-lg" : "text-base flex-1"}`}>
                                            {member.name}
                                        </h3>
                                        <div className={`flex items-center gap-2 ${viewMode === "grid" ? "mt-1" : ""}`}>
                                            <span className="text-xs font-mono font-medium text-text-muted dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md whitespace-nowrap">
                                                ID: {member.code}
                                            </span>
                                        </div>
                                        <p className={`text-sm text-primary dark:text-gold font-medium line-clamp-1 ${viewMode === "grid" ? "mt-1.5" : ""}`}>
                                            {t(`members.cat.${member.category}` as Extract<keyof typeof translations.es, string>)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-20 text-center"
                            >
                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-icons-round text-5xl text-gray-300 dark:text-gray-600">
                                        search_off
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">{t("members.no_results" as any)}</h3>
                                <p className="text-text-muted dark:text-gray-400">{t("members.no_results_desc" as any)}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
