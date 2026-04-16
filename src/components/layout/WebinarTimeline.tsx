"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

import flyer1 from "../../../public/images/webinar_flyer_1.png";
import flyer2 from "../../../public/images/webinar_flyer_2.png";
import flyer3 from "../../../public/images/3.png";

export const WebinarTimeline = () => {
    const router = useRouter();
    const events = [
        {
            category: "Entrenamiento | Brasil",
            title: "Práctica Supervisada y Manejo Online",
            instructor: "Silvia Guz",
            date: "Marzo 2026",
            desc: "Curso vivencial con demostraciones en vivo y prácticas supervisionadas sobre manejo online.",
            imageUrl: flyer2,
        },
        {
            category: "Psicodrama | Presencial",
            title: "Introducción al Psicodrama",
            instructor: "Dra. Esly Carvalho",
            date: "Abril 2026",
            desc: "Jornada teórico-práctica y vivencial sobre técnicas y metodología del psicodrama.",
            imageUrl: flyer1,
        },
        {
            category: "Protocolos Corporais | Online",
            title: "Protocolos Corporales en EMDR",
            instructor: "Silvia Guz",
            date: "Mayo 2026",
            desc: "Teoría y protocolos corporales exclusivos desarrollados para la terapia EMDR.",
            imageUrl: flyer3,
        }
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
                        desarrollo profesional
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-secondary dark:text-white mb-6">
                        Próximos Eventos <span className="text-primary italic font-serif">2026</span>
                    </h2>
                    <p className="text-text-main dark:text-white/80 text-lg font-light">
                        Entrenamientos intensivos y certificaciones internacionales para psicoterapeutas bajo el estándar de AIBAPT.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col group h-full"
                        >
                            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col">
                                {/* Flyer Area */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-gray-900">
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                        <p className="text-white text-sm font-medium leading-relaxed">
                                            {event.desc}
                                        </p>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-primary dark:text-gold text-[10px] font-bold py-1.5 px-3 rounded-full shadow-sm uppercase tracking-wider">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 md:p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-secondary dark:text-white mb-4 group-hover:text-primary transition-colors duration-300 flex-1">
                                        {event.title}
                                    </h3>
                                    
                                    <div className="space-y-3 mb-6 pt-4 border-t border-gray-50 dark:border-white/5">
                                        <div className="flex items-center gap-2 text-text-muted dark:text-white/60">
                                            <FiUser className="text-primary/60 shrink-0" />
                                            <span className="text-sm font-medium">{event.instructor}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-text-muted dark:text-white/60">
                                            <FiCalendar className="text-primary/60 shrink-0" />
                                            <span className="text-sm font-bold text-secondary dark:text-gold">{event.date}</span>
                                        </div>
                                    </div>

                                    <Button 
                                        variant="primary" 
                                        size="sm" 
                                        className="w-full rounded-xl group/btn"
                                        onClick={() => router.push("/formaciones?tab=events")}
                                    >
                                        MÁS INFORMACIÓN
                                        <FiArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center flex justify-center">
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="rounded-full shadow-lg group px-10"
                        onClick={() => router.push("/formaciones?tab=events")}
                    >
                        Ver Todos los Próximos Eventos
                        <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </section>
    );
};
