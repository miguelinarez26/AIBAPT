"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AibaptTraumaInfo() {
  const { lang, t } = useLanguage();

  const dict = {
    es: {
      treatmentTitle: "Existe tratamiento efectivo",
      treatmentDesc: "A través de enfoques integradores es posible restaurar el bienestar integral.",
      traumaDesc: "El trauma psicológico es el resultado de un evento o serie de eventos abrumadores que exceden nuestra capacidad de afrontamiento. No se trata simplemente del evento en sí, sino de la respuesta de nuestro sistema nervioso que queda atrapada en un estado de alerta constante o disociación."
    },
    pt: {
      treatmentTitle: "Existe tratamento eficaz",
      treatmentDesc: "Através de abordagens integrativas é possível restaurar o bem-estar integral.",
      traumaDesc: "O trauma psicológico é o resultado de um evento ou série de eventos avassaladores que excedem nossa capacidade de enfrentamento. Não se trata apenas do evento em si, mas da resposta do nosso sistema nervoso que fica presa em um estado de alerta constante ou dissociação."
    }
  };

  const localT = dict[lang] || dict.es;

  return (
    <section className="w-full py-24 bg-background-light px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Side: Image */}
        <div className="w-full lg:w-1/2 relative">
           <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-t-full rounded-br-full overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2600&auto=format&fit=crop')" }} 
              />
           </div>
           {/* Floating Badge */}
           <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[280px] z-10">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <h4 className="text-primary font-bold text-lg mb-2">{localT.treatmentTitle}</h4>
              <p className="text-text-dark text-sm leading-relaxed">{localT.treatmentDesc}</p>
           </div>
        </div>

        {/* Right Side: Text */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          {/* @ts-ignore */}
          <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">{t("whatistrauma.badge")}</p>
          <h2 className="text-4xl md:text-[56px] font-serif text-text-light leading-[1.1] mb-8">
            {/* @ts-ignore */}
            {t("whatistrauma.title1")} <span className="italic font-light text-primary">{t("whatistrauma.title_highlight")}</span> {t("whatistrauma.title2")}
          </h2>
          <p className="text-text-dark text-lg leading-relaxed mb-10">
            {localT.traumaDesc}
          </p>
          
          <div className="bg-white p-8 md:p-10 rounded-2xl border-l-4 border-accent shadow-sm relative">
             <div className="absolute -top-10 -left-6 text-gray-100 text-[120px] font-serif leading-none select-none">"</div>
             <p className="text-xl md:text-2xl font-serif italic text-text-light leading-relaxed relative z-10">
                {/* @ts-ignore */}
                "{t("whatistrauma.quote")}"
             </p>
             {/* @ts-ignore */}
             <p className="mt-6 text-accent font-semibold tracking-wider uppercase text-sm">{t("whatistrauma.quote_author")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
