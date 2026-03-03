"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AfiliacionPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<"pleno" | "otros" | "cert" | "inst">("pleno");

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const tabs = [
        { id: "pleno", label: t("member.tab.pleno" as any), icon: "person" },
        { id: "otros", label: t("member.tab.otros" as any), icon: "favorite" },
        { id: "cert", label: t("member.tab.cert" as any), icon: "verified" },
        { id: "inst", label: t("member.tab.inst" as any), icon: "corporate_fare" },
    ];

    const steps = [
        { icon: "download", title: t("member.steps.1" as any), desc: t("member.steps.1.desc" as any) },
        { icon: "assignment_ind", title: t("member.steps.2" as any), desc: t("member.steps.2.desc" as any) },
        { icon: "credit_card", title: t("member.steps.3" as any), desc: t("member.steps.3.desc" as any) },
        { icon: "send", title: t("member.steps.4" as any), desc: t("member.steps.4.desc" as any) },
    ];

    return (
        <main className="min-h-screen bg-cream dark:bg-bg-dark pt-32 pb-20 overflow-hidden relative">
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[0%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[120px] animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp as any}
                    className="text-center mb-16 max-w-4xl mx-auto"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-bold text-sm mb-6 uppercase tracking-wider">
                        {t("member.badge" as any)}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-text-main dark:text-white mb-6 leading-tight font-display">
                        {t("member.title" as any)}
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted dark:text-white/80 leading-relaxed max-w-2xl mx-auto">
                        {t("member.desc" as any)}
                    </p>
                </motion.div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm ${activeTab === tab.id
                                ? "bg-primary text-white scale-105 shadow-md"
                                : "bg-white dark:bg-surface-dark text-text-muted dark:text-white/70 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
                                }`}
                        >
                            <span className="material-icons-round text-[20px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Container */}
                <div className="max-w-4xl mx-auto min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border border-accent/20 dark:border-gray-800 rounded-3xl p-8 shadow-lg"
                        >

                            {/* TAB: PLENO */}
                            {activeTab === "pleno" && (
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                            <span className="material-icons-round text-2xl">person</span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-text-main dark:text-white">{t("member.pleno.title" as any)}</h2>
                                            <p className="text-text-muted dark:text-gray-400">{t("member.pleno.desc" as any)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-accent/10 dark:bg-gray-800/50 p-6 rounded-2xl mb-8">
                                        <h3 className="font-bold text-text-main dark:text-white mb-4">{t("member.pleno.reqs" as any)}</h3>
                                        <ul className="space-y-3">
                                            {[1, 2, 3].map((num) => (
                                                <li key={num} className="flex items-start gap-3 text-text-muted dark:text-gray-300">
                                                    <span className="material-icons-round text-primary text-[20px] shrink-0 mt-0.5">check_circle</span>
                                                    <span>{t(`member.pleno.r${num}` as any)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-6 text-center">{t("member.steps.title" as any)}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                                        {steps.map((step, index) => (
                                            <div key={index} className="relative flex flex-col items-center text-center">
                                                {index < steps.length - 1 && (
                                                    <div className="hidden md:block absolute top-[24px] left-[50%] w-full h-[2px] bg-primary/20"></div>
                                                )}
                                                <div className="w-12 h-12 bg-white dark:bg-surface-light border-2 border-primary/20 text-primary rounded-full flex items-center justify-center relative z-10 mb-4 shadow-sm">
                                                    <span className="material-icons-round">{step.icon}</span>
                                                </div>
                                                <h4 className="font-bold text-text-main dark:text-white text-sm mb-2">{step.title}</h4>
                                                <p className="text-xs text-text-muted dark:text-gray-400">{step.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center">
                                        <a href="https://esp.aibapt.org/38373/files/6476042591791_1685455909_esp-hoja-de-inscripci-n-para-miembro-pleno-update.pdf" target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-surface-light border border-accent/30 dark:border-gray-700 text-text-main dark:text-white font-medium rounded-xl hover:border-primary transition-colors">
                                            <span className="material-icons-round text-primary">description</span>
                                            {t("member.btn.inscripcion" as any)}
                                        </a>
                                        <a href="https://esp.aibapt.org/38373/files/6476042b422f5_1685455915_esp-solicitud-de-ingreso-para-miembro-institucional-update.pdf" target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-surface-light border border-accent/30 dark:border-gray-700 text-text-main dark:text-white font-medium rounded-xl hover:border-primary transition-colors">
                                            <span className="material-icons-round text-primary">assignment</span>
                                            {t("member.btn.ingreso" as any)}
                                        </a>
                                        <a href="https://esp.aibapt.org/38373/files/64760424aaa5f_1685455908_esp-carta-de-recomendaci-n-para-miembro-pleno-update.pdf" target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-surface-light border border-accent/30 dark:border-gray-700 text-text-main dark:text-white font-medium rounded-xl hover:border-primary transition-colors">
                                            <span className="material-icons-round text-primary">thumb_up</span>
                                            {t("member.btn.recomendacion" as any)}
                                        </a>
                                    </div>

                                    <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
                                        <a href="https://paypal.me/aibapt" target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2 px-6 py-3 bg-[#003087] text-white font-bold rounded-xl hover:bg-[#00205B] transition-colors shadow-md">
                                            <span className="material-icons-round">payment</span>
                                            {t("member.btn.paypal" as any)} - {t("member.fee.pleno" as any)}
                                        </a>
                                        <a href="mailto:miembroses@aibapt.org" className="flex justify-center items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#689153] transition-colors shadow-md">
                                            <span className="material-icons-round">email</span>
                                            {t("member.btn.email" as any)}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* TAB: OTROS */}
                            {activeTab === "otros" && (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-icons-round text-4xl">favorite</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">{t("member.otros.title" as any)}</h2>
                                    <p className="text-text-muted dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">{t("member.otros.desc" as any)}</p>
                                    <a href="mailto:secretaria@aibapt.org" className="inline-flex justify-center items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#689153] transition-colors shadow-md">
                                        <span className="material-icons-round">email</span>
                                        {t("member.btn.email" as any)} (secretaria@aibapt.org)
                                    </a>
                                </div>
                            )}

                            {/* TAB: CERTIFICADOS */}
                            {activeTab === "cert" && (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-accent/20 text-text-main dark:text-white rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-icons-round text-4xl">verified</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">{t("member.cert.title" as any)}</h2>
                                    <p className="text-text-muted dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">{t("member.cert.desc" as any)}</p>
                                    <a href="mailto:certificacion@aibapt.org" className="inline-flex justify-center items-center gap-2 px-8 py-3 bg-text-main dark:bg-white text-white dark:text-bg-dark font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md">
                                        <span className="material-icons-round">school</span>
                                        {t("member.btn.email" as any)} (certificacion@aibapt.org)
                                    </a>
                                </div>
                            )}

                            {/* TAB: INSTITUCIONAL */}
                            {activeTab === "inst" && (
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                            <span className="material-icons-round text-2xl">corporate_fare</span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-text-main dark:text-white">{t("member.inst.title" as any)}</h2>
                                            <p className="text-text-muted dark:text-gray-400">{t("member.inst.desc" as any)}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-6 text-center">{t("member.steps.title" as any)}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                                        {steps.map((step, index) => (
                                            <div key={index} className="relative flex flex-col items-center text-center">
                                                {index < steps.length - 1 && (
                                                    <div className="hidden md:block absolute top-[24px] left-[50%] w-full h-[2px] bg-primary/20"></div>
                                                )}
                                                <div className="w-12 h-12 bg-white dark:bg-surface-light border-2 border-primary/20 text-primary rounded-full flex items-center justify-center relative z-10 mb-4 shadow-sm">
                                                    <span className="material-icons-round">{step.icon}</span>
                                                </div>
                                                <h4 className="font-bold text-text-main dark:text-white text-sm mb-2">{step.title}</h4>
                                                <p className="text-xs text-text-muted dark:text-gray-400">{step.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center">
                                        <a href="https://esp.aibapt.org/38373/files/6476042666b2c_1685455910_esp-hoja-de-inscripci-n-para-miembro-institucional-update.pdf" target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-surface-light border border-accent/30 dark:border-gray-700 text-text-main dark:text-white font-medium rounded-xl hover:border-primary transition-colors">
                                            <span className="material-icons-round text-primary">description</span>
                                            {t("member.btn.inscripcion" as any)}
                                        </a>
                                        <a href="https://esp.aibapt.org/38373/files/6476042b422f5_1685455915_esp-solicitud-de-ingreso-para-miembro-institucional-update.pdf" target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-surface-light border border-accent/30 dark:border-gray-700 text-text-main dark:text-white font-medium rounded-xl hover:border-primary transition-colors">
                                            <span className="material-icons-round text-primary">assignment</span>
                                            {t("member.btn.ingreso" as any)}
                                        </a>
                                        <a href="https://esp.aibapt.org/38373/files/64760423d6279_1685455907_esp-carta-de-recomendaci-n-para-miembro-institucional-update.pdf" target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-surface-light border border-accent/30 dark:border-gray-700 text-text-main dark:text-white font-medium rounded-xl hover:border-primary transition-colors">
                                            <span className="material-icons-round text-primary">thumb_up</span>
                                            {t("member.btn.recomendacion" as any)}
                                        </a>
                                    </div>

                                    <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
                                        <a href="https://paypal.me/aibapt" target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2 px-6 py-3 bg-[#003087] text-white font-bold rounded-xl hover:bg-[#00205B] transition-colors shadow-md">
                                            <span className="material-icons-round">payment</span>
                                            {t("member.btn.paypal" as any)} - {t("member.fee.inst" as any)}
                                        </a>
                                        <a href="mailto:miembroses@aibapt.org" className="flex justify-center items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#689153] transition-colors shadow-md">
                                            <span className="material-icons-round">email</span>
                                            {t("member.btn.email" as any)}
                                        </a>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </main>
    );
}
