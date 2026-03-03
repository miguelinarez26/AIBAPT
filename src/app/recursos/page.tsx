"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Definimos la estructura de un documento (Card)
type ResourceDoc = {
    id: string;
    translationKey: string;
    category: "manuals" | "legal";
    size: string;
    icon: string;
    downloadUrl: string; // Fake placeholder URL
    colorTheme: "primary" | "secondary" | "orange" | "blue";
};

// Base de datos de recursos
const resourcesDB: ResourceDoc[] = [
    // --- MANUALS ---
    { id: "req-member", translationKey: "resources.doc.req_member", category: "manuals", size: "1.2 MB", icon: "badge", downloadUrl: "#", colorTheme: "primary" },
    { id: "req-emdr", translationKey: "resources.doc.req_emdr", category: "manuals", size: "3.5 MB", icon: "psychology", downloadUrl: "#", colorTheme: "secondary" },
    { id: "req-trauma", translationKey: "resources.doc.req_trauma", category: "manuals", size: "2.8 MB", icon: "local_hospital", downloadUrl: "#", colorTheme: "primary" },
    { id: "req-sup-emdr", translationKey: "resources.doc.req_sup_emdr", category: "manuals", size: "1.9 MB", icon: "supervisor_account", downloadUrl: "#", colorTheme: "secondary" },
    { id: "req-train-emdr", translationKey: "resources.doc.req_train_emdr", category: "manuals", size: "4.1 MB", icon: "co_present", downloadUrl: "#", colorTheme: "orange" },
    { id: "req-credits", translationKey: "resources.doc.req_credits", category: "manuals", size: "850 KB", icon: "verified", downloadUrl: "#", colorTheme: "blue" },
    { id: "req-events", translationKey: "resources.doc.req_events", category: "manuals", size: "1.1 MB", icon: "event_available", downloadUrl: "#", colorTheme: "blue" },

    // --- LEGAL & ORGANIZACIONAL ---
    { id: "legal-statutes", translationKey: "resources.doc.legal_statutes", category: "legal", size: "5.4 MB", icon: "gavel", downloadUrl: "#", colorTheme: "orange" },
    { id: "legal-rules", translationKey: "resources.doc.legal_rules", category: "legal", size: "2.3 MB", icon: "policy", downloadUrl: "#", colorTheme: "secondary" }
];

export default function ResourcesPage() {
    const { t, lang } = useLanguage();
    const [activeTab, setActiveTab] = useState<"all" | "manuals" | "legal">("all");

    // Lógica para filtrar documentos basados en el tab seleccionado
    const filteredDocs = resourcesDB.filter(doc => activeTab === "all" || doc.category === activeTab);

    // Mapeo de colores estéticos para las portadas de los manuales
    const colorThemes = {
        primary: "from-primary to-teal-800",
        secondary: "from-secondary to-blue-900",
        orange: "from-orange-500 to-red-700",
        blue: "from-blue-500 to-indigo-800"
    };

    return (
        <div className="min-h-screen bg-accent/20 dark:bg-background-dark font-sans flex flex-col">
            <Header />

            {/* Header / Hero Section */}
            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-[1280px] mx-auto px-6 mb-12">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
                            {t("footer.library")}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-display font-medium text-secondary dark:text-white tracking-tight leading-tight mb-4">
                            {t("resources.title")}
                        </h1>
                        <p className="text-text-muted text-lg md:text-xl">
                            {t("resources.desc")}
                        </p>
                    </motion.div>
                </div>

                {/* Filter Tabs */}
                <div className="max-w-[1280px] mx-auto px-6 mb-10">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'all' ? 'bg-secondary text-white shadow-md' : 'bg-white text-text-muted hover:bg-accent/50 border border-accent/50'}`}
                        >
                            {t("resources.all_docs")}
                        </button>
                        <button
                            onClick={() => setActiveTab("manuals")}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'manuals' ? 'bg-primary text-white shadow-md' : 'bg-white text-text-muted hover:bg-accent/50 border border-accent/50'}`}
                        >
                            <span className="material-icons-round text-[16px]">menu_book</span> {t("resources.category.manuals")}
                        </button>
                        <button
                            onClick={() => setActiveTab("legal")}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'legal' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-text-muted hover:bg-accent/50 border border-accent/50'}`}
                        >
                            <span className="material-icons-round text-[16px]">gavel</span> {t("resources.category.legal")}
                        </button>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="max-w-[1280px] mx-auto px-6">
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDocs.map((doc, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                key={doc.id}
                                className="group bg-white dark:bg-surface-dark border border-accent/50 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
                            >
                                {/* Editorial Cover Header */}
                                <div className={`h-40 relative bg-gradient-to-br ${colorThemes[doc.colorTheme]} p-6 flex flex-col justify-between overflow-hidden`}>
                                    <div className="absolute -bottom-8 -right-8 opacity-10 transform -rotate-12 transition-transform group-hover:rotate-0 duration-500">
                                        <span className="material-icons-round text-9xl text-white">{doc.icon}</span>
                                    </div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <span className="bg-black/20 backdrop-blur-md text-white border border-white/20 text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm">
                                            PDF
                                        </span>
                                        <span className="text-white/80 text-[10px] font-bold tracking-wider">AIBAPT</span>
                                    </div>
                                    <span className="material-icons-round text-3xl text-white drop-shadow-md relative z-10">{doc.icon}</span>
                                </div>

                                {/* Content Body */}
                                <div className="p-6 flex flex-col flex-1">
                                    <span className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">
                                        {doc.category === "manuals" ? t("resources.category.manuals") : t("resources.category.legal")}
                                    </span>
                                    <h3 className="text-lg font-bold font-display text-text-main dark:text-white leading-tight mb-4 group-hover:text-primary transition-colors">
                                        {t(doc.translationKey)}
                                    </h3>

                                    <div className="mt-auto space-y-3 pt-4 border-t border-accent/30 dark:border-gray-800">
                                        <div className="flex items-center justify-between text-xs text-text-muted font-medium">
                                            <span className="flex items-center gap-1"><span className="material-icons-round text-[16px]">file_download</span> {t("resources.doc.size")} {doc.size}</span>
                                        </div>
                                        <div className="pt-2">
                                            {/* Descarga Física */}
                                            <a href={doc.downloadUrl} download className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white text-sm font-bold rounded-xl hover:bg-[#689153] transition-colors shadow-sm shadow-primary/20">
                                                <span className="material-icons-round text-[18px]">download</span> {t("resources.btn.download")}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
