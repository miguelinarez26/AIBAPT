"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LangKeys } from "@/i18n/translations";

export default function AibaptValueProps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useLanguage();

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const props = [
    { key: "benefits.card5", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "benefits.card6", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { key: "benefits.card1", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
    { key: "benefits.card2", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { key: "benefits.card3", icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" },
    { key: "benefits.card4", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  ];

  return (
    <section className="w-full py-24 bg-primary px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          {/* @ts-ignore */}
          <p className="text-highlight text-[13px] font-bold tracking-[0.2em] uppercase mb-4">{t("benefits.badge")}</p>
          <h2 className="text-4xl md:text-[56px] font-serif text-white leading-[1.1] mb-6">
            {/* @ts-ignore */}
            {t("benefits.title")}
          </h2>
          {/* @ts-ignore */}
          <p className="text-white/90 text-lg">{t("benefits.desc")}</p>
        </div>
        
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Flecha Izquierda */}
          <button 
            onClick={scrollLeft} 
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-colors shadow-lg hidden md:flex"
          >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div 
            ref={containerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
             {props.map((p, i) => (
               <div key={i} className="group shrink-0 w-[calc(100vw-2rem)] md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] snap-start bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-500 rounded-2xl p-10 flex flex-col items-center text-center shadow-lg hover:shadow-2xl">
                  <div className="w-20 h-20 bg-white/20 group-hover:bg-secondary rounded-full flex items-center justify-center mb-8 transition-colors duration-500 shadow-sm shrink-0 backdrop-blur-md">
                     <svg className="w-10 h-10 text-white transition-colors duration-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
                     </svg>
                  </div>
                  {/* @ts-ignore */}
                  <h3 className="text-[22px] font-serif text-white mb-4 transition-colors duration-500 leading-snug">{t(`${p.key}.title` as LangKeys)}</h3>
                  {/* @ts-ignore */}
                  <p className="text-white/80 group-hover:text-white text-[15px] leading-relaxed transition-colors duration-500">{t(`${p.key}.desc` as LangKeys)}</p>
               </div>
            ))}
          </div>

          {/* Flecha Derecha */}
          <button 
            onClick={scrollRight} 
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-colors shadow-lg hidden md:flex"
          >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        
        <div className="mt-12 text-center">
           <Link href={`/${lang}/afiliacion`} className="bg-secondary text-white pl-8 pr-3 py-3 rounded-full font-bold hover:bg-accent transition-colors shadow-sm text-[15px] inline-flex items-center gap-4 group hover:-translate-y-1 transform duration-300">
              {/* @ts-ignore */}
              {t("benefits.btn")} 
              <span className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
           </Link>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}

