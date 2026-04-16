"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export const WebinarCalendarNotice = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Mostrar después de 1 segundo de cargar la página
        // y solo si no se ha cerrado en esta sesión
        const hasSeenNotice = sessionStorage.getItem("aibapt_webinar_2026");
        if (!hasSeenNotice) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const closeNotice = () => {
        setIsVisible(false);
        sessionStorage.setItem("aibapt_webinar_2026", "true");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                >
                    <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
                        <button
                            onClick={closeNotice}
                            className="absolute top-4 right-4 text-gray-400 hover:text-accent transition-colors"
                        >
                            <span className="material-icons-round">close</span>
                        </button>
                        
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <span className="material-icons-round text-3xl">event</span>
                            <span className="text-sm font-bold uppercase tracking-wider">Aviso Destacado</span>
                        </div>
                        
                        <h3 className="text-2xl font-display font-bold text-secondary dark:text-white mb-2">
                            Próximos Eventos 2026
                        </h3>
                        <p className="text-text-muted dark:text-gray-300 mb-6">
                            Ya está disponible nuestro calendario oficial de eventos para el próximo año. ¡Reserva las fechas y no te pierdas a nuestros ponentes internacionales!
                        </p>
                        
                        <div className="bg-primary/5 dark:bg-surface-light/5 border border-primary/20 rounded-xl p-4 mb-6">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="material-icons-round text-primary text-sm mt-0.5">check_circle</span>
                                    <span className="text-sm text-text-main dark:text-white/80">
                                        <strong>Marzo:</strong> Intervención Temprana
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-icons-round text-primary text-sm mt-0.5">check_circle</span>
                                    <span className="text-sm text-text-main dark:text-white/80">
                                        <strong>Abril:</strong> Trauma y Disociación
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-icons-round text-primary text-sm mt-0.5">check_circle</span>
                                    <span className="text-sm text-text-main dark:text-white/80">
                                        <strong>Mayo:</strong> Neurobiología del Traumatismo
                                    </span>
                                </li>
                            </ul>
                        </div>
                        
                        <Button
                            onClick={closeNotice}
                            variant="primary"
                            size="default"
                            fullWidth
                        >
                            ¡De acuerdo!
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
