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
 const [viewMode, setViewMode] = useState<"grid" | "list">("list");
 const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 12;

 // Resetear a página 1 si cambian los filtros
 useEffect(() => {
     setCurrentPage(1);
 }, [searchTerm, selectedCountry, selectedCert]);

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

 const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
 const currentPartners = filteredPartners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 return (
 <>
 <div className="min-h-screen bg-background-light pt-10 md:pt-12 pb-20 overflow-hidden relative z-0">
 {/* Esferas de fondo (Glassmorphism) */}
 <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] animate-pulse -z-10" />
 <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] -z-10" style={{ animationDelay: '2s' }} />

 <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    {/* Cabecera */}
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-10 max-w-4xl mx-auto"
    >
        <div className="inline-block bg-primary/10 text-primary font-bold text-sm px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            {t("partners.nav.partners")}
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-text-light mb-4 leading-[1.1]">
            {t("partners.title")}
        </h1>
        <p className="text-sm md:text-base text-text-dark leading-relaxed max-w-2xl mx-auto">
            {t("partners.desc")}
        </p>
    </motion.div>

    {/* Filtros de Búsqueda - Variante 2 (Glassmorphism Expandible / Modern Clean Bar) */}
    <div className="relative max-w-5xl mx-auto mb-10 z-10">
 {/* Resplandor de fondo sutil */}
 <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 blur-2xl -z-10 rounded-full" />

 <div className="flex flex-col md:flex-row items-center gap-2 p-2.5 rounded-3xl md:rounded-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(33,150,83,0.08)] -[0_8px_30px_rgba(0,0,0,0.5)] transition-all">

 {/* Barra de Búsqueda Principal */}
 <div className="flex items-center flex-1 w-full md:w-auto px-4 py-2">
 <span className="material-icons-round text-primary mr-3">
 search
 </span>
 <input
 type="text"
 placeholder={t("partners.search")}
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-transparent border-none outline-none text-text-main placeholder:text-text-muted/60 :text-gray-400 text-[15px] font-medium"
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

 {/* Separador Desktop */}
 <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

 {/* Controles de Filtrado Integrados */}
 <div className="flex items-center gap-2 w-full md:w-auto px-1 pb-1 md:pb-0 justify-between md:justify-end flex-wrap md:flex-nowrap">

 {/* Filtro País (Custom Dropdown) */}
 <div className="relative flex-1 md:flex-none" ref={countryRef}>
 <button
 onClick={() => setOpenDropdown(openDropdown === "country" ? null : "country")}
 className="w-full md:w-44 pl-10 pr-8 py-2.5 bg-white/80 hover:bg-white :bg-black/50 border border-gray-100 rounded-2xl md:rounded-full text-sm font-bold text-primary outline-none cursor-pointer transition-colors shadow-sm focus:ring-2 focus:ring-primary/20 flex items-center justify-between"
 >
 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons-round text-primary font-bold text-[18px]">
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
 className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[220px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(33,150,83,0.12)] border border-gray-100 p-2 z-50 origin-top"
 >
 <div className="max-h-[50vh] overflow-y-auto flex flex-col gap-1 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(33,150,83,0.3) transparent' }}>
 <button
 onClick={() => { setSelectedCountry("Todos"); setOpenDropdown(null); }}
 className={`w-full text-left px-4 py-2.5 text-sm leading-normal rounded-xl transition-colors ${selectedCountry === "Todos" ? "bg-primary/10 text-primary font-bold" : "text-text-main hover:bg-gray-50 :bg-gray-800"}`}
 >
 {t("partners.filter.country")} (Todos)
 </button>
 {countriesList.map(country => (
 <button
 key={country}
 onClick={() => { setSelectedCountry(country); setOpenDropdown(null); }}
 className={`w-full text-left px-4 py-2.5 text-sm leading-normal rounded-xl transition-colors ${selectedCountry === country ? "bg-primary/10 text-primary font-bold" : "text-text-main hover:bg-gray-50 :bg-gray-800"}`}
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
 className="w-full md:w-[220px] pl-10 pr-8 py-2.5 bg-white/80 hover:bg-white :bg-black/50 border border-gray-100 rounded-2xl md:rounded-full text-sm font-bold text-primary outline-none cursor-pointer transition-colors shadow-sm focus:ring-2 focus:ring-primary/20 flex items-center justify-between"
 >
 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons-round text-primary font-bold text-[18px]">
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
 className="absolute md:right-0 top-[calc(100%+8px)] left-0 md:left-auto w-[calc(100vw-32px)] md:w-auto min-w-[260px] sm:min-w-[500px] max-w-[600px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_rgba(33,150,83,0.15)] -[0_20px_40px_rgba(0,0,0,0.5)] border border-gray-100 p-3 z-50 origin-top-right flex flex-col"
 >
 {/* Scrollable Indicator / Title */}
 <div className="flex items-center justify-between px-4 pb-2 mb-2 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
 <span>{t("news.sidebar.categories")}</span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[50vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(33,150,83,0.3) transparent' }}>
 <button
 onClick={() => { setSelectedCert("Todas"); setOpenDropdown(null); }}
 className={`w-full text-left px-4 py-2.5 text-[15px] leading-normal rounded-xl transition-colors ${selectedCert === "Todas" ? "bg-primary/10 text-primary font-bold" : "text-text-main hover:bg-gray-50 :bg-gray-800"}`}
 >
 {t("partners.filter.certification")} (Todas)
 </button>
 {certificationTypes.map(cert => (
 <button
 key={cert}
 onClick={() => { setSelectedCert(cert); setOpenDropdown(null); }}
 className={`w-full text-left px-4 py-2.5 text-[15px] leading-normal rounded-xl transition-colors ${selectedCert === cert ? "bg-primary/10 text-primary font-bold" : "text-text-main hover:bg-gray-50 :bg-gray-800"}`}
 >
 {t(`partners.cert.${cert}` as Extract<keyof typeof translations.es, string>)}
 </button>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 </div>

 {/* Controles de Vista y Resultados Reales */}
 <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 ">
 <span className="text-text-muted font-medium">
 {t("partners.label.showing")} <strong className="text-secondary ">{filteredPartners.length}</strong> {t("partners.all_specialists")}
 </span>

 {/* Toggle: List vs Grid */}
 <div className="hidden md:flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200 ">
 <button
 onClick={() => setViewMode("list")}
 className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary " : "text-gray-400 hover:text-gray-600 :text-gray-300"}`}
 title={t("partners.view.list")}
 >
 <span className="material-icons-round text-[20px]">view_list</span>
 </button>
 <button
 onClick={() => setViewMode("grid")}
 className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary " : "text-gray-400 hover:text-gray-600 :text-gray-300"}`}
 title={t("partners.view.grid")}
 >
 <span className="material-icons-round text-[20px]">grid_view</span>
 </button>
 </div>
 </div>

 {/* Resultados - Evaluando Vista */}
 <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
 <AnimatePresence>
 {currentPartners.length > 0 ? (
 currentPartners.map((partner) => (
 viewMode === "grid" ? (
 /* -----------------------------
 VISTA: TARJETAS (GRID) - Estilo Portada Premium
 ----------------------------- */
 <motion.div
 key={`grid-${partner.id}`}
 layout
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.2 }}
 className="group/card relative flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1 h-full cursor-pointer"
 onClick={() => setSelectedPartner(partner)}
 >
 {/* Cover Photo / Header */}
 <div className="relative h-28 bg-gradient-to-br from-primary via-[#6db366] to-secondary/80">
 {/* Decoración abstracta sutil en el cover */}
 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
 
 {/* Avatar Flotante */}
 <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 z-10">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={partner.avatar}
 alt={partner.name}
 loading="lazy"
 className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-500 group-hover/card:scale-105 bg-white"
 />
 </div>
 </div>

 {/* Body */}
 <div className="flex flex-col flex-1 px-6 pt-16 pb-6 text-center">
 <h3 className="font-bold text-xl text-text-light mb-1 line-clamp-2">
 {partner.name}
 </h3>
 <p className="text-sm text-text-dark flex items-center justify-center gap-1 mb-6">
 <span className="material-icons-round text-[16px] text-primary">location_on</span>
 {partner.city}, {partner.country}
 </p>

 {/* Etiquetas de Certificación */}
 <div className="mb-6 flex-1 flex flex-col justify-center">
 <div className="flex flex-wrap justify-center gap-1.5">
 {partner.certifications.map((cert) => (
 <span
 key={cert}
 className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-gray-50 text-text-dark border border-gray-100 whitespace-nowrap h-fit group-hover/card:bg-secondary/15 group-hover/card:text-primary group-hover/card:border-secondary/40 transition-colors duration-300"
 >
 {t(`partners.cert.${cert}` as Extract<keyof typeof translations.es, string>)}
 </span>
 ))}
 </div>
 </div>

 {/* Footer Tarjeta */}
 <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
    <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1 opacity-80">
        <span className="material-icons-round text-[14px]">workspace_premium</span>
        AIBAPT
    </span>
    <div className="group/btn flex items-center gap-3 border-2 border-accent text-accent bg-transparent pl-5 pr-1.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:bg-accent hover:text-white hover:-translate-y-1 hover:shadow-md w-full sm:w-auto justify-between sm:justify-center">
        <span>{t("partners.card.view_profile")}</span>
        <div className="w-7 h-7 bg-accent/10 group-hover/btn:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:translate-x-0.5">
            <span className="material-icons-round text-[14px]">arrow_forward</span>
        </div>
    </div>
 </div>
 </div>
 </motion.div>
 ) : (
 /* -----------------------------
 VISTA: LISTA COMPACTA (TABLE-LIKE) - Estilo Portada Premium
 ----------------------------- */
 <motion.div
 key={`list-${partner.id}`}
 layout
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 10 }}
 transition={{ duration: 0.2 }}
 className="group/card flex flex-col md:flex-row md:items-center bg-white rounded-3xl p-4 md:p-5 border border-gray-100 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 gap-4 md:gap-6 hover:-translate-y-0.5 cursor-pointer"
 onClick={() => setSelectedPartner(partner)}
 >
 <div className="flex items-center gap-4 min-w-[300px]">
 <div className="relative flex-none">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={partner.avatar}
 alt={partner.name}
 loading="lazy"
 className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md transition-transform duration-500 group-hover/card:scale-105"
 />
 </div>
 <div>
 <h3 className="font-bold text-lg text-text-light group-hover/card:text-primary/70 transition-colors duration-300">
 {partner.name}
 </h3>
 <p className="text-sm text-text-dark flex items-center gap-1">
 <span className="material-icons-round text-[14px] text-primary">location_on</span>
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
 className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-secondary/20 border border-secondary/30 text-text-light whitespace-nowrap"
 >
 {t(`partners.cert.${cert}` as Extract<keyof typeof translations.es, string>)}
 </span>
 ))}
 </div>
 </div>

 {/* Row Actions */}
 <div className="flex items-center justify-end mt-2 md:mt-0 border-t border-gray-100 md:border-none pt-4 md:pt-0">
    <div className="group/btn flex items-center gap-3 bg-accent text-white pl-5 pr-1.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm hover:bg-primary hover:-translate-y-1 hover:shadow-md w-full sm:w-auto justify-between sm:justify-center">
        <span>{t("partners.card.view_profile")}</span>
        <div className="w-7 h-7 bg-white/20 group-hover/btn:bg-white/30 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-0.5">
            <span className="material-icons-round text-[14px]">arrow_forward</span>
        </div>
    </div>
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
 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
 <span className="material-icons-round text-4xl">search_off</span>
 </div>
 <h3 className="text-2xl font-bold text-secondary mb-2">
 {t("partners.no_results")}
 </h3>
 <p className="text-text-muted ">
 {t("partners.no_results_desc")}
 </p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Paginación */}
 {totalPages > 1 && (
 <div className="mt-16 flex justify-center items-center gap-2">
 <button
 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
 disabled={currentPage === 1}
 className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-primary disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-all"
 >
 <span className="material-icons-round">chevron_left</span>
 </button>
 
 <div className="flex gap-2">
 {Array.from({ length: totalPages }, (_, i) => i + 1).filter(page => {
 return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
 }).map((page, index, array) => (
 <React.Fragment key={page}>
 {index > 0 && page - array[index - 1] > 1 && (
 <span className="w-8 flex items-center justify-center text-gray-400">...</span>
 )}
 <button
 onClick={() => setCurrentPage(page)}
 className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-sm transition-all ${
 currentPage === page 
 ? 'bg-primary text-white shadow-md scale-105' 
 : 'bg-white shadow-sm border border-gray-100 text-text-dark hover:bg-gray-50 hover:text-primary'
 }`}
 >
 {page}
 </button>
 </React.Fragment>
 ))}
 </div>

 <button
 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
 disabled={currentPage === totalPages}
 className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-primary disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-all"
 >
 <span className="material-icons-round">chevron_right</span>
 </button>
 </div>
 )}
 </main>
 </div>

 {/* Modal Perfil Especialista */}
 <AnimatePresence>
 {selectedPartner && (
 <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden">
 {/* Overlay backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setSelectedPartner(null)}
 className="fixed inset-0 bg-black/40 backdrop-blur-sm"
 />

 {/* Contenedor de centrado seguro */}
 <div className="flex min-h-full items-center justify-center p-4 sm:p-6 pointer-events-none">
 {/* Modal Box */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 transition={{ type: "spring", damping: 25, stiffness: 300 }}
 className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
 style={{ maxHeight: 'calc(100dvh - 3rem)' }}
 >
 {/* Header Gradient */}
 <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent pointer-events-none" />

 {/* Close Button */}
 <button
 onClick={() => setSelectedPartner(null)}
 className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md hover:bg-gray-100 rounded-full text-text-dark transition-colors shadow-sm"
 >
 <span className="material-icons-round">close</span>
 </button>

 {/* FIXED HEADER */}
 <div className="px-8 sm:px-12 pt-12 pb-8 relative z-10 shrink-0 bg-white/50 backdrop-blur-sm border-b border-gray-100/60">
 <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
 <div className="relative shrink-0">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={selectedPartner.avatar}
 alt={selectedPartner.name}
 className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white"
 />
 </div>
 <div className="pr-10 sm:pr-0"> {/* Padding right to prevent overlapping with close button on small screens */}
 <h2 className="text-3xl md:text-4xl font-serif text-text-light mb-3 leading-tight">
 {selectedPartner.name}
 </h2>
 <p className="text-primary font-bold flex items-center gap-1.5 mb-2 text-sm uppercase tracking-wider">
 <span className="material-icons-round text-[18px]">workspace_premium</span>
 {t("partners.modal.certified_member")}
 </p>
 <p className="text-text-dark flex items-center gap-1.5">
 <span className="material-icons-round text-[18px]">location_on</span>
 {selectedPartner.city}, {selectedPartner.country}
 </p>
 </div>
 </div>
 </div>

 {/* SCROLLABLE BODY */}
 <div className="px-8 sm:px-12 py-8 relative z-10 flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 <div className="space-y-8">
 {/* Reseña / Bio */}
 <section>
 <h3 className="text-xl font-bold text-text-light mb-4 flex items-center gap-2">
 {t("partners.modal.review")}
 </h3>
 <p className="text-text-dark leading-relaxed bg-gray-50 p-6 rounded-2xl">
 {selectedPartner.bio || t("partners.modal.review_empty")}
 </p>
 </section>

 {/* Certificaciones */}
 <section>
 <h3 className="text-xl font-bold text-text-light mb-4 flex items-center gap-2">
 {t("partners.modal.certs_active")}
 </h3>
 <div className="flex flex-wrap gap-2">
 {selectedPartner.certifications.map((cert) => (
 <span
 key={cert}
 className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold bg-secondary/20 text-text-light border border-secondary/30 whitespace-nowrap h-fit"
 >
 <span className="material-icons-round text-[16px] mr-2 text-primary">military_tech</span>
 {t(`partners.cert.${cert}` as Extract<keyof typeof translations.es, string>)}
 </span>
 ))}
 </div>
 </section>
 </div>
 </div>

 {/* Modal Footer / Actions */}
 <div className="px-8 sm:px-12 py-6 bg-gray-50 flex justify-end gap-4 border-t border-gray-100">
 <button
 onClick={() => setSelectedPartner(null)}
 className="px-6 py-2 bg-transparent hover:bg-gray-200 text-text-dark font-bold rounded-full transition-colors"
 >
 {t("partners.modal.close")}
 </button>
 <button
 onClick={() => window.location.href = `mailto:${selectedPartner.email}`}
 className="group/btn flex items-center gap-3 bg-primary text-white pl-6 pr-2 py-2 rounded-full font-medium transition-all duration-300 hover:bg-secondary hover:-translate-y-1 shadow-md"
 >
 <span className="whitespace-nowrap">{t("partners.modal.contact_btn")}</span>
 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
 <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
 </svg>
 </div>
 </button>
 </div>
 </motion.div>
 </div>
 </div>
 )}
 </AnimatePresence>
 </>
 );
}
