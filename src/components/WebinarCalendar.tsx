"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type WebinarData = {
  title: Record<'es' | 'pt', string>;
  time: Record<'es' | 'pt', string>;
  speaker: string;
  desc: Record<'es' | 'pt', string>;
  available: number;
  id: number;
};

const webinars: Record<string, WebinarData> = {
  "03-12": {
    title: {
      es: "Abusos Sexuales en la Infancia: Secuelas y recuperación con Brainspotting",
      pt: "Abusos Sexuais na Infância: Secuelas y recuperação com Brainspotting"
    },
    time: {
      es: "Webinar Online",
      pt: "Webinar Online"
    },
    speaker: "Susana Díaz",
    desc: {
      es: "Abordaje profundo de las secuelas del abuso infantil mediante técnicas de Brainspotting para una recuperación integral del paciente.",
      pt: "Abordagem profunda das sequelas do abuso infantil mediante técnicas de Brainspotting para uma recuperação integral do paciente."
    },
    available: 50,
    id: 0
  },
  "04-16": {
    title: {
      es: "A Arte do Suporte em Psicoterapia: Presença, regulação e recursos clínicos avançados",
      pt: "A Arte do Suporte em Psicoterapia: Presença, regulação e recursos clínicos avançados"
    },
    time: {
      es: "Webinar Online",
      pt: "Webinar Online"
    },
    speaker: "Daniel Gabarra",
    desc: {
      es: "Exploraremos la sintonía relacional y recursos neurorrelacionales para apoyar el proceso de curación en psicoterapias enfocadas en trauma.",
      pt: "Exploraremos a sintonía relacional e recursos neurorrelacionais para apoiar o processo de cura em psicoterapias de foco no trauma."
    },
    available: 50,
    id: 1
  },
  "05-08": {
    title: {
      es: "Protocolos Corporales en Terapia EMDR",
      pt: "Protocolos Corporais em Terapia EMDR"
    },
    time: {
      es: "Curso Online",
      pt: "Curso Online"
    },
    speaker: "Silvia Guz",
    desc: {
      es: "Curso vivencial con demostraciones en vivo y prácticas supervisadas, enfocado en el manejo del cuerpo en la atención online.",
      pt: "Curso vivencial com demonstrações ao vivo e práticas supervisionadas, focado no manejo do corpo no atendimento online."
    },
    available: 100,
    id: 10
  },
  "05-21": {
    title: {
      es: "Hipnosis y Brainspotting: Sinergia neurobiológica para el abordaje del TEPT",
      pt: "Hipnosis y Brainspotting: Sinergia neurobiológica para o manejo do TEPT"
    },
    time: {
      es: "Webinar Online",
      pt: "Webinar Online"
    },
    speaker: "Sebastián Segui",
    desc: {
      es: "Integración de técnicas de hipnosis y brainspotting para potenciar la neuroplasticidad y la integración de memorias traumáticas.",
      pt: "Integração de técnicas de hipnose e brainspotting para potenciar a neuroplasticidade e a integração de memórias traumáticas."
    },
    available: 50,
    id: 2
  },
  "06-18": {
    title: {
      es: "¿Intervención en Crise, Burnout y Stress, como consecuencias al Trauma?",
      pt: "¿Intervenção em Crise, Burnout e Stress, como consequencias ao Trauma?"
    },
    time: {
      es: "Webinar Online",
      pt: "Webinar Online"
    },
    speaker: "Renata Teles",
    desc: {
      es: "Análisis profundo sobre el impacto del trauma en el desarrollo de Burnout y estrés crónico, y estrategias de intervención en crisis.",
      pt: "Análise profunda sobre o impacto do trauma no desenvolvimento de Burnout e stress crônico, e estratégias de intervenção em crise."
    },
    available: 50,
    id: 3
  },
  "06-20": {
    title: {
      es: "Destrabando el TDAH con EMDR y Autorregulación",
      pt: "Destravando o TDAH com EMDR e Autorregulação"
    },
    time: {
      es: "Curso Online",
      pt: "Curso Online"
    },
    speaker: "Beth Maio & Leo Garcia",
    desc: {
      es: "Una lectura humana y neurocientífica del TDAH articulada con EMDR y autorregulación.",
      pt: "Uma leitura humana e neurocientífica do TDAH articulada com EMDR e autorregulação."
    },
    available: 100,
    id: 12
  },
  "07-16": {
    title: {
      es: "Herramientas creativas y Brainspotting",
      pt: "Ferramentas criativas e Brainspotting"
    },
    time: {
      es: "Webinar Online",
      pt: "Webinar Online"
    },
    speaker: "Norma Contreras",
    desc: {
      es: "Uso de recursos creativos y expresivos en el marco del Brainspotting para facilitar el acceso a núcleos traumáticos subcorticales.",
      pt: "Uso de recursos criativos e expressivos no marco do Brainspotting para facilitar o acesso a núcleos traumáticos subcorticais."
    },
    available: 50,
    id: 4
  },
  "08-20": {
    title: {
      es: "Nuevas Fronteiras en la Clínica del Trauma",
      pt: "Novas Fronteiras na Clínica do Trauma"
    },
    time: {
      es: "Webinar Online",
      pt: "Webinar Online"
    },
    speaker: "Sandra Fiore",
    desc: {
      es: "Exploración de nuevos protocolos y abordajes integrativos para el tratamiento de traumas complejos en la práctica clínica actual.",
      pt: "Exploração de novos protocolos e abordagens integrativas para o tratamento de traumas complexos na prática clínica atual."
    },
    available: 50,
    id: 5
  },
  "09-17": {
    title: {
      es: "Trauma, cuerpo y brainspotting",
      pt: "Trauma, corpo e brainspotting"
    },
    time: {
      es: "Webinar Online",
      pt: "Webinar Online"
    },
    speaker: "Juan Alexis",
    desc: {
      es: "Enfoque somático en el procesamiento del trauma mediante la técnica de Brainspotting, conectando mente y cuerpo en la sanación.",
      pt: "Enfoque somático no processamento do trauma mediante a técnica de Brainspotting, conectando mente e corpo na cura."
    },
    available: 50,
    id: 6
  },
  "10-09": {
    title: {
      es: "I Congreso Internacional TraumaClinic Latinoamérica",
      pt: "I Congresso Internacional TraumaClinic América Latina"
    },
    time: {
      es: "Evento Híbrido",
      pt: "Evento Híbrido"
    },
    speaker: "TraumaClinic",
    desc: {
      es: "'Del Nacimiento a la Vida: Reprocesando Nuestro Desarrollo'. Evento híbrido del 9 al 12 de octubre de 2026. 10% dto. para miembros.",
      pt: "'Do Nascimento à Vida: Reprocessando Nosso Desenvolvimento'. Evento híbrido de 9 a 12 de outubro de 2026. 10% desc. para membros."
    },
    available: 500,
    id: 13
  },
  "10-15": {
    title: {
      es: "Do útero materno à relação terapêutica: A jornada da conexão",
      pt: "Do útero materno à relação terapêutica: A jornada da conexão"
    },
    time: {
      es: "Webinar Online",
      pt: "Webinar Online"
    },
    speaker: "Angela Maranho",
    desc: {
      es: "Estudio sobre los vínculos primarios y su repercusión en la alianza terapéutica y en la resolución de traumas de apego precoz.",
      pt: "Estudo sobre os vínculos primários e sua repercussão na aliança terapêutica e na resolução de traumas de apego precoce."
    },
    available: 50,
    id: 7
  },
  "11-19": {
    title: {
      es: "Integración de Memorias Traumáticas",
      pt: "Integração de Memórias Traumáticas"
    },
    time: {
      es: "Webinar Online",
      pt: "Webinar Online"
    },
    speaker: "Parcuve Mex",
    desc: {
      es: "Técnicas avanzadas para la integración de memorias traumáticas fragmentadas en el flujo de la conciencia narrativa.",
      pt: "Técnicas avançadas para a integração de memórias traumáticas fragmentadas no fluxo da consciência narrativa."
    },
    available: 50,
    id: 8
  },
  "12-05": {
    title: {
      es: "Asamblea General AIBAPT",
      pt: "Assembleia Geral AIBAPT"
    },
    time: {
      es: "Institucional",
      pt: "Institucional"
    },
    speaker: "AIBAPT",
    desc: {
      es: "Reunión anual de miembros de la Asociación Iberoamericana de Psicotrauma.",
      pt: "Reunião anual de membros da Associação Ibero-Americana de Psicotrauma."
    },
    available: 200,
    id: 9
  }
};

export default function WebinarCalendar({ lang: propLang }: { lang?: 'es' | 'pt' }) {
  const { lang: contextLang } = useLanguage();
  const lang = propLang || contextLang || 'es';
  const [selectedDate, setSelectedDate] = useState<string | null>("06-18");
  const [currentMonth, setCurrentMonth] = useState<number>(6);
  
  const selectedEvent = selectedDate ? webinars[selectedDate] : null;
  
  const dict = {
    es: {
      months: ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'],
      days: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'],
      nextEvents: "Próximos Eventos",
      enrollNow: "Inscribirse Ahora",
      selectDate: "Selecciona una fecha",
      selectDateDesc: "Haz clic en una fecha destacada en el calendario para ver los detalles del evento y registrarte en nuestras próximas sesiones.",
      viewAll: "Ver todos los Eventos",
      noEvents: "No hay eventos en"
    },
    pt: {
      months: ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAYO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'],
      days: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'],
      nextEvents: "Próximos Eventos",
      enrollNow: "Inscreva-se Agora",
      selectDate: "Selecione uma data",
      selectDateDesc: "Clique em uma data destacada no calendário para ver os detalhes do evento e se registrar em nossas próximas sessões.",
      viewAll: "Ver todos os Eventos",
      noEvents: "Não há eventos em"
    }
  };

  const t = dict[lang] || dict.es;
  const currentMonthName = t.months[currentMonth - 1];

  const selectFirstEventOfMonth = (monthIndex: number) => {
    const monthStr = String(monthIndex).padStart(2, '0');
    const firstEventDate = Object.keys(webinars)
      .filter(dateKey => dateKey.startsWith(monthStr + '-'))
      .sort((a, b) => a.localeCompare(b))[0];
    
    if (firstEventDate) {
      setSelectedDate(firstEventDate);
    } else {
      setSelectedDate(null);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const next = prev === 12 ? 1 : prev + 1;
      selectFirstEventOfMonth(next);
      return next;
    });
  };
  
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const prevM = prev === 1 ? 12 : prev - 1;
      selectFirstEventOfMonth(prevM);
      return prevM;
    });
  };

  return (
    <section className="w-full bg-background-light py-24 px-4 sm:px-8 lg:px-[140px] flex flex-col lg:flex-row gap-16 xl:gap-32 items-center lg:items-start justify-center">
      {/* Left: Calendar Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[16px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden shrink-0">
        {/* Header */}
        <div className="bg-primary text-white p-5 flex justify-between items-center">
          <button onClick={prevMonth} className="text-white hover:opacity-70 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="font-bold tracking-[0.1em] text-[15px]">{currentMonthName} 2026</span>
          <button onClick={nextMonth} className="text-white hover:opacity-70 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        
        {/* Calendar Monthly View - Grid */}
        <div className="bg-white px-2 pt-2">
          {/* Days Header */}
          <div className="grid grid-cols-7 text-text-muted text-[11px] font-semibold tracking-wider py-2">
            {t.days.map(d => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 text-[14px] text-center pb-3">
            {(() => {
              const year = 2026;
              const daysInMonth = new Date(year, currentMonth, 0).getDate();
              const firstDayDate = new Date(year, currentMonth - 1, 1).getDay();
              const firstDayIndex = firstDayDate === 0 ? 6 : firstDayDate - 1; // 0 is Mon, 6 is Sun
              
              const blanks = Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`blank-${i}`} className="h-10"></div>
              ));
              
              const currentMonthStr = String(currentMonth).padStart(2, '0');
              const days = Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayStr = String(day).padStart(2, '0');
                const dateKey = `${currentMonthStr}-${dayStr}`;
                const isEvent = !!webinars[dateKey];
                const isSelected = selectedDate === dateKey;

                return (
                  <div key={day} className="h-10 flex items-center justify-center relative">
                    {isEvent ? (
                      <button 
                        onClick={() => setSelectedDate(dateKey)}
                        className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center font-bold ${isSelected ? 'bg-primary text-white shadow-md scale-110' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                      >
                        {day}
                      </button>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-text-dark">
                        {day}
                      </div>
                    )}
                  </div>
                );
              });

              return [...blanks, ...days];
            })()}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100"></div>

        {/* Calendar Monthly View - Agenda/List */}
        <div className="flex flex-col bg-gray-50/50 min-h-[120px]">
          {(() => {
            const currentMonthStr = String(currentMonth).padStart(2, '0');
            const monthEvents = Object.entries(webinars)
                .filter(([dateKey]) => dateKey.startsWith(currentMonthStr + '-'))
                .sort((a, b) => a[0].localeCompare(b[0]));

            if (monthEvents.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                   <p className="text-[13px] font-medium">{t.noEvents} {currentMonthName.toLowerCase()}</p>
                </div>
              );
            }

            return monthEvents.map(([dateKey, event]) => {
              const dayNum = dateKey.split('-')[1];
              const isSelected = selectedDate === dateKey;

              return (
                <button 
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`w-full text-left px-5 py-4 border-b border-gray-100 flex items-center gap-4 transition-all duration-300 hover:bg-gray-50 group ${isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                >
                  {/* Date Block */}
                  <div className={`flex flex-col items-center justify-center min-w-[40px] transition-colors ${isSelected ? 'text-primary' : 'text-text-main group-hover:text-primary/70'}`}>
                    <span className="text-2xl font-serif leading-none">{parseInt(dayNum, 10)}</span>
                  </div>
                  
                  {/* Event Info */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className={`text-[13.5px] font-semibold line-clamp-2 transition-colors ${isSelected ? 'text-primary' : 'text-text-dark'}`}>{event.title[lang] || event.title.es}</h4>
                    <p className="text-[11px] text-text-light truncate mt-1">{event.time[lang] || event.time.es} • {event.speaker}</p>
                  </div>

                  {/* Arrow indicator */}
                  <div className={`text-gray-300 transition-transform ${isSelected ? 'text-primary translate-x-1' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </button>
              );
            });
          })()}
        </div>
      </div>

      {/* Right: Details Panel */}
      <div className="flex-1 max-w-[540px] lg:sticky lg:top-32">
        <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">{t.nextEvents}</p>
        
        {selectedEvent ? (
          <div key={selectedDate} className="animate-fade-in-up">
            <h2 className="text-4xl md:text-[44px] font-serif text-text-light mb-6 leading-tight">{selectedEvent.title[lang] || selectedEvent.title.es}</h2>
            <p className="text-text-dark text-lg leading-relaxed mb-10">{selectedEvent.desc[lang] || selectedEvent.desc.es}</p>
            
            <div className="border-t border-gray-200 py-5 flex justify-between items-center">
               <span className="font-serif text-text-light text-xl">{selectedEvent.speaker}</span>
               <span className="text-text-dark">{selectedEvent.time[lang] || selectedEvent.time.es}</span>
            </div>
            <div className="border-t border-gray-200 mb-10"></div>
            
            <Link 
              href={`/${lang}/formaciones?tab=events&id=${selectedEvent.id}`}
              className="bg-accent text-white pl-8 pr-2 py-2 rounded-full font-medium hover:bg-accent-light transition-colors shadow-sm text-[15px] inline-flex items-center gap-4 group w-fit"
            >
              {t.enrollNow} 
              <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-[44px] font-serif text-text-light mb-6 leading-tight">{t.selectDate}</h2>
            <p className="text-text-dark text-lg leading-relaxed">{t.selectDateDesc}</p>
          </div>
        )}

        <div className="mt-14">
          <Link href={`/${lang}/formaciones`} className="text-primary font-medium hover:text-secondary flex items-center gap-2 transition-colors w-fit group">
            {t.viewAll} 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
