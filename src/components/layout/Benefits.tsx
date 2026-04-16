"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { buttonVariants } from "@/components/ui/Button";

export const Benefits = () => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const originalCards = [
        { icon: "local_offer", title: t("benefits.card1.title"), desc: t("benefits.card1.desc") },
        { icon: "library_books", title: t("benefits.card2.title"), desc: t("benefits.card2.desc") },
        { icon: "groups", title: t("benefits.card3.title"), desc: t("benefits.card3.desc") },
        { icon: "school", title: t("benefits.card4.title" as any), desc: t("benefits.card4.desc" as any) },
        { icon: "verified", title: t("benefits.card5.title" as any), desc: t("benefits.card5.desc" as any) },
        { icon: "handshake", title: t("benefits.card6.title" as any), desc: t("benefits.card6.desc" as any) },
    ];

    // Duplicar tarjetas para el efecto infinito (antes y después)
    const cards = [...originalCards, ...originalCards, ...originalCards];
    const middleIndex = originalCards.length;

    const scroll = (direction: "left" | "right") => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        if (direction === "right") {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Lógica para resetear la posición sin que se note al llegar a los extremos de los clones
    useEffect(() => {
        const totalOriginal = originalCards.length;
        const duration = 500; // Un poco más suave
        
        if (currentIndex >= totalOriginal) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, duration); 
        } else if (currentIndex <= -totalOriginal) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, duration);
        } else {
            setTimeout(() => setIsTransitioning(false), duration);
        }
    }, [currentIndex, originalCards.length]);

    return (
        <section className="py-24 relative overflow-hidden bg-primary/[0.05] dark:bg-background-dark/50 border-y border-primary/10">
            {/* Patrón de puntos acentuado y más grande */}
            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#475569_1.5px,transparent_1.5px)] bg-[length:32px_32px] opacity-25 pointer-events-none" />
            
            {/* Elementos de resplandor (blobs) con más presencia cromática */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[40rem] h-[40rem] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-2">
                <div className="text-center max-w-3xl mx-auto mb-6">
                    <span className="text-primary dark:text-gold font-display italic text-xl mb-2 block">
                        {t("benefits.badge")}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary dark:text-white mb-4">
                        {t("benefits.title")}
                    </h2>
                    <p className="text-text-main dark:text-white/80 text-lg md:text-xl">
                        {t("benefits.desc")}
                    </p>
                </div>
            </div>

            {/* Contenedor del Carrusel Infinito (Ancho completo) */}
            <div className="relative w-full py-4 group">
                <div className="relative overflow-hidden w-full">
                    <motion.div 
                        className="flex shrink-0 cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragElastic={0.2}
                        onDragEnd={(e, { offset }) => {
                            if (offset.x < -40) scroll("right");
                            else if (offset.x > 40) scroll("left");
                        }}
                        style={{ 
                            gap: "40px",
                            paddingLeft: "calc(50% - 140px)", // 140px (mitad de 280px para alineación base móvil)
                        }}
                        animate={{ 
                            x: `-${(middleIndex + currentIndex) * 320}px` // 280px + 40px gap
                        }}
                        transition={{ 
                            type: "tween",
                            ease: "easeOut",
                            duration: isTransitioning ? 0.5 : 0
                        }}
                    >
                        {cards.map((card, index) => (
                            <BenefitCard key={index} card={card} index={index} />
                        ))}
                    </motion.div>
                </div>

                {/* Flechas a los lados (flotantes sobre las tarjetas en desktop) */}
                <button 
                    onClick={() => scroll("left")}
                    disabled={isTransitioning}
                    className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full border border-primary/20 bg-white/95 backdrop-blur-md dark:bg-surface-dark/95 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 opacity-100 xl:opacity-0 group-hover:opacity-100"
                >
                    <FiChevronLeft className="text-2xl md:text-3xl" />
                </button>
                <button 
                    onClick={() => scroll("right")}
                    disabled={isTransitioning}
                    className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full border border-primary/20 bg-white/95 backdrop-blur-md dark:bg-surface-dark/95 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 opacity-100 xl:opacity-0 group-hover:opacity-100"
                >
                    <FiChevronRight className="text-2xl md:text-3xl" />
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-8">
                <div className="flex justify-center">
                    <Link href="/afiliacion" className={buttonVariants({ variant: "primary", size: "lg" })}>
                        {t("benefits.btn")} <FiArrowUpRight className="inline" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

const BenefitCard = ({ card }: { card: any; index: number }) => {
    return (
        <div
            style={{ width: "280px" }}
            className="h-[380px] flex-shrink-0 bg-white/95 backdrop-blur-xl dark:bg-surface-dark border border-primary/20 dark:border-white/10 rounded-[2rem] p-8 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-primary/40 hover:-translate-y-3 transition-all duration-300 group flex flex-col items-center text-center relative z-10"
        >
            <div 
                className="w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent text-primary dark:text-gold rounded-2xl flex items-center justify-center mb-8 shadow-sm rotate-3 group-hover:rotate-0 transition-transform duration-300 pointer-events-none ring-1 ring-primary/20"
            >
                <span className="material-icons-round text-3xl">{card.icon}</span>
            </div>
            
            <div className="pointer-events-none">
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-4 leading-tight">
                    {card.title}
                </h3>
            </div>
            
            <div className="pointer-events-none">
                <p className="text-sm text-text-muted dark:text-white/70 leading-relaxed">
                    {card.desc}
                </p>
            </div>
        </div>
    );
};

