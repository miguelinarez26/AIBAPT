"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function ProfileContent() {
    const { lang } = useLanguage();
    const searchParams = useSearchParams();

    // Auth & Route State
    const role = searchParams.get("role") || "no-socio";
    const isSocio = role === "socio";
    const initialTab = searchParams.get("tab") === "cv" ? "cv" : "contact";
    const [activeTab, setActiveTab] = useState<"contact" | "cv">(initialTab);

    // Form Loading State Simulation
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock User Data based on role
    const user = isSocio
        ? {
            name: "Dr. Socio Activo",
            email: "contacto@drsocioactivo.com",
            phone: "+34 600 123 456",
            country: "España",
            city: "Barcelona",
            bio: "Especialista clínico en trauma complejo. Egresado de la Universidad de Barcelona con más de 15 años de experiencia aplicando terapia EMDR e intervenciones sistémicas.",
            specialties: "EMDR, Trauma Infantil, Terapia Sistémica",
            linkedin: "https://linkedin.com/in/drsocioactivo",
            membershipStatus: lang === 'es' ? "Activa" : "Ativa",
            expiryDate: "15 Oct 2025",
            roleTag: lang === 'es' ? "Socio Profesional" : "Sócio Profissional"
        }
        : null;

    // Handles the "Save Profile" action with a fake timeout
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="pt-20 min-h-screen bg-accent/10 dark:bg-background-dark font-sans relative">

            {/* Header / Hero */}
            <div className="bg-primary/5 pt-12 pb-16 px-6 border-b border-primary/10">
                <div className="max-w-[1024px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={`/dashboard?role=${role}`} className="hidden md:flex items-center justify-center w-12 h-12 bg-white/50 dark:bg-black/20 rounded-full hover:bg-white dark:hover:bg-black/40 transition-colors shadow-sm text-primary">
                            <span className="material-icons-round">arrow_back</span>
                        </Link>
                        <div>
                            <Link href={`/dashboard?role=${role}`} className="md:hidden flex items-center gap-1 text-sm font-bold text-primary mb-2">
                                <span className="material-icons-round text-[16px]">arrow_back</span> {lang === 'es' ? 'Volver al Dashboard' : 'Voltar ao Dashboard'}
                            </Link>
                            <h1 className="text-3xl lg:text-4xl font-display font-medium text-text-main dark:text-white tracking-tight mb-1">
                                {lang === 'es' ? 'Configuración de Perfil' : 'Configuração de Perfil'}
                            </h1>
                            <p className="text-text-muted text-sm max-w-lg">
                                {lang === 'es' ? 'Administra tu información de contacto y tu presencia en el directorio clínico global de AIBAPT.' : 'Administre suas informações de contato e sua presença no diretório clínico global da AIBAPT.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1024px] mx-auto px-4 md:px-6 py-10 relative z-20">

                {/* LOCKED STATE (NON-SOCIOS) */}
                {!isSocio && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-surface-dark border border-orange-500/20 p-10 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mb-6 border border-orange-200 dark:border-orange-500/20">
                            <span className="material-icons-round text-4xl">lock_person</span>
                        </div>
                        <h2 className="text-2xl font-bold font-display text-text-main dark:text-white justify-center mb-3">
                            {lang === 'es' ? 'Membresía Requerida' : 'Assinatura Necessária'}
                        </h2>
                        <p className="text-text-muted mb-8 leading-relaxed">
                            {lang === 'es'
                                ? 'Para crear y editar tu perfil profesional en el directorio público de AIBAPT, y acceder a los beneficios clínicos, necesitas renovar o activar tu membresía anual.'
                                : 'Para criar e editar o seu perfil profissional no diretório público da AIBAPT e acessar aos benefícios clínicos, você precisa renovar ou ativar a sua anuidade.'}
                        </p>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-orange-500/30">
                            {lang === 'es' ? 'Activar Membresía' : 'Ativar Assinatura'}
                        </button>
                    </motion.div>
                )}

                {/* UNLOCKED STATE (ACTIVE SOCIOS) */}
                {isSocio && user && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                        {/* Sidebar Navigation */}
                        <aside className="lg:sticky top-28 flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab("contact")}
                                className={`flex items-center gap-3 p-4 rounded-2xl transition-all text-left font-medium border ${activeTab === "contact"
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-white dark:bg-surface-dark border-transparent text-text-muted hover:border-accent hover:bg-white"
                                    }`}
                            >
                                <span className={`material-icons-round ${activeTab === 'contact' ? 'text-primary' : 'text-gray-400'}`}>manage_accounts</span>
                                {lang === 'es' ? 'Datos de Contacto' : 'Dados de Contato'}
                            </button>
                            <button
                                onClick={() => setActiveTab("cv")}
                                className={`flex items-center gap-3 p-4 rounded-2xl transition-all text-left font-medium border ${activeTab === "cv"
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-white dark:bg-surface-dark border-transparent text-text-muted hover:border-accent hover:bg-white"
                                    }`}
                            >
                                <span className={`material-icons-round ${activeTab === 'cv' ? 'text-primary' : 'text-gray-400'}`}>badge</span>
                                {lang === 'es' ? 'Perfil Profesional y C.V.' : 'Perfil Profissional e CV'}
                            </button>
                        </aside>

                        {/* Main Editor Forms */}
                        <div className="lg:col-span-3">
                            <form onSubmit={handleSave} className="bg-white dark:bg-surface-dark border border-accent/30 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">

                                {/* Form Top Indicator Status */}
                                <div className="bg-green-50 dark:bg-green-500/10 px-6 py-3 border-b border-green-100 dark:border-green-500/20 flex items-center gap-2">
                                    <span className="material-icons-round text-green-600 text-[18px]">verified_user</span>
                                    <span className="text-xs font-bold text-green-700 dark:text-green-500 uppercase tracking-widest">{user.membershipStatus} ({user.expiryDate})</span>
                                </div>

                                {/* CONTACT TAB */}
                                {activeTab === "contact" && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-6">
                                        <h3 className="text-xl font-bold font-display text-text-main dark:text-white mb-6 pb-4 border-b border-accent/30">
                                            {lang === 'es' ? 'Actualizar Información Básica' : 'Atualizar Informações Básicas'}
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white">{lang === 'es' ? 'Nombre Público' : 'Nome Público'}</label>
                                                <input type="text" defaultValue={user.name} className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white">{lang === 'es' ? 'Correo de la Cuenta (Sólo lectura)' : 'Email da Conta (Somente leitura)'}</label>
                                                <input type="email" readOnly defaultValue={user.email} className="w-full bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-muted cursor-not-allowed outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white">{lang === 'es' ? 'Teléfono / WhatsApp Profesional' : 'Telefone / WhatsApp Profissional'}</label>
                                                <input type="tel" defaultValue={user.phone} className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white">{lang === 'es' ? 'País de Residencia' : 'País de Residência'}</label>
                                                <input type="text" defaultValue={user.country} className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white">{lang === 'es' ? 'Ciudad y Dirección Profesional' : 'Cidade e Endereço Profissional'}</label>
                                                <input type="text" defaultValue={user.city} className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* CURRICULUM TAB */}
                                {activeTab === "cv" && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-6">

                                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-accent/30">
                                            <h3 className="text-xl font-bold font-display text-text-main dark:text-white">
                                                {lang === 'es' ? 'Perfil y Directorio (C.V)' : 'Perfil e Diretório (CV)'}
                                            </h3>

                                            {/* Visibility Toggle Switch */}
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-surface-light px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl">
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{lang === 'es' ? 'Directorio Público' : 'Diretório Público'}</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white">
                                                    {lang === 'es' ? 'Biografía y Presentación Clínica' : 'Biografia e Apresentação Clínica'}
                                                </label>
                                                <p className="text-xs text-text-muted mb-2">
                                                    {lang === 'es' ? 'Describe tu experiencia, certificaciones y enfoque psicoterapéutico. (Máx 500 caract.)' : 'Descreva a sua experiência, certificações e abordagem psicoterapêutica.'}
                                                </p>
                                                <textarea
                                                    defaultValue={user.bio}
                                                    rows={5}
                                                    className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white">
                                                    {lang === 'es' ? 'Especializaciones y Técnicas (Separadas por comas)' : 'Especializações e Técnicas (Separadas por vírgulas)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={user.specialties}
                                                    className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-main dark:text-white flex items-center gap-2">
                                                    <span className="material-icons-round text-primary/70 text-[18px]">link</span>
                                                    {lang === 'es' ? 'Enlace a LinkedIn o Sitio Web Profesional' : 'Link do LinkedIn ou Site Profissional'}
                                                </label>
                                                <input
                                                    type="url"
                                                    defaultValue={user.linkedin}
                                                    className="w-full bg-gray-50 dark:bg-surface-light border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 outline-none text-primary font-medium"
                                                />
                                            </div>

                                            {/* File Upload CV - New Section */}
                                            <div className="space-y-2 pt-4 border-t border-accent/20">
                                                <label className="text-sm font-bold text-text-main dark:text-white flex items-center gap-2">
                                                    <span className="material-icons-round text-primary/70 text-[18px]">upload_file</span>
                                                    {lang === 'es' ? 'Adjuntar Currículum (PDF)' : 'Anexar Currículo (PDF)'}
                                                </label>
                                                <p className="text-xs text-text-muted mb-2">
                                                    {lang === 'es' ? 'Sube tu CV para agilizar evaluaciones del comité. Máx 5MB.' : 'Envie seu currículo para agilizar as avaliações do comitê. Máx 5MB.'}
                                                </p>

                                                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-primary/40 px-6 py-6 transition-colors hover:bg-primary/5">
                                                    <div className="text-center">
                                                        <span className="material-icons-round text-4xl text-primary/40 mb-2">cloud_upload</span>
                                                        <div className="mt-2 flex items-center justify-center text-sm leading-6 text-text-muted">
                                                            <label
                                                                htmlFor="file-upload"
                                                                className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary transition-colors"
                                                            >
                                                                <span>{lang === 'es' ? 'Sube un archivo' : 'Carregar um arquivo'}</span>
                                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" />
                                                            </label>
                                                            <p className="pl-1">{lang === 'es' ? 'o arrastra y suelta aquí' : 'ou arraste e solte aqui'}</p>
                                                        </div>
                                                        <p className="text-xs leading-5 text-text-muted mt-1">PDF hasta 5MB</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Sticky Footer with Save Button */}
                                <div className="bg-gray-50 dark:bg-surface-light px-8 py-5 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-4 sticky bottom-0 items-center">

                                    <AnimatePresence>
                                        {showSuccess && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                className="text-green-600 font-bold text-sm flex items-center gap-1 absolute left-8"
                                            >
                                                <span className="material-icons-round text-[18px]">check_circle</span>
                                                {lang === 'es' ? 'Perfil Actualizado' : 'Perfil Atualizado'}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    <button type="button" className="font-bold text-text-muted hover:text-text-main transition-colors px-4 py-2 text-sm">
                                        {lang === 'es' ? 'Descartar Cambios' : 'Descartar Alterações'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className={`bg-primary hover:bg-[#689153] text-white font-bold px-8 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        {isSaving ? (
                                            <span className="material-icons-round text-[18px] animate-spin">loop</span>
                                        ) : (
                                            <span className="material-icons-round text-[18px]">save</span>
                                        )}
                                        {lang === 'es' ? 'Guardar Cambios' : 'Salvar Alterações'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-40 pr-8 text-center text-primary font-display text-2xl animate-pulse">Cargando módulos...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
