"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { LangKeys } from "@/i18n/translations";

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
        <main className="min-h-screen bg-cream dark:bg-bg-dark pt-32 pb-20 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[120px] animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Intro Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-20 max-w-4xl mx-auto"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-bold text-sm mb-6 uppercase tracking-wider">
                        {t("about.intro.title")}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-main dark:text-white mb-8 leading-tight font-display">
                        La Asociación Iberoamericana de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Psicotrauma</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted dark:text-white/80 leading-relaxed">
                        {t("about.intro.desc")}
                    </p>
                </motion.div>

                {/* Mission & Vision Section (Cards) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
                >
                    {/* Mission */}
                    <motion.div variants={fadeInUp} className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10"></div>
                        <div className="glass-panel p-10 h-full border border-accent/20 dark:border-gray-700/50 rounded-3xl hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                <span className="material-icons-round text-3xl">flag</span>
                            </div>
                            <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">
                                {t("about.mission.title")}
                            </h2>
                            <p className="text-text-muted dark:text-gray-300 leading-relaxed text-lg">
                                {t("about.mission.desc")}
                            </p>
                        </div>
                    </motion.div>

                    {/* Vision */}
                    <motion.div variants={fadeInUp} className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-bl from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10"></div>
                        <div className="glass-panel p-10 h-full border border-accent/20 dark:border-gray-700/50 rounded-3xl hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-secondary/10 dark:bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                                <span className="material-icons-round text-3xl">public</span>
                            </div>
                            <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">
                                {t("about.vision.title")}
                            </h2>
                            <p className="text-text-muted dark:text-gray-300 leading-relaxed text-lg">
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
                    className="max-w-5xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white">
                            {t("about.goals.title")}
                        </h2>
                        <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 select-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <motion.div
                                key={num}
                                variants={fadeInUp}
                                className="group bg-white/50 dark:bg-surface-dark/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 dark:border-gray-800 hover:border-primary/40 dark:hover:border-primary/40 transition-colors duration-300 flex items-start gap-4 shadow-sm hover:shadow-md cursor-default"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 dark:bg-surface-light rounded-full flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                                    {num}
                                </div>
                                <p className="text-text-main dark:text-gray-300 pt-1.5 leading-relaxed text-[15px] sm:text-base">
                                    {t(`about.goals.${num}` as LangKeys)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
