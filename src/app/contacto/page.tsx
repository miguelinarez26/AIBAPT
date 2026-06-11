"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { FormEvent, useState, useRef, useEffect } from "react";

export default function ContactoPage() {
    const { t, lang } = useLanguage();

    const fadeInUp: any = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    // Estados para el Custom Dropdown de Asunto
    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Lógica de envío simulada
        alert("Mensaje enviado con éxito");
    };

    return (
        <main className="min-h-screen bg-background-light pt-10 md:pt-12 pb-24 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] animation-delay-2000"></div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Hero Section (Anti False-Bottom Standard) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-10 max-w-4xl mx-auto"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs mb-3 uppercase tracking-wider">
                        {t("contact.nav.contact")}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-text-light mb-4 leading-[1.1]">
                        {t("contact.title")}
                    </h1>
                    <p className="text-sm md:text-base text-text-dark leading-relaxed max-w-2xl mx-auto">
                        {t("contact.desc")}
                    </p>
                </motion.div>

                {/* 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Left Column: Contact Cards */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="lg:col-span-5 flex flex-col gap-4"
                    >
                        {/* Info Card 1: Sede Central */}
                        <motion.div variants={fadeInUp} className="group flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 hover:bg-gray-50 transition-all duration-300">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-light mb-1">{t("contact.info.hq")}</h3>
                                <p className="text-sm text-text-dark leading-relaxed">
                                    Madrid, España.<br />
                                    <span className="text-xs italic">{lang === 'es' ? 'Atención principal en horario CET (Central European Time).' : 'Atendimento principal no horário CET (Central European Time).'}</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Info Card 2: Correo */}
                        <motion.div variants={fadeInUp} className="group flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-secondary/30 hover:bg-gray-50 transition-all duration-300">
                            <div className="w-12 h-12 bg-secondary/10 text-primary rounded-full flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-light mb-1">{t("contact.info.support")}</h3>
                                <p className="text-sm text-text-dark leading-relaxed">
                                    info@aibapt.org
                                </p>
                            </div>
                        </motion.div>

                        {/* Info Card 3: Teléfono */}
                        <motion.div variants={fadeInUp} className="group flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 hover:bg-gray-50 transition-all duration-300">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-light mb-1">{t("contact.info.admin")}</h3>
                                <p className="text-sm text-text-dark leading-relaxed">
                                    admin@aibapt.org<br/>
                                    <span className="text-xs italic mt-1 inline-block">{lang === 'es' ? 'Contacto directo: Daniel Oliveira / Erika' : 'Contato direto: Daniel Oliveira / Erika'}</span>
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="lg:col-span-7 relative"
                    >
                        <div className="absolute inset-0 bg-primary/5 rounded-[32px] blur-xl -z-10 translate-y-4"></div>
                        <div className="bg-secondary p-8 md:p-10 rounded-[32px] shadow-xl h-full relative overflow-hidden border border-white/10">
                            <h2 className="text-2xl font-serif text-text-light mb-8 relative z-10">
                                {t("contact.form.title")}
                            </h2>
                            
                            <motion.form 
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                                onSubmit={handleSubmit} 
                                className="flex flex-col gap-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={fadeInUp} className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-text-light pl-1">{t("contact.form.name")}</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-5 py-3 rounded-2xl bg-white/80 border-2 border-transparent focus:outline-none focus:border-white focus:ring-4 focus:ring-white/40 transition-all text-text-light placeholder:text-text-dark/40"
                                            placeholder="Ej. María Pérez"
                                        />
                                    </motion.div>
                                    <motion.div variants={fadeInUp} className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-text-light pl-1">{t("contact.form.email")}</label>
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full px-5 py-3 rounded-2xl bg-white/80 border-2 border-transparent focus:outline-none focus:border-white focus:ring-4 focus:ring-white/40 transition-all text-text-light placeholder:text-text-dark/40"
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </motion.div>
                                </div>

                                <motion.div variants={fadeInUp} className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-text-light pl-1">{t("contact.form.subject")}</label>
                                    
                                    {/* Custom Dropdown */}
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setOpenDropdown(!openDropdown)}
                                            className="w-full px-5 py-3 rounded-2xl bg-white/80 border-2 border-transparent focus:outline-none focus:border-white focus:ring-4 focus:ring-white/40 transition-all text-left flex items-center justify-between"
                                        >
                                            <span className={selectedSubject ? "text-text-light" : "text-text-dark/50"}>
                                                {selectedSubject 
                                                    ? (selectedSubject === "membresia" ? (lang === 'es' ? 'Dudas sobre Membresía' : 'Dúvidas sobre Associação') :
                                                       selectedSubject === "soporte" ? (lang === 'es' ? 'Soporte Técnico (Plataforma)' : 'Suporte Técnico (Plataforma)') :
                                                       selectedSubject === "eventos" ? (lang === 'es' ? 'Información de Eventos' : 'Informações sobre Eventos') :
                                                       (lang === 'es' ? 'Otro' : 'Outro')) 
                                                    : (lang === 'es' ? 'Selecciona un asunto...' : 'Selecione um assunto...')}
                                            </span>
                                            <span className={`material-icons-round text-text-dark/50 text-[20px] transition-transform duration-300 ${openDropdown ? "rotate-180" : ""}`}>
                                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                                            </span>
                                        </button>

                                        <AnimatePresence>
                                            {openDropdown && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(33,150,83,0.12)] border border-gray-100 p-2 z-50 origin-top"
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setSelectedSubject("membresia"); setOpenDropdown(false); }}
                                                            className={`px-4 py-2.5 text-left text-sm font-medium rounded-xl transition-colors ${selectedSubject === "membresia" ? "bg-primary/10 text-primary" : "text-text-dark hover:bg-gray-50 hover:text-text-light"}`}
                                                        >
                                                            {lang === 'es' ? 'Dudas sobre Membresía' : 'Dúvidas sobre Associação'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setSelectedSubject("soporte"); setOpenDropdown(false); }}
                                                            className={`px-4 py-2.5 text-left text-sm font-medium rounded-xl transition-colors ${selectedSubject === "soporte" ? "bg-primary/10 text-primary" : "text-text-dark hover:bg-gray-50 hover:text-text-light"}`}
                                                        >
                                                            {lang === 'es' ? 'Soporte Técnico (Plataforma)' : 'Suporte Técnico (Plataforma)'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setSelectedSubject("eventos"); setOpenDropdown(false); }}
                                                            className={`px-4 py-2.5 text-left text-sm font-medium rounded-xl transition-colors ${selectedSubject === "eventos" ? "bg-primary/10 text-primary" : "text-text-dark hover:bg-gray-50 hover:text-text-light"}`}
                                                        >
                                                            {lang === 'es' ? 'Información de Eventos' : 'Informações sobre Eventos'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setSelectedSubject("otro"); setOpenDropdown(false); }}
                                                            className={`px-4 py-2.5 text-left text-sm font-medium rounded-xl transition-colors ${selectedSubject === "otro" ? "bg-primary/10 text-primary" : "text-text-dark hover:bg-gray-50 hover:text-text-light"}`}
                                                        >
                                                            {lang === 'es' ? 'Otro' : 'Outro'}
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                <motion.div variants={fadeInUp} className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-text-light pl-1">{t("contact.form.msg")}</label>
                                    <textarea 
                                        required
                                        rows={5}
                                        className="w-full px-5 py-3 rounded-2xl bg-white/80 border-2 border-transparent focus:outline-none focus:border-white focus:ring-4 focus:ring-white/40 transition-all text-text-light placeholder:text-text-dark/40 resize-none"
                                        placeholder="Escribe tu mensaje detallado aquí..."
                                    ></textarea>
                                </motion.div>

                                <motion.div variants={fadeInUp} className="mt-4">
                                    <button 
                                        type="submit" 
                                        className="group/btn inline-flex items-center gap-3 bg-highlight text-text-light pl-6 pr-2 py-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-1 hover:brightness-110 shadow-md"
                                    >
                                        <span>{t("contact.form.send")}</span>
                                        <div className="w-9 h-9 bg-black/5 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-1">
                                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </div>
                                    </button>
                                </motion.div>
                            </motion.form>
                        </div>
                    </motion.div>
                </div>

            </div>
        </main>
    );
}
