"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRightCircle } from "react-icons/fi";
import { LangKeys } from "@/i18n/translations";

import { Button } from "@/components/ui/Button";

export const WebinarTimeline = () => {
    const { t, lang } = useLanguage();

    const events = [
        {
            category: t("webinars.event1.category" as LangKeys),
            title: t("webinars.event1.title" as LangKeys),
            subtitle: t("webinars.event1.subtitle" as LangKeys),
            date: t("webinars.event1.date" as LangKeys),
            desc: t("webinars.event1.desc" as LangKeys),
            btnText: t("webinars.event1.btn" as LangKeys),
            imageUrl: "/images/webinar_flyer_2.png",
        },
        {
            category: t("webinars.event2.category" as LangKeys),
            title: t("webinars.event2.title" as LangKeys),
            subtitle: t("webinars.event2.subtitle" as LangKeys),
            date: t("webinars.event2.date" as LangKeys),
            desc: t("webinars.event2.desc" as LangKeys),
            btnText: t("webinars.event2.btn" as LangKeys),
            imageUrl: "/images/webinar_flyer_1.png",
        },
    ];

    return (
        <section className="py-24 bg-white dark:bg-background-dark relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="text-primary dark:text-gold font-display italic text-xl mb-2 block lowercase">
                        {t("webinars.badge")}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-secondary dark:text-white mb-6">
                        {t("webinars.title")}
                    </h2>
                    <p className="text-text-main dark:text-white/80 text-lg">
                        {t("webinars.desc")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-6">
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col md:flex-row items-center transform-gpu ring-1 ring-black/5">
                                {/* Flyer side - Full bleed to avoid margins */}
                                <div className="md:w-[260px] shrink-0 relative h-64 md:h-56 overflow-hidden bg-gray-100 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* Main Info - Stretched to fill space */}
                                <div className="flex-1 p-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">
                                    <div className="flex-1 space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-[10px] md:text-xs font-bold text-primary dark:text-gold uppercase tracking-[0.2em] opacity-60">
                                                {event.subtitle}
                                            </p>
                                            <h3 className="text-xl md:text-2xl font-bold text-secondary dark:text-white leading-tight group-hover:text-primary transition-colors duration-300">
                                                {event.title}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons-round text-primary/40 text-lg">calendar_today</span>
                                            <p className="text-base font-bold text-text-muted dark:text-gold opacity-90">
                                                {event.date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        <Link href={`/formaciones?tab=events&id=${index}`}>
                                            <Button variant="primary" className="uppercase tracking-wide">
                                                {event.btnText}
                                                <FiArrowRightCircle className="text-xl md:text-2xl" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center flex justify-center">
                    <Link href="/formaciones?tab=events">
                        <Button variant="outline" size="lg" className="rounded-full shadow-lg group">
                            {t("webinars.btn")}
                            <FiArrowRightCircle className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
