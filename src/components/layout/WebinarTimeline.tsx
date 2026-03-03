"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";

export const WebinarTimeline = () => {
    const { t } = useLanguage();

    const events = [
        {
            date: t("webinars.event1.date"),
            title: t("webinars.event1.title"),
            speaker: t("webinars.event1.speaker"),
            dotColor: "bg-primary", // Verde principal
            iconColor: "text-primary dark:text-primary",
            shadow: "shadow-primary/30",
        },
        {
            date: t("webinars.event2.date"),
            title: t("webinars.event2.title"),
            speaker: t("webinars.event2.speaker"),
            dotColor: "bg-green-600 dark:bg-green-500", // Verde medio
            iconColor: "text-green-600 dark:text-green-500",
            shadow: "shadow-green-600/30",
        },
        {
            date: t("webinars.event3.date"),
            title: t("webinars.event3.title"),
            speaker: t("webinars.event3.speaker"),
            dotColor: "bg-green-300 dark:bg-green-300", // Verde pastel
            iconColor: "text-green-400 dark:text-green-400", // Un poco más oscuro para que resalte en blanco
            shadow: "shadow-green-300/30",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 80, damping: 15 } },
    };

    return (
        <section className="py-24 bg-white dark:bg-background-dark relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-primary dark:text-gold font-display italic text-xl mb-2 block">
                        {t("webinars.badge")}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-secondary dark:text-white mb-6">
                        {t("webinars.title")}
                    </h2>
                    <p className="text-text-main dark:text-white/80 text-lg">
                        {t("webinars.desc")}
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative"
                >
                    {/* Línea horizontal decorativa (Desktop) */}
                    <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent z-0" />

                    {/* Timeline Vertical (Mobile) - Línea */}
                    <div className="block md:hidden absolute top-0 bottom-0 left-[28px] w-[2px] bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
                        {events.map((event, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="relative flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-8 group"
                            >
                                {/* Punto conector animado */}
                                <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-background-dark shadow-md bg-white dark:bg-surface-dark shrink-0 z-10 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                                    <div className={`w-4 h-4 rounded-full ${event.dotColor} ${event.shadow} shadow-lg`} />
                                </div>

                                {/* Tarjeta */}
                                <div className="flex-1 w-full bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-soft hover:shadow-hover border border-gray-100 dark:border-gray-800 transition-all duration-300 transform group-hover:-translate-y-2">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`material-icons-round text-xl ${event.iconColor}`}>
                                            calendar_today
                                        </span>
                                        <span className="font-bold text-sm text-primary dark:text-gold tracking-wider uppercase">
                                            {event.date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary dark:text-white mb-3">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                            <span className="material-icons-round text-sm text-text-muted dark:text-gray-300">person</span>
                                        </div>
                                        <p className="text-sm font-medium text-text-muted dark:text-white/80">
                                            {event.speaker}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-20 text-center flex justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/formaciones"
                            className="inline-flex items-center gap-2 bg-transparent border-2 border-primary text-primary dark:text-gold dark:border-gold hover:bg-primary hover:text-white dark:hover:bg-gold dark:hover:text-secondary font-bold text-lg px-8 py-3.5 rounded-full transition-all"
                        >
                            {t("webinars.btn")}
                            <span className="material-icons-round text-sm">arrow_forward</span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
