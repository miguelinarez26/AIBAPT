"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhatIsTrauma = () => {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-background-light dark:bg-background-dark relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Lado Izquierdo: Texto y Cita (Animado) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest">
                            <span className="material-icons-round text-sm">psychology</span>
                            Comprendiendo la raíz
                        </div>

                        <h2 className="font-display text-4xl sm:text-5xl font-bold leading-none text-secondary dark:text-white pb-2">
                            ¿Qué es el <span className="text-primary italic">Trauma</span> Psicológico o Emocional?
                        </h2>

                        <div className="prose prose-lg dark:prose-invert text-text-muted dark:text-white/80 leading-relaxed text-justify">
                            <p>
                                El trauma psicológico es el resultado de un evento o serie de eventos abrumadores que exceden nuestra capacidad de afrontamiento. No se trata simplemente del evento en sí, sino de la <strong>respuesta de nuestro sistema nervioso</strong> que queda atrapada en un estado de alerta constante o disociación.
                            </p>
                            <p>
                                A nivel biológico, experiencias intensas de miedo, dolor, abandono o amenaza (ya sean agudas o crónicas) alteran la forma en que el cerebro procesa la memoria y la emoción, dejando "huellas" que afectan nuestro comportamiento, salud física y relaciones en el presente.
                            </p>
                        </div>

                        {/* Cita Inspiradora */}
                        <div className="relative p-8 rounded-2xl bg-white dark:bg-surface-dark shadow-soft mt-8 border-l-4 border-accent">
                            <span className="absolute -top-6 -left-2 text-6xl text-accent/20 font-serif leading-none">"</span>
                            <p className="text-xl font-serif italic text-text-main dark:text-white/90 relative z-10">
                                El trauma no es lo que te sucede; el trauma es lo que sucede dentro de ti como resultado de lo que te sucede.
                            </p>
                            <p className="mt-4 text-sm font-bold text-primary">— Dr. Gabor Maté</p>
                        </div>
                    </motion.div>

                    {/* Lado Derecho: Imagen con Glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative"
                    >
                        {/* Forma orgánica de fondo */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-secondary/30 organic-shape blur-xl opacity-70"></div>

                        {/* Contenedor de la Imagen */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-square border-8 border-white dark:border-surface-dark">
                            {/* Imagen de Unsplash representativa de sanación/paz mental */}
                            <Image
                                fill
                                alt="Persona en un bosque sereno representando sanación y paz mental"
                                className="object-cover"
                                src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2564&auto=format&fit=crop"
                            />

                            {/* Tarjeta Glassmorphism superpuesta */}
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="glass-header rounded-2xl p-6 shadow-lg border border-white/40 dark:border-white/10 backdrop-blur-md">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-md">
                                            <span className="material-icons-round">volunteer_activism</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-secondary dark:text-white mb-2">
                                                Existe tratamiento efectivo
                                            </h4>
                                            <p className="text-sm text-text-main dark:text-white/80 leading-snug text-justify">
                                                A través de enfoques integradores (como EMDR y Brainspotting), es posible reprogramar el sistema nervioso y restaurar el bienestar integral, sanando la raíz del sufrimiento.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
