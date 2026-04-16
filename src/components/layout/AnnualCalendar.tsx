"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiCalendar, FiMapPin, FiUser, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

const events = [
    { id: 1, month: "Marzo", day: "12", speaker: "Susana Diaz", country: "España", title: "Abusos Sexuales en la Infancia: Secuelas y recuperación con Brainspotting y otros recursos", link: "/registro/webinar-1" },
    { id: 2, month: "Abril", day: "16", speaker: "Daniel Gabarra", country: "Brasil", title: "A Arte do Suporte em Psicoterapia: Presença, regulação e recursos clínicos avançados", link: "/registro/webinar-2" },
    { id: 3, month: "Mayo", day: "21", speaker: "Sebastián Segui", country: "Argentina", title: "Hipnosis y Brainspotting: Sinergia neurobiológica para el abordaje del TEPT y la integración del Trauma", link: "/registro/webinar-3" },
    { id: 4, month: "Junio", day: "18", speaker: "Renata Teles", country: "Portugal", title: "¿Intervenção em Crise, Burnout e Stress, como consequencias ao Trauma?", link: "/registro/webinar-4" },
    { id: 5, month: "Julio", day: "16", speaker: "Norma Contreras", country: "Mexico", title: "Herramientas creativas y Brainspotting", link: "/registro/webinar-5" },
    { id: 6, month: "Agosto", day: "20", speaker: "Sandra Fiore", country: "Brasil", title: "TBA - Por anunciar", link: "/registro/webinar-6" },
    { id: 7, month: "Septiembre", day: "17", speaker: "Juan Alexis", country: "Chile", title: "Trauma, cuerpo y brainspotting", link: "/registro/webinar-7" },
    { id: 8, month: "Octubre", day: "15", speaker: "Angela Maranho", country: "Brasil", title: "Do útero materno à relação terapêutica: A jornada da conexão", link: "/registro/webinar-8" },
    { id: 9, month: "Noviembre", day: "19", speaker: "Parcuve Mex", country: "Mexico", title: "TBA - Por anunciar", link: "/registro/webinar-9" }
];

export const AnnualCalendar = () => {
    const router = useRouter();

    return (
        <section className="py-20 bg-white dark:bg-background-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/5 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-4xl mx-auto mb-16"
                >
                    <span className="text-primary dark:text-gold font-display italic text-xl mb-3 block">
                        Programa 2026
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-secondary dark:text-white mb-6 leading-tight">
                        Calendario Anual de <span className="text-primary italic font-serif">Webinars</span>
                    </h2>
                    <p className="text-text-muted dark:text-white/80 text-lg md:text-xl font-light">
                        Eventos gratuitos y exclusivos para miembros activos. Regístrate en las próximas sesiones y asegura tu lugar en nuestro programa de Desarrollo Profesional.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {events.slice(0, 3).map((ev, i) => (
                        <motion.div 
                            key={ev.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden group flex flex-col relative"
                        >
                            {/* Fecha Destacada */}
                            <div className="bg-primary/5 dark:bg-primary/10 p-6 flex items-center gap-4 relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#d95858] to-[#ff7a59] rounded-bl-[100px] -z-0 opacity-90 shadow-[inset_2px_2px_10px_rgba(255,255,255,0.2)]" />
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-surface-dark shadow-sm flex flex-col items-center justify-center text-primary dark:text-gold shrink-0 z-10 border border-primary/10">
                                    <span className="text-sm font-bold uppercase tracking-wider">{ev.month.substring(0,3)}</span>
                                    <span className="text-2xl font-black leading-none">{ev.day}</span>
                                </div>
                                <div className="z-10">
                                    <span className="text-xs font-bold text-primary/60 dark:text-gold/60 uppercase tracking-[0.15em] block mb-1">Próximo Evento</span>
                                    <h4 className="font-bold text-lg text-secondary dark:text-white leading-tight">Webinar Exclusivo</h4>
                                </div>
                            </div>

                            {/* Contenido Principal */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col">
                                <p className="text-base md:text-lg text-text-main dark:text-white/90 font-medium leading-snug mb-6 flex-1 group-hover:text-primary transition-colors">
                                    {ev.title}
                                </p>

                                <div className="space-y-2 mb-8 pt-4 border-t border-gray-50 dark:border-white/5">
                                    <div className="flex items-center gap-3 text-sm text-text-muted dark:text-white/60">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <FiUser className="text-primary" />
                                        </div>
                                        <span className="font-semibold text-secondary dark:text-white/80">{ev.speaker}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-text-muted dark:text-white/60">
                                        <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                                            <FiMapPin className="text-primary/70" />
                                        </div>
                                        <span>{ev.country}</span>
                                    </div>
                                </div>

                                {/* Botón Registro */}
                                <Button 
                                    variant="outline" 
                                    className="w-full mt-4 !rounded-full relative border-primary/20 text-secondary dark:text-white group-hover:bg-primary hover:!bg-primary group-hover:text-white hover:!text-white group-hover:border-primary group-hover:shadow-[0_8px_20px_-6px_rgba(90,153,84,0.4)] transition-all duration-300 group/btn before:absolute before:inset-0 before:bg-white/25 before:translate-y-full hover:before:translate-y-0 before:transition-transform"
                                >
                                    <span className="relative z-10">Registrarse</span>
                                    <FiArrowRight className="relative z-10 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="rounded-full w-full md:w-auto shadow-sm border-primary/20 hover:border-primary group"
                        onClick={() => router.push("/formaciones?tab=all")}
                    >
                        <span className="mr-2">Ver Programa Completo 2026</span>
                        <FiArrowRight className="text-secondary dark:text-white group-hover:translate-x-1 group-hover:text-primary transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};
