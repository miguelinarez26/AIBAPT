import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import WebinarCalendar from "@/components/WebinarCalendar";
import AibaptStats from "@/components/AibaptStats";
import AibaptTraumaInfo from "@/components/AibaptTraumaInfo";
import AibaptValueProps from "@/components/AibaptValueProps";
import AibaptEvents from "@/components/AibaptEvents";
import AibaptFAQ from "@/components/AibaptFAQ";

interface PageProps {
  params: Promise<{ lang: 'es' | 'pt' }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  const dict = {
    es: {
      title: "Soporte Adaptado ",
      titleItalic: "a tus Necesidades",
      subtitle: "Terapia compasiva para cada etapa de la vida.",
      services: [
        { title: "Terapia Individual", desc: "Sesiones individuales adaptadas a tus necesidades únicas." },
        { title: "Terapia de Pareja", desc: "Fortalece tu relación y mejora la comunicación." },
        { title: "Consejería Familiar", desc: "Resuelve conflictos y construye una dinámica familiar más saludable." },
        { title: "Terapia para Adolescentes", desc: "Apoyo para adolescentes que navegan por emociones complejas." },
      ]
    },
    pt: {
      title: "Suporte Adaptado ",
      titleItalic: "às suas Necessidades",
      subtitle: "Terapia compassiva para cada etapa da vida.",
      services: [
        { title: "Terapia Individual", desc: "Sessões individuais adaptadas às suas necessidades exclusivas." },
        { title: "Terapia de Casal", desc: "Fortaleça seu relacionamento e melhore a comunicação." },
        { title: "Aconselhamento Familiar", desc: "Resolva conflitos e construa uma dinâmica familiar mais saudável." },
        { title: "Terapia para Adolescentes", desc: "Apoio para adolescentes que navegam por emoções complexas." },
      ]
    }
  };

  const t = dict[lang] || dict.es;

  return (
    <div className="flex flex-col w-full bg-[var(--background)]">
      {/* Hero Section (Mindcare Interactive Slider) */}
      <HeroSlider key={`hero-${lang}`} lang={lang} />

      {/* Webinar Calendar Section */}
      <WebinarCalendar key={`calendar-${lang}`} lang={lang} />

      {/* Services Section */}
      <section className="w-full py-24 bg-[var(--background)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-[56px] font-serif text-[var(--foreground)] mb-6 leading-tight">
              {t.title}<span className="text-[var(--primary)] italic">{t.titleItalic}</span>
            </h2>
            <p className="text-[var(--text-gray)] text-lg">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.services.map((service, idx) => {
              const bgColors = ['bg-background-light', 'bg-highlight', 'bg-secondary', 'bg-accent-light'];
              const bgClass = bgColors[idx];

              return (
                <div key={idx} className="flex flex-col group h-full">
                  {/* Top Image Half */}
                  <div className="w-full h-64 relative rounded-t-[32px] overflow-hidden bg-gray-200">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop')` }}>
                    </div>
                  </div>
                  {/* Bottom Colored Half */}
                  <div className={`${bgClass} flex-grow rounded-b-[32px] p-8 md:p-10 flex flex-col justify-between items-start`}>
                    <div>
                      <h3 className={`text-[28px] font-serif mb-4 leading-tight ${idx === 2 || idx === 3 ? 'text-white' : 'text-foreground'}`}>{service.title}</h3>
                      <p className={`text-base leading-relaxed mb-6 ${idx === 2 || idx === 3 ? 'text-white/90' : 'text-text-dark'}`}>{service.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AIBAPT Stats Section */}
      <AibaptStats key={`stats-${lang}`} />

      {/* AIBAPT Trauma Info Section */}
      <AibaptTraumaInfo key={`trauma-${lang}`} />

      {/* AIBAPT Value Props Section */}
      <AibaptValueProps key={`benefits-${lang}`} />

      {/* AIBAPT Events Section */}
      <AibaptEvents key={`events-${lang}`} />

      {/* AIBAPT FAQ Section */}
      <AibaptFAQ key={`faq-${lang}`} />

    </div>
  );
}
