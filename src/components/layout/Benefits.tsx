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
        <section className="py-24 bg-white dark:bg-background-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary dark:text-gold font-display italic text-xl mb-2 block">
                        {t("benefits.badge")}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary dark:text-white mb-6">
                        {t("benefits.title")}
                    </h2>
                    <p className="text-text-main dark:text-white/80 text-lg md:text-xl">
                        {t("benefits.desc")}
                    </p>
                </div>

                {/* Controles */}
                <div className="flex justify-end gap-4 mb-4">
                    <button 
                        onClick={() => scroll("left")}
                        disabled={isTransitioning}
                        className="w-12 h-12 rounded-full border border-primary/20 bg-white dark:bg-surface-dark text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm disabled:opacity-50"
                    >
                        <FiChevronLeft className="text-2xl" />
                    </button>
                    <button 
                        onClick={() => scroll("right")}
                        disabled={isTransitioning}
                        className="w-12 h-12 rounded-full border border-primary/20 bg-white dark:bg-surface-dark text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm disabled:opacity-50"
                    >
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Contenedor del Carrusel Infinito (Ancho completo) */}
            <div className="relative overflow-hidden w-full py-10">
                <motion.div 
                    className="flex shrink-0"
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-12">
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
            className="h-[380px] flex-shrink-0 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-xl transition-shadow group flex flex-col items-center text-center relative"
        >
            <div 
                className="w-16 h-16 bg-accent/10 text-primary dark:text-gold rounded-full flex items-center justify-center mb-8 shadow-inner transition-colors duration-300 pointer-events-none"
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

