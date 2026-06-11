import Link from "next/link";

export default function AibaptEvents() {
  const events = [
    { title: "Protocolos Corporales en Terapia EMDR", type: "ENTRENAMIENTO | BRASIL", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" },
    { title: "Psicodrama Presencial: Técnicas Avanzadas", type: "PSICODRAMA | PRESENCIAL", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" },
    { title: "Treinamento Básico em Brainspotting", type: "BRAINSPOTTING | ONLINE", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <section className="w-full py-24 bg-background-light px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="max-w-2xl">
             <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-4">Desarrollo Profesional</p>
             <h2 className="text-4xl md:text-[56px] font-serif text-text-light leading-[1.1] mb-4">
               Próximos Eventos <span className="italic font-light text-primary">2026</span>
             </h2>
             <p className="text-text-dark text-lg">Entrenamientos intensivos y certificaciones internacionales para psicoterapeutas bajo el estándar de AIBAPT.</p>
           </div>
           <Link href="/eventos" className="inline-flex bg-transparent border border-primary text-primary px-8 py-3.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all text-[15px]">
             Ver Todos los Eventos
           </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {events.map((ev, i) => (
             <div key={i} className="group cursor-pointer">
                <div className="w-full h-[320px] rounded-2xl overflow-hidden mb-6 relative shadow-sm">
                   <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${ev.image}')` }}></div>
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                      <span className="text-primary text-[11px] font-bold tracking-[0.15em] uppercase">{ev.type}</span>
                   </div>
                </div>
                <h3 className="text-[26px] font-serif text-text-light group-hover:text-primary transition-colors leading-[1.3] mb-4 pr-4">{ev.title}</h3>
                <div className="flex items-center text-accent font-semibold text-sm group-hover:gap-2 transition-all tracking-wider uppercase">
                   Ver Detalles <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
