"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";

export const HeroScrollStory = () => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll over the 400vh container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // --- ANIMATION TIMELINES (0 to 1 representing scroll progress) --- //

    // 1. Initial Intro (0 to 0.15 fades out)
    const introOpacity = useTransform(scrollYProgress, [0, 0.10, 0.15], [1, 1, 0]);
    const introY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

    // 2. Block 1: Psicotrauma (0.15 to 0.40 fades in, stays, fades out)
    const b1Op = useTransform(scrollYProgress, [0.15, 0.22, 0.33, 0.40], [0, 1, 1, 0]);
    const b1Y = useTransform(scrollYProgress, [0.15, 0.22, 0.33, 0.40], [50, 0, 0, -50]);

    // 3. Block 2: Misión (0.40 to 0.65 fades in, stays, fades out)
    const b2Op = useTransform(scrollYProgress, [0.40, 0.47, 0.58, 0.65], [0, 1, 1, 0]);
    const b2Y = useTransform(scrollYProgress, [0.40, 0.47, 0.58, 0.65], [50, 0, 0, -50]);

    // 4. Block 3: Objetivos (0.65 to 0.90 fades in, stays, fades out)
    const b3Op = useTransform(scrollYProgress, [0.65, 0.72, 0.85, 0.95], [0, 1, 1, 0]);
    const b3Y = useTransform(scrollYProgress, [0.65, 0.72, 0.85, 0.95], [50, 0, 0, -50]);

    // Background Image & Overlay adjustments
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]); // Subtle constant zoom
    const bgDarknessOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 0.65, 0.8, 0.85]); 

    // Scroll Indicator (Down arrow fades out quickly)
    const scrollIconOp = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

    return (
        // The container is super tall to allow for lots of scrolling
        <div ref={containerRef} className="relative h-[400vh] bg-neutral-950">
            
            {/* The sticky section that holds the visuals and typography perfectly in view */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                
                {/* Background Image that slowly scales */}
                <motion.div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ 
                        backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2600&auto=format&fit=crop')", // High quality landscape/mindfulness
                        scale: bgScale
                    }}
                />

                {/* Darker overlay that gets slightly darker as we scroll down to focus on text */}
                <motion.div 
                    className="absolute inset-0 bg-neutral-950"
                    style={{ opacity: bgDarknessOpacity }}
                />

                {/* --- CONTENT LAYERS --- */}

                {/* INTRO */}
                <motion.div 
                    style={{ opacity: introOpacity, y: introY }}
                    className="absolute px-4 sm:px-6 md:px-8 text-center max-w-5xl w-full"
                >
                    <span className="text-accent uppercase tracking-[0.3em] text-xs md:text-sm font-bold block mb-6 drop-shadow-md">
                        Asociación Iberoamericana de Psicotrauma
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-xl tracking-tight leading-tight">
                        Sanando <span className="text-white/70 italic font-display">desde la raíz</span>
                    </h1>
                </motion.div>

                {/* BLOCK 1: Psicotrauma */}
                <motion.div 
                    style={{ opacity: b1Op, y: b1Y }}
                    className="absolute px-4 sm:px-6 lg:px-12 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8"
                >
                    <div className="text-accent text-6xl md:text-8xl font-display opacity-80 mb-2 md:mb-0 hidden md:block">01</div>
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">¿Qué es el <span className="text-primary italic">Psicotrauma?</span></h2>
                        <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light drop-shadow-sm max-w-3xl">
                            Comprender las heridas invisibles es el primer paso. Nuestro abordaje científico y humano busca sanar los traumas más profundos mediante herramientas clínicas interdisciplinarias probadas internacionalmente.
                        </p>
                    </div>
                </motion.div>

                {/* BLOCK 2: Misión */}
                <motion.div 
                    style={{ opacity: b2Op, y: b2Y }}
                    className="absolute px-4 sm:px-6 lg:px-12 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8"
                >
                    <div className="text-accent text-6xl md:text-8xl font-display opacity-80 mb-2 md:mb-0 hidden md:block">02</div>
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">Nuestra <span className="text-primary italic">Misión</span></h2>
                        <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light drop-shadow-sm max-w-3xl">
                            {t("home.mission.desc") || "Agrupar y fomentar la excelencia en la investigación, prevención y tratamiento del psicotrauma en Iberoamérica, construyendo un puente de conocimiento y humanidad entre profesionales."}
                        </p>
                    </div>
                </motion.div>

                {/* BLOCK 3: Objetivos */}
                <motion.div 
                    style={{ opacity: b3Op, y: b3Y }}
                    className="absolute px-4 sm:px-6 lg:px-12 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8"
                >
                    <div className="text-accent text-6xl md:text-8xl font-display opacity-80 mb-2 md:mb-0 hidden md:block">03</div>
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">Nuestros <span className="text-primary italic">Objetivos</span></h2>
                        <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light drop-shadow-sm max-w-3xl mb-10">
                            {t("home.goals.desc") || "Promover la certificación, formación continua, alianzas de investigación y establecer los más altos estándares clínicos guiados por la evidencia y el rigor académico."}
                        </p>
                        
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="rounded-full px-8 py-6 shadow-xl hover:shadow-[0_0_20px_rgba(var(--color-primary),0.6)] text-lg"
                            onClick={() => {
                                document.getElementById("beneficios")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Conocer Beneficios
                        </Button>
                    </div>
                </motion.div>

                {/* Scroll Down Indicator */}
                <motion.div 
                    style={{ opacity: scrollIconOp }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-white/60"
                >
                    <span className="text-xs uppercase tracking-[0.2em] mb-3">Haz scroll para explorar</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                        <FiArrowDown className="text-2xl" />
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
};
