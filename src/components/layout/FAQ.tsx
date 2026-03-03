"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export const FAQ = () => {
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        { q: t("faq.q1"), a: t("faq.a1") },
        { q: t("faq.q2"), a: t("faq.a2") },
        { q: t("faq.q3"), a: t("faq.a3") },
        { q: t("faq.q4"), a: t("faq.a4") },
        { q: t("faq.q5"), a: t("faq.a5") },
        { q: t("faq.q6"), a: t("faq.a6") },
        { q: t("faq.q7"), a: t("faq.a7") },
        { q: t("faq.q8"), a: t("faq.a8") },
        { q: t("faq.q9"), a: t("faq.a9") },
    ];

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white dark:bg-surface-dark relative border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Encabezado */}
                <div className="mb-12 text-center">
                    <span className="text-primary dark:text-gold font-display italic text-xl mb-2 block">
                        {t("faq.badge")}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-secondary dark:text-white mb-6">
                        {t("faq.title")}
                    </h2>
                    <p className="text-text-main dark:text-white/80 text-lg max-w-2xl mx-auto">
                        {t("faq.desc")}
                    </p>
                </div>

                {/* Acordeón */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border ${activeIndex === index
                                ? "border-primary dark:border-gold shadow-md"
                                : "border-gray-200 dark:border-gray-700"
                                } rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-background-dark`}
                        >
                            <button
                                className="w-full px-6 py-5 text-left flex justify-between items-center bg-transparent"
                                onClick={() => toggleAccordion(index)}
                            >
                                <span className="font-bold text-lg text-secondary dark:text-white">
                                    {faq.q}
                                </span>
                                <span
                                    className={`material-icons-round text-primary dark:text-gold transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""
                                        }`}
                                >
                                    expand_more
                                </span>
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-5 text-text-muted dark:text-white/70 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

