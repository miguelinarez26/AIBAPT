"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { assetPath } from "@/lib/assets";

interface AibaptEventsProps {
  events?: any[];
}

export default function AibaptEvents({ events = [] }: AibaptEventsProps) {
  const { lang, t } = useLanguage();

  const dict = {
    es: {
      eyebrow: "Desarrollo Profesional",
      subtitle: "Próximos Eventos",
      desc: "Entrenamientos intensivos y certificaciones internacionales para psicoterapeutas bajo el estándar de AIBAPT.",
      viewAll: "Ver Todos los Eventos",
      viewDetails: "Ver Detalles",
      events: [
        { title: "Protocolos Corporales en Terapia EMDR", type: "ENTRENAMIENTO | BRASIL", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop", route: "/es/formaciones?tab=events" },
        { title: "Psicodrama Presencial: Técnicas Avanzadas", type: "PSICODRAMA | PRESENCIAL", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", route: "/es/formaciones?tab=events" },
        { title: "Entrenamiento Básico en Brainspotting", type: "BRAINSPOTTING | ONLINE", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop", route: "/es/formaciones?tab=events" },
      ]
    },
    pt: {
      eyebrow: "Desenvolvimento Profissional",
      subtitle: "Próximos Eventos",
      desc: "Treinamentos intensivos e certificações internacionais para psicoterapeutas sob o padrão da AIBAPT.",
      viewAll: "Ver Todos os Eventos",
      viewDetails: "Ver Detalhes",
      events: [
        { title: "Protocolos Corporais em Terapia EMDR", type: "TREINAMENTO | BRASIL", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop", route: "/pt/formaciones?tab=events" },
        { title: "Psicodrama Presencial: Técnicas Avanzadas", type: "PSICODRAMA | PRESENCIAL", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", route: "/pt/formaciones?tab=events" },
        { title: "Treinamento Básico em Brainspotting", type: "BRAINSPOTTING | ONLINE", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop", route: "/pt/formaciones?tab=events" },
      ]
    }
  };

  const localT = dict[lang] || dict.es;

  // Map fallback events to separate category and location
  const fallbackEvents = localT.events.map((e: any) => {
    const parts = e.type.split(" | ");
    return {
      title: e.title,
      category: (parts[0] || "").toUpperCase(),
      location: (parts[1] || "").toUpperCase(),
      image: e.image,
      route: e.route
    };
  });

  // Map Supabase events to match card structure
  const mappedEvents = events && events.length > 0 ? events.slice(0, 3).map((e: any) => {
    const categoryPart = e.category_label || (lang === "es" ? "Entrenamiento" : "Treinamento");
    const locationPart = e.location || "Online";
    const isOfficial = e.is_official || e.category_label?.toLowerCase().includes("oficial");
    
    // Si es oficial, usar el logo de Aibapt transparente (para evitar logos feos de la base de datos)
    const eventImage = isOfficial 
      ? "/images/aibapt_logo_transparent_seal.png" 
      : (e.thumbnail_url || "/images/webinar_placeholder_new.png");

    return {
      title: e.title,
      category: categoryPart.toUpperCase(),
      location: locationPart.toUpperCase(),
      image: eventImage,
      route: `/${lang}/formaciones?tab=events&id=${e.id}`
    };
  }) : fallbackEvents;

  return (
    <section className="w-full py-24 bg-gradient-to-b from-white to-primary/5 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="max-w-2xl">
             <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">{localT.eyebrow}</p>
             <h2 className="text-4xl md:text-[56px] font-serif text-text-light leading-[1.1] mb-4">
               {localT.subtitle}
             </h2>
             <p className="text-text-dark text-lg">{localT.desc}</p>
           </div>
           <Link href={`/${lang}/formaciones?tab=events`} className="bg-accent text-white pl-8 pr-2 py-2 rounded-full font-medium hover:bg-accent-light transition-all shadow-md text-[15px] inline-flex items-center gap-4 group shrink-0">
             {localT.viewAll}
             <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
             </span>
           </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {mappedEvents.map((ev: any, i: number) => {
             const isLogo = ev.image?.includes("aibapt_logo");
             return (
               <div key={i} className="group cursor-pointer flex flex-col h-full bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-accent/30 transition-all duration-500 hover:-translate-y-2">
                  <div className="w-full h-[280px] rounded-[24px] overflow-hidden mb-6 relative shadow-inner bg-gray-50 shrink-0">
                     <div 
                       className={`absolute inset-0 transition-transform duration-700 group-hover:scale-110 ${
                         isLogo 
                           ? "bg-contain bg-center bg-no-repeat bg-gradient-to-br from-primary/10 to-secondary/5 origin-center scale-[0.8] group-hover:scale-[0.83]" 
                           : "bg-cover bg-center"
                       }`} 
                       style={{ backgroundImage: `url('${assetPath(ev.image)}')` }}
                     ></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-5 left-5 flex flex-wrap gap-2 max-w-[90%]">
                         {ev.category && (
                           <span className="bg-primary/95 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.15em] px-4 py-2 rounded-full shadow-lg uppercase leading-none border border-white/10">
                             {ev.category}
                           </span>
                         )}
                         {ev.location && (
                           <span className="bg-white/95 backdrop-blur-sm border border-black/5 text-primary text-[10px] font-bold tracking-[0.15em] px-4 py-2 rounded-full shadow-lg uppercase leading-none">
                             {ev.location}
                           </span>
                         )}
                      </div>
                  </div>
                  <h3 className="text-[24px] font-serif text-text-light group-hover:text-accent transition-colors leading-[1.3] mb-6 pr-4 grow">{ev.title}</h3>
                  <Link href={ev.route} className="mt-auto group/btn inline-flex items-center gap-3 bg-accent text-white pl-6 pr-2 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:bg-accent-light hover:shadow-lg w-fit justify-between">
                     <span>{localT.viewDetails}</span>
                     <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:bg-white/30">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                     </div>
                  </Link>
               </div>
             );
           })}
        </div>
      </div>
    </section>
  );
}
