"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiFileText, FiMessageCircle } from "react-icons/fi";
import { buttonVariants } from "@/components/ui/Button";
import sealImage from "../../../public/images/aibapt_logo_transparent_seal.png";

export const AccreditationCTA = () => {
    return (
        <section className="py-24 bg-white dark:bg-[#0a0f0d] relative overflow-hidden transition-colors duration-500">
            {/* Background elements for premium look */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent/5 dark:bg-accent/5 rounded-full blur-[100px] opacity-30" />
                
                {/* Subtle dots pattern for light mode */}
                <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.03] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] dark:shadow-2xl overflow-hidden relative group">
                    {/* Decorative border glow on hover */}
                    <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-700 rounded-[3rem] pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-primary/10 dark:bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 dark:border-primary/30">
                                    Excelencia Académica
                                </span>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary dark:text-white mb-8 leading-tight">
                                Eleva el estándar de tu <span className="text-primary italic">formación</span>
                            </h2>
                            
                            <p className="text-xl text-text-muted dark:text-white/70 mb-10 leading-relaxed font-light">
                                Obtén el aval de la **AIBAPT** y forma parte de una red de prestigio global. Tu compromiso con la excelencia merece el reconocimiento de los líderes en psicotraumatología.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link
                                    href="/recursos"
                                    className={buttonVariants({ variant: "primary", size: "lg" })}
                                >
                                    <FiFileText className="text-xl relative z-10" />
                                    <span className="relative z-10">Manual de Acreditación</span>
                                </Link>
                                
                                <Link
                                    href="/contacto"
                                    className={buttonVariants({ variant: "outline", size: "lg" })}
                                >
                                    <FiMessageCircle className="text-xl" />
                                    <span>Contactar al Comité</span>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:flex justify-center items-center relative"
                        >
                            {/* Visual element with only the logo, enlarged */}
                            <div className="relative w-full h-full flex items-center justify-center lg:-ml-6 lg:-mr-20">
                                <div className="absolute inset-0 bg-primary/5 dark:bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                                
                                <div className="relative w-[120%] h-[500px] lg:w-[800px] lg:h-[800px] flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-700">
                                    {/* Animaciones SVG (Brand Identity) */}
                                    <svg className="absolute w-[80%] h-[80%] lg:w-[80%] lg:h-[80%] animate-[spin_40s_linear_infinite] opacity-40 pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="100" cy="100" r="90" stroke="currentColor" className="text-primary" strokeWidth="0.5" strokeDasharray="4 12" strokeLinecap="round" />
                                        <circle cx="100" cy="100" r="75" stroke="currentColor" className="text-accent" strokeWidth="1.5" strokeDasharray="2 20" strokeLinecap="round" />
                                    </svg>

                                    <svg className="absolute w-[90%] h-[90%] lg:w-[90%] lg:h-[90%] animate-[spin_25s_linear_infinite_reverse] opacity-30 pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="100" cy="100" r="85" stroke="currentColor" className="text-primary" strokeWidth="1" strokeDasharray="10 40 5 40" strokeLinecap="round" />
                                        <circle cx="100" cy="100" r="65" stroke="currentColor" className="text-secondary" strokeWidth="1" strokeDasharray="15 30" strokeLinecap="round" />
                                    </svg>
                                    
                                    <Image 
                                        src={sealImage} 
                                        alt="Sello AIBAPT" 
                                        fill 
                                        sizes="(max-width: 1024px) 500px, 800px"
                                        className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10"
                                        priority
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

