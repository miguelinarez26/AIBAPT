"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LangKeys } from "@/i18n/translations";

export default function AibaptFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const { t } = useLanguage();

  const faqs = Array.from({ length: 17 }).map((_, i) => {
    const num = i + 1;
    return {
      question: t(`faq.q${num}` as LangKeys),
      answer: t(`faq.a${num}` as LangKeys)
    };
  });

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 bg-background-light px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* @ts-ignore */}
          <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">{t("faq.badge")}</p>
          <h2 className="text-4xl md:text-[56px] font-serif text-text-light leading-[1.1] mb-6">
            {/* @ts-ignore */}
            {t("faq.title")}
          </h2>
          {/* @ts-ignore */}
          <p className="text-text-dark text-lg">{t("faq.desc")}</p>
        </div>
        
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            
            return (
              <div 
                key={index} 
                className={`w-full rounded-[24px] overflow-hidden transition-all duration-300 cursor-pointer ${isActive ? 'bg-highlight' : 'bg-white hover:bg-white/90'}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="px-8 py-6 md:py-8 flex justify-between items-center">
                  <h3 className="text-[22px] md:text-[26px] font-serif text-text-light pr-4">
                    {faq.question}
                  </h3>
                  <div className="shrink-0 text-text-light">
                    {isActive ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`px-8 overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-[500px] pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-text-dark text-[16px] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
