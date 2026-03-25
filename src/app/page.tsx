"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroParallax } from "@/components/layout/HeroParallax";
import { WhatIsTrauma } from "@/components/layout/WhatIsTrauma";
import { Benefits } from "@/components/layout/Benefits";
import { WebinarTimeline } from "@/components/layout/WebinarTimeline";
import { FAQ } from "@/components/layout/FAQ";
import { FunctionalStructure } from "@/components/layout/FunctionalStructure";
import { WebinarCalendarNotice } from "@/components/layout/WebinarCalendarNotice";
import { AccreditationCTA } from "@/components/layout/AccreditationCTA";

export default function LandingPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-20">
      <WebinarCalendarNotice />
      <HeroParallax />

      {/* Qué es el Trauma */}
      <WhatIsTrauma />

      {/* Beneficios - Movido antes del equipo directivo */}
      <div id="beneficios">
          <Benefits />
      </div>

      {/* Llamado a la Acción Acreditaciones */}
      <AccreditationCTA />

      {/* Estructura Funcional (Equipo Directivo) */}
      <div id="equipo">
          <FunctionalStructure />
      </div>

      {/* Calendario de Webinars (Destacado) */}
      <div className="bg-primary/5 dark:bg-surface-dark border-y border-primary/10">
          <WebinarTimeline />
      </div>

      {/* Who We Are */}
      <section className="py-24 bg-white dark:bg-background-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-primary dark:text-white font-display italic text-xl mb-2 block">{t("home.essence.badge")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-6">{t("home.essence.title")}</h2>
            <p className="text-text-main dark:text-white/80">
              {t("home.essence.desc")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group relative bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 md:mt-0">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-icons-round text-3xl">psychology</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-primary dark:text-white mb-4">{t("home.mission.title")}</h3>
              <p className="text-text-muted dark:text-white/70 leading-relaxed">
                {t("home.mission.desc")}
              </p>
            </div>
            <div className="group relative bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 md:mt-12">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-icons-round text-3xl">visibility</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-primary dark:text-white mb-4">{t("home.vision.title")}</h3>
              <p className="text-text-muted dark:text-white/70 leading-relaxed">
                {t("home.vision.desc")}
              </p>
            </div>
            <div className="group relative bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 md:mt-0">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-icons-round text-3xl">track_changes</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-primary dark:text-white mb-4">{t("home.goals.title")}</h3>
              <p className="text-text-muted dark:text-white/70 leading-relaxed">
                {t("home.goals.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">500+</div>
              <div className="text-accent text-sm uppercase tracking-wider">{t("stats.members")}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">20+</div>
              <div className="text-accent text-sm uppercase tracking-wider">{t("stats.countries")}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">50+</div>
              <div className="text-accent text-sm uppercase tracking-wider">{t("stats.events")}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">12</div>
              <div className="text-accent text-sm uppercase tracking-wider">{t("stats.research")}</div>
            </div>
          </div>
        </div>
      </section>



      {/* Fase 4: FAQ */}
      <FAQ />

    </div>
  );
}
