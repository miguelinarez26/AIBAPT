"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroSlider } from "@/components/layout/HeroSlider";
import { WhatIsTrauma } from "@/components/layout/WhatIsTrauma";
import { Benefits } from "@/components/layout/Benefits";
import { FAQ } from "@/components/layout/FAQ";
import { WebinarCalendarNotice } from "@/components/layout/WebinarCalendarNotice";
import { AnnualCalendar } from "@/components/layout/AnnualCalendar";
import { AccreditationCTA } from "@/components/layout/AccreditationCTA";
import { WebinarTimeline } from "@/components/layout/WebinarTimeline";

export default function LandingPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-20">
      <WebinarCalendarNotice />
      
      {/* 1. El Gancho Visual */}
      <HeroSlider />

      {/* 2. Autoridad y Confianza Inmediata (Stats) */}
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

      {/* 3. Empatía y Conexión Emocional */}
      <WhatIsTrauma />

      {/* 4. El Valor para el Usuario */}
      <div id="beneficios">
        <Benefits />
      </div>

      {/* 5. Platos Fuertes (Cursos y Certificaciones Top) */}
      <div className="bg-primary/5 dark:bg-surface-dark border-y border-primary/10">
        <WebinarTimeline />
      </div>

      {/* 6. Constancia (El ritmo mensual de aprendizaje) */}
      <AnnualCalendar />

      {/* 7. Nicho y Prestigio Institucional */}
      <AccreditationCTA />

      {/* 8. Cierre y Objeciones */}
      <FAQ />

    </div>
  );
}
