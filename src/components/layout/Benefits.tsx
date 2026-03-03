"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export const Benefits = () => {
    const { t } = useLanguage();

    const cards = [
        {
            icon: "local_offer",
            title: t("benefits.card1.title"),
            desc: t("benefits.card1.desc"),
        },
        {
            icon: "library_books",
            title: t("benefits.card2.title"),
            desc: t("benefits.card2.desc"),
        },
        {
            icon: "groups",
            title: t("benefits.card3.title"),
            desc: t("benefits.card3.desc"),
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    return (
        <section className="py-24 bg-white dark:bg-background-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary dark:text-gold font-display italic text-xl mb-2 block">
                        {t("benefits.badge")}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-secondary dark:text-white mb-6">
                        {t("benefits.title")}
                    </h2>
                    <p className="text-text-main dark:text-white/80 text-lg">
                        {t("benefits.desc")}
                    </p>
                </div>

                <motion.div
                    className="grid md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -10 }}
                            className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="w-16 h-16 bg-accent/20 text-primary dark:text-gold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-icons-round text-3xl">{card.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-secondary dark:text-white mb-4">
                                {card.title}
                            </h3>
                            <p className="text-text-muted dark:text-white/70 leading-relaxed">
                                {card.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-20 flex justify-center">
                    <Link href="/afiliacion">
                        <button className="w-full rounded bg-primary px-9 py-4 text-xl text-white transition-colors hover:bg-primary/90 md:w-fit font-bold flex items-center justify-center gap-2">
                            {t("benefits.btn")} <FiArrowUpRight className="inline" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
