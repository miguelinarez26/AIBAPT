"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { LangKeys } from "@/i18n/translations";
import { FunctionalStructure } from "@/components/layout/FunctionalStructure";

export default function QuienesSomosPage() {
    const { t } = useLanguage();

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

    return (
        <main className="min-h-screen bg-background-light pt-8 md:pt-12 pb-20 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] animation-delay-2000"></div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Intro Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-6 max-w-4xl mx-auto"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs mb-3 uppercase tracking-wider">
                        {t("about.intro.title")}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-text-light mb-4 leading-[1.1]">
                        La Asociación Iberoamericana de <span className="italic font-light text-primary">Psicotrauma</span>
                    </h1>
                    <p className="text-sm md:text-base text-text-dark leading-relaxed max-w-2xl mx-auto">
                        {t("about.intro.desc")}
                    </p>
                </motion.div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Mission & Vision Section (Cards) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
                >
                    {/* Mission */}
                    <motion.div variants={fadeInUp} className="relative h-full">
                        <div className="absolute inset-0 bg-primary/20 rounded-[32px] blur-xl -z-10 translate-y-4"></div>
                        <div className="bg-primary p-8 md:p-10 h-full rounded-[32px] flex flex-col cursor-default">
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-6 text-white shrink-0">
                                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>
                            </div>
                            <h2 className="text-[24px] font-serif text-white mb-3">
                                {t("about.mission.title")}
                            </h2>
                            <p className="text-white/90 leading-relaxed text-sm">
                                {t("about.mission.desc")}
                            </p>
                        </div>
                    </motion.div>

                    {/* Vision */}
                    <motion.div variants={fadeInUp} className="relative h-full">
                        <div className="absolute inset-0 bg-secondary/20 rounded-[32px] blur-xl -z-10 translate-y-4"></div>
                        <div className="bg-secondary p-8 md:p-10 h-full rounded-[32px] flex flex-col cursor-default">
                            <div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center mb-6 text-primary shrink-0">
                                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <h2 className="text-[24px] font-serif text-gray-900 mb-3">
                                {t("about.vision.title")}
                            </h2>
                            <p className="text-gray-800 leading-relaxed text-sm">
                                {t("about.vision.desc")}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Objectives Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="max-w-5xl mx-auto mb-24"
                >
                    <div className="text-center mb-16">
                        <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">Nuestros Pilares</p>
                        <h2 className="text-4xl md:text-[48px] font-serif text-text-light leading-[1.1]">
                            {t("about.goals.title")}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                            // Paleta rotativa para los pilares
                            const schemes = [
                                { bg: "hover:bg-primary", iconText: "group-hover:text-primary", text: "group-hover:text-white", border: "hover:border-primary", textDesc: "group-hover:text-white/90" },
                                { bg: "hover:bg-secondary", iconText: "group-hover:text-secondary", text: "group-hover:text-text-light", border: "hover:border-secondary", textDesc: "group-hover:text-text-dark" },
                                { bg: "hover:bg-accent", iconText: "group-hover:text-accent", text: "group-hover:text-white", border: "hover:border-accent", textDesc: "group-hover:text-white/90" },
                                { bg: "hover:bg-highlight", iconText: "group-hover:text-highlight", text: "group-hover:text-text-light", border: "hover:border-highlight", textDesc: "group-hover:text-text-dark" }
                            ];
                            const theme = schemes[(num - 1) % 4];

                            return (
                                <motion.div
                                    key={num}
                                    variants={fadeInUp}
                                    className={`group bg-gray-50 ${theme.bg} rounded-2xl p-6 border border-gray-100 transition-colors duration-500 flex items-start gap-5 shadow-sm hover:shadow-2xl cursor-default`}
                                >
                                    <div className={`flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary ${theme.iconText} font-bold text-lg transition-colors duration-500`}>
                                        {num}
                                    </div>
                                    <p className={`text-text-dark ${theme.textDesc} pt-3 leading-relaxed text-[15px] transition-colors duration-500`}>
                                        {t(`about.goals.${num}` as LangKeys)}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ESTRUCTURA FUNCIONAL */}
                <FunctionalStructure />

            </div>
        </main>
    );
}
