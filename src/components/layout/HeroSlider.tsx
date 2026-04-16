"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";
import { buttonVariants } from "@/components/ui/Button";

const slidesData = [
  {
    id: "introduccion",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2600&auto=format&fit=crop",
    getTitle: (_t?: any) => "Sanando Heridas Invisibles",
    getDesc: (_t?: any) => "Acompañamos el proceso de transformación profunda mediante un abordaje multidisciplinario, basado en la empatía y la ciencia.",
    buttonText: "Nuestro impacto",
    href: "#que-es-trauma"
  },
  {
    id: "mision-indirecta",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2670&auto=format&fit=crop",
    getTitle: (_t?: any) => "Uniendo Profesionales en Iberoamérica",
    getDesc: (_t?: any) => "Construimos una sólida red de conocimiento para fomentar la prevención y tratamiento efectivo del trauma psicológico sin fronteras.",
    buttonText: "Conoce la comunidad",
    href: "#equipo"
  },
  {
    id: "objetivos-indirectos",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2649&auto=format&fit=crop",
    getTitle: (_t?: any) => "Liderando con Rigor y Evidencia",
    getDesc: (_t?: any) => "Establecemos los más altos estándares clínicos a través de certificaciones, investigación constante y la formación continua de nuestros asociados.",
    buttonText: "Ver beneficios",
    href: "#beneficios"
  }
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const HeroSlider = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next >= slidesData.length) next = 0;
      if (next < 0) next = slidesData.length - 1;
      return next;
    });
  };

  const currentSlide = slidesData[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0.5,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.5 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.5 }
      }
    })
  };

  const textVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const el = document.getElementById(href.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollBy({ top: 800, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative h-[calc(100vh-80px)] min-h-[500px] w-full overflow-hidden bg-neutral-900 group">
      
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Background Image Image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlide.image})` }}
          />
          {/* Gradients to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Slide Content */}
          <div className="absolute inset-0 flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-2xl"
            >
              <div className="mb-3 md:mb-4">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/90 bg-primary/40 backdrop-blur-sm rounded-full border border-white/20">
                  {currentIndex + 1} / {slidesData.length}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-md leading-tight">
                {currentSlide.getTitle(t)}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-10 drop-shadow-sm max-w-xl">
                {currentSlide.getDesc(t)}
              </p>
              
              <div className="inline-flex">
                <a 
                  href={currentSlide.href}
                  onClick={(e) => scrollToSection(e, currentSlide.href)}
                  className={buttonVariants({ variant: "primary", size: "lg", className: "rounded-full px-8 py-6 text-lg hover:shadow-[0_0_20px_rgba(var(--color-primary),0.5)] transition-all flex items-center gap-2" })}
                >
                  {currentSlide.buttonText} 
                  <FiArrowUpRight className="text-xl" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex gap-3 z-20">
        <button
          onClick={() => paginate(-1)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Anterior"
        >
          <FiChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Siguiente"
        >
          <FiChevronRight className="text-2xl" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? "w-8 h-2 bg-primary" 
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>
      
    </div>
  );
};
